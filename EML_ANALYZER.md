# EML Analyzer - Email Analysis Report Tool

EML 파일들을 분석하여 목록 리포트 형식으로 보여주는 웹 애플리케이션입니다.

## 기능

- 📧 EML 파일 일괄 분석
- 📝 발신자, 제목, 발신일, 주요 내용 추출
- 📊 테이블 형식의 리포트 표시
- 🔄 실시간 분석

## 프로젝트 구조

```
backend/
├── index.js                    # Express 서버
├── package.json
├── src/
│   ├── services/
│   │   └── eml-parser.js      # EML 파싱 로직
│   └── routes/
│       └── emails.js          # API 라우트
└── data/
    └── emails/                # EML 파일 디렉토리

frontend/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js                # 진입점
    └── App.vue                # 메인 UI 컴포넌트
```

## 설치 및 실행

### 1. 백엔드 설정

```bash
cd backend
npm install
npm start
```

Backend가 `http://localhost:3001`에서 실행됩니다.

### 2. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

Frontend가 `http://localhost:5173`에서 실행됩니다.

### 3. EML 파일 추가

`backend/data/emails/` 폴더에 `.eml` 파일을 넣고 "Analyze EML Files" 버튼을 클릭합니다.

## API 엔드포인트

### GET /api/emails/analyze
EML 파일들을 분석하고 결과를 반환합니다.

**응답 예:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "sender": "sender@example.com",
      "subject": "Email Subject",
      "date": "2024-01-15",
      "mainContent": "Email body preview...",
      "fileName": "email.eml"
    }
  ]
}
```

## 기술 스택

- **Backend:** Node.js + Express
- **Frontend:** Vue.js 3 + Vite
- **EML 파싱:** mailparser
- **통신:** Axios

## 다음 단계

- [ ] 필터링 기능 (발신자, 날짜 범위)
- [ ] 정렬 기능
- [ ] 검색 기능
- [ ] CSV/JSON 내보내기
- [ ] 상세 이메일 뷰
- [ ] 첨부파일 지원

## 라이선스

MIT
