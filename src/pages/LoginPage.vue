<template>
  <div>
    <p>f69a46644ab0e3d18a7373756fa41e4b63d38e5c6d8ff5</p>
    <p>
      OTZhMzgyMWYwMzk3ZTRlMjRlNjc0ZmIyZWZkZWZkMDM3NTcxNmFhNzEzNDY2M2RlOGY1MTYwODRmNzBjMA==
    </p>
    <input v-model="accessKey" placeholder="Enter Access Key" />
    <input v-model="secretKey" placeholder="Enter Secret Key" />
    <button @click="fetchApiKeyList">Get API Key List</button>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { KJUR } from "jsrsasign"; // JWT 생성 라이브러리
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/auth-store"; // Pinia Store 가져오기

// Pinia Store
const authStore = useAuthStore();

// State 정의
const accessKey = ref("");
const secretKey = ref("");
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// API 호출 함수
const fetchApiKeyList = async () => {
  if (!accessKey.value || !secretKey.value) {
    errorMessage.value = "Access Key와 Secret Key를 모두 입력해주세요.";
    successMessage.value = null;
    return;
  }

  const apiUrl = "https://api.bithumb.com";

  // JWT 토큰 생성
  const payload = {
    access_key: accessKey.value,
    nonce: uuidv4(),
    timestamp: Date.now(),
  };
  const header = { alg: "HS256", typ: "JWT" };
  const jwtToken = KJUR.jws.JWS.sign("HS256", header, payload, secretKey.value);

  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  try {
    const response = await axios.get(`${apiUrl}/v1/api_keys`, config);

    // 성공 처리
    successMessage.value = "검증에 성공했습니다!";
    errorMessage.value = null;

    // Pinia Store에 키 저장
    authStore.setKeys(accessKey.value, secretKey.value);

    console.log("API Key List:", response.data);
  } catch (error: any) {
    successMessage.value = null;

    if (error.response?.data?.error?.name === "jwt_verification") {
      errorMessage.value =
        "JWT 토큰 검증에 실패했습니다. Secret Key를 확인해주세요.";
    } else if (error.response?.data?.error?.name === "invalid_access_key") {
      errorMessage.value =
        "유효하지 않은 Access Key입니다. 올바른 키를 입력하세요.";
    } else {
      errorMessage.value = "서버와의 통신 중 오류가 발생했습니다. Bithumb API Key의 허용 IP주소를 확인해 주세요.";
      console.log("errorrr:", error);
    }
    console.error("Error:", error);
  }
};
</script>
