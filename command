# 1. 이미지 빌드
docker-compose up --build
이걸로 실행

docker build -t drtb:v2 .

# 2. 이미지 실행
docker run -p 3000:3000 drtb:v2
docker run -p 3000:3000 -v "$(pwd)":/app drtb:v1
docker-compose up --build
# 2-1. 윈도우 실행 안될떄
PS C:\Users\jwpg\Documents\GitHub\drtb> docker run -it -v "${PWD}:/app" drtb:v2 /bin/sh                   t -v "${PWD}:/app" drtb:v2 /bin/sh
>>
# npx vite ---version 
Need to install the following packages:
vite@6.0.7
Ok to proceed? (y)
npm install
# 1. Docker Hub 로그인
docker login


# 2. 이미지 태그 설정
docker tag drtb:v2 jwpgdx/drtb:v2

# 3. 이미지 업로드
docker push jwpgdx/drtb:v2


# 파이어베이스 functions 관련 
npm run lint -- --fix 
<- cd functions 폴더로 이동하고 검사
firebase deploy --only functions 
<- root에서 실행.
firebase deploy --only functions --debug
firebase deploy --only hosting,functions


Github
# 1. 변경된 파일들을 스테이징 영역에 추가
git add .

# 2. 스테이징된 파일을 커밋하고 메시지를 추가
git commit -m "메시지"
git commit -m "Fix: Multiple file updates and commit due to missed GitHub upload
- Fixed issues with login state management logic
- Improved API error handling
- Added session timer logic"
git commit -m "Release v2.0"

# 3. 로컬 변경 사항을 원격 리포지토리에 푸시
git push
git push origin main

# 4. 원격 리포지토리에서 최신 변경 사항을 로컬 리포지토리로 가져옴
git pull origin main


기능 추가:

    bash
    복사
    편집
    git commit -m "Add user profile page"
    버그 수정:
    
    bash
    복사
    편집
    git commit -m "Fix issue with login validation"
    디자인 수정:
    
    bash
    복사
    편집
    git commit -m "Update button styles on homepage"
    코드 리팩토링:
    
    bash
    복사
    편집
    git commit -m "REFACTOR Market List to TypeScript"
    테스트 추가:
    
    bash
    복사
    편집
    git commit -m "Add unit tests for user model"
    문서화:
    
    bash
    복사
    편집
    git commit -m "Update README with new setup instructions"
    기능 비활성화:
    
    bash
    복사
    편집
    git commit -m "Disable feature X due to bugs"