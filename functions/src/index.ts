import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import {KJUR} from "jsrsasign";
import {v4 as uuidv4} from "uuid";
import {defineSecret} from "firebase-functions/params";
import express from "express";
import cors from "cors";
import busboy from "busboy";
import type {Request, Response} from "express";

admin.initializeApp();

// Firebase Secret Manager에서 환경 변수 가져오기
// Firebase Secret Manager에서 환경 변수 가져오기
const MY_ENCRYPTION_SECRET = defineSecret("MY_ENCRYPTION_SECRET");

interface ApiKeyData {
  accessKey: string;
  secretKey: string;
}

/**
 * API 키를 암호화합니다. (accessKey, secretKey 모두 암호화, Firebase Secrets Management 사용)
 * @param {string} apiKey API 키 (accessKey 또는 secretKey)
 * @return {Promise<string>} 암호화된 API 키
 */
async function encryptApiKey(apiKey: string): Promise<string> {
  const algorithm = "aes-256-cbc";
  // 1. salt를 Buffer로 생성
  const saltBuffer = crypto.randomBytes(16);
  const saltHex = saltBuffer.toString("hex"); // 저장용 Hex 문자열

  const encryptionKey = MY_ENCRYPTION_SECRET.value();
  if (!encryptionKey) {
    throw new Error("Encryption key secret is not set.");
  }

  // 2. scryptSync에 Buffer 전달 (중요!)
  const key = crypto.scryptSync(encryptionKey, saltBuffer, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 3. Hex 문자열로 저장 (IV, saltHex, encrypted)
  return `${iv.toString("hex")}:${saltHex}:${encrypted}`;
}

// API 키 복호화 함수
async function decryptApiKey(encryptedApiKey: string): Promise<string> {
  try {
    // 1. 입력값 검증
    const parts = encryptedApiKey.split(":");
    if (parts.length !== 3) {
      throw new Error("Incorrect encrypted key format");
    }

    const [ivHex, saltHex, encrypted] = parts;


    const iv = Buffer.from(ivHex, "hex");
    const salt = Buffer.from(saltHex, "hex");

    // 3. 복호화 키 가져오기
    const encryptionKey = MY_ENCRYPTION_SECRET.value();
    if (!encryptionKey) {
      throw new Error("Encryption key is not set");
    }

    // 4. 키 유도
    const key = crypto.scryptSync(encryptionKey, salt, 32);

    // 5. 복호화 객체 생성
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    // 6. 복호화 수행
    let decrypted = decipher.update(encrypted, "hex", "utf8");

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("ERROR: 복호화 도중 문제 발생!", error);
    if (error instanceof Error) {
      console.error("ERROR: 상세 -", error.name, error.message);
    }
    throw new Error(`API 키 복호화 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
  }
}


/**
 * API 키를 Firebase Firestore에 저장합니다. (검증 제거, 암호화 저장, Secrets Management 사용)
 * @param {functions.https.CallableRequest<ApiKeyData>} request
 * API 키 데이터를 포함하는 요청
 * @returns {Promise<{ message: string }>} 성공 메시지
 */

export const saveApiKeys = functions.https.onCall(
  {secrets: [MY_ENCRYPTION_SECRET]}, // This is correct!
  async (request: functions.https.CallableRequest<ApiKeyData>) => {
    const data = request.data;
    if (!data || !data.accessKey || !data.secretKey) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "API 키가 누락되었습니다."
      );
    }
    // Check if auth context is available
    if (!request.auth?.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "사용자가 인증되지 않았습니다."
      );
    }
    try {
      // 로그로 MY_ENCRYPTION_SECRET 확인
      const encryptionKey = MY_ENCRYPTION_SECRET;
      if (!encryptionKey) {
        throw new Error("Encryption key secret is not set.");
      }
      const {accessKey, secretKey}: ApiKeyData = data;
      // API 키 암호화
      const encryptedAccessKey = await encryptApiKey(accessKey);
      const encryptedSecretKey = await encryptApiKey(secretKey);

      // users/{uid}/apiKeys 경로에 저장
      await admin.firestore().collection("users").doc(request.auth.uid).collection("apiKeys").doc("keys").set({
        accessKey: encryptedAccessKey,
        secretKey: encryptedSecretKey,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return {message: "API 키가 성공적으로 저장되었습니다."};
    } catch (error) {
      console.error("API 키 저장 실패:", error);
      throw new functions.https.HttpsError("internal", "API 키 저장에 실패했습니다.");
    }
  }
);


/**
 * Bithumb API 요청을 위한 인증 헤더를 생성합니다.
 * @param request
 * - { accessKey: string; secretKey: string; queryString?: string }
 * @returns {Promise<string>} JWT 토큰을 포함한 Authorization 헤더
 */


async function getApiKeys(userId: string): Promise<ApiKeyData> {
  try {
    // users/{uid}/apiKeys 경로에서 API 키 데이터 가져오기
    const apiKeyDoc = await admin.firestore().collection("users").doc(userId).collection("apiKeys").doc("keys").get();
    if (!apiKeyDoc.exists) {
      throw new Error("API 키가 존재하지 않습니다.");
    }
    const data = apiKeyDoc.data();
    if (!data || !data.accessKey || !data.secretKey) {
      throw new Error("저장된 API 키가 불완전합니다.");
    }
    // 복호화 로직
    const accessKey = await decryptApiKey(data.accessKey);
    const secretKey = await decryptApiKey(data.secretKey);
    return {accessKey, secretKey};
  } catch (error) {
    console.error("❌ API 키 조회 중 오류 발생:", error);
    if (error instanceof Error) {
      console.error("🚨 오류 세부 내용:", error.message);
    }
    throw error; // 오류 재전파
  }
}


// JWT 토큰 생성을 위한 공통 유틸리티 함수
export const generateJwtToken = (
  accessKey: string,
  secretKey: string,
  queryString?: string
): string => {
  const payload: {
    access_key: string;
    nonce: string;
    timestamp: number;
    query_hash?: string;
    query_hash_alg?: string;
  } = {
    access_key: accessKey,
    nonce: uuidv4(),
    timestamp: Date.now(),
  };

  if (queryString) {
    const hash = crypto.createHash("sha512");
    const queryHash = hash.update(queryString, "utf-8").digest("hex");
    payload.query_hash = queryHash;
    payload.query_hash_alg = "SHA512";
  } else {
    payload.query_hash = undefined;
    payload.query_hash_alg = undefined;
  }

  const header = {alg: "HS256", typ: "JWT"};
  const jwtToken = KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify(header),
    JSON.stringify(payload),
    secretKey
  );

  return jwtToken;
};

// Firestore에서 API 키를 가져와서 인증 헤더 생성
export const createAuthHeaderFromDb = functions.https.onCall(
  {secrets: [MY_ENCRYPTION_SECRET]}, // 옵션 객체에 secrets 배열 포함
  async (request: functions.https.CallableRequest<{ queryString?: string }>) => {
    const userId = request.auth?.uid;
    if (!userId) {
      console.error("❌ 인증되지 않은 사용자 접근");
      throw new functions.https.HttpsError("unauthenticated", "사용자가 인증되지 않았습니다.");
    }

    try {
      // API 키를 Firestore에서 가져옴
      const {accessKey, secretKey} = await getApiKeys(userId);

      const {queryString} = request.data;

      const jwtToken = generateJwtToken(accessKey, secretKey, queryString);

      return {authorization: `Bearer ${jwtToken}`};
    } catch (error) {
      console.error("❌ 인증 헤더 생성 실패:", error);
      if (error instanceof Error) {
        console.error("🚨 상세 오류 내용:", error.message);
      }
      throw new functions.https.HttpsError("internal", "인증 헤더 생성에 실패했습니다.");
    }
  }
);


export const createAuthHeader = functions.https.onCall(
  async (
    request: functions.https.CallableRequest<{
      accessKey: string;
      secretKey: string;
      queryString: string | null;
    }>
  ) => {
    const {accessKey, secretKey, queryString} = request.data;

    const jwtToken = generateJwtToken(accessKey, secretKey, queryString || undefined);

    return `Authorization: Bearer ${jwtToken}`;
  }
);


/**
 * Firebase Firestore에서 사용자의 API 키를 삭제합니다.
 * @param {functions.https.CallableRequest} request
 * @returns {Promise<{ message: string }>} 성공 메시지
 */
export const deleteApiKeys = functions.https.onCall(
  async (request: functions.https.CallableRequest) => {
    // 사용자 인증 확인
    const userId = request.auth?.uid;
    if (!userId) {
      console.error("❌ 인증되지 않은 사용자 접근");
      throw new functions.https.HttpsError(
        "unauthenticated",
        "사용자가 인증되지 않았습니다."
      );
    }
    try {
      // users/{uid}/apiKeys 경로에서 API 키 문서 확인
      const apiKeyDoc = await admin.firestore().collection("users").doc(userId).collection("apiKeys").doc("keys").get();
      if (!apiKeyDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "삭제할 API 키가 존재하지 않습니다."
        );
      }
      // API 키 문서 삭제
      await admin.firestore().collection("users").doc(userId).collection("apiKeys").doc("keys").delete();
      return {message: "API 키가 성공적으로 삭제되었습니다."};
    } catch (error) {
      console.error("❌ API 키 삭제 실패:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error; // 이미 HttpsError이면 그대로 전달
      }
      throw new functions.https.HttpsError(
        "internal",
        "API 키 삭제에 실패했습니다."
      );
    }
  }
);


const app = express();
app.use(cors({origin: true}));

app.post("/uploadImage", async (req: Request, res: Response) => {
  // 여기서 new 키워드를 추가하여 ESLint 오류 해결
  const busboyInstance = busboy({headers: req.headers});
  const fileData: { buffer: Buffer; filename: string } = {
    buffer: Buffer.alloc(0),
    filename: "",
  };

  busboyInstance.on("file", (fieldname: string, file: NodeJS.ReadableStream, filename: { filename: string }) => {
    fileData.filename = filename.filename;

    file.on("data", (data: Buffer) => {
      fileData.buffer = Buffer.concat([fileData.buffer, data]);
    });
  });

  busboyInstance.on("finish", async () => {
    try {
      const bucket = admin.storage().bucket();
      const file = bucket.file(`airdrops/${fileData.filename}`);

      await file.save(fileData.buffer, {
        metadata: {
          contentType: "image/webp", // 필요시 contentType 자동 감지 로직도 가능
        },
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2030",
      });

      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json({url});
    } catch (err) {
      res.set("Access-Control-Allow-Origin", "*"); // 에러 응답에도 필요할 수 있음
      return res.status(500).json({error: "이미지 업로드 실패"});
    }
  });

  req.pipe(busboyInstance);
});

exports.api = functions.https.onRequest(app);
