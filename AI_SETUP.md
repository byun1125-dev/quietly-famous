# 🤖 AI 기능 설정 가이드

## Google Gemini API 무료 키 발급받기

1. **Google AI Studio 접속**
   - https://aistudio.google.com/app/apikey 방문

2. **Google 계정으로 로그인**

3. **API 키 생성**
   - "Create API Key" 버튼 클릭
   - 새 프로젝트 생성 또는 기존 프로젝트 선택
   - API 키가 생성되면 복사

4. **환경 변수 설정**

   **로컬 개발:**
   ```bash
   # 프로젝트 루트에 .env.local 파일 생성
   echo "GEMINI_API_KEY=여기에_발급받은_API_키_붙여넣기" > .env.local
   ```

   **Netlify 배포:**
   - Netlify 대시보드 → Site settings → Environment variables
   - Key: `GEMINI_API_KEY`
   - Value: 발급받은 API 키 입력
   - Save

5. **패키지 설치**
   ```bash
   npm install
   ```

6. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

## 무료 사용량

- **일일 무료**: 15 requests/분, 1,500 requests/일
- **월간 무료**: 60 requests/분, 50,000 requests/월

일반적인 사용으로는 충분합니다! 🎉

## 문제 해결

**API 키 오류가 발생하면:**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- API 키 앞뒤에 공백이나 따옴표가 없는지 확인
- 개발 서버를 재시작했는지 확인

**AI 변형이 실패하면:**
- 자동으로 폴백(간단한 패턴 기반 변형)으로 전환됩니다
- 콘솔에서 에러 메시지 확인
