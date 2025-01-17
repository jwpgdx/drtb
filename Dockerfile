# Node.js 18 이미지 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 의존성 설치 캐시 최적화
COPY package*.json ./

# 의존성 설치
RUN npm ci --legacy-peer-deps  # npm install 대신 npm ci 사용

# 소스 코드 복사
COPY . .

# 개발 환경 변수 설정
ENV VITE_API_URL=http://host.docker.internal:3000

# Vite 포트 설정
ENV VITE_PORT=3000
ENV CHOKIDAR_USEPOLLING=true

# 개발 서버 실행 (포트 3000으로)
CMD ["npm", "run", "dev", "--", "--port", "3000"]
