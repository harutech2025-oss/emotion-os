<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Emotion OS — Haru-Tech Lab</title>
  <meta name="description" content="감정 운영체제 진단 · 하루테크 랩" />
  <meta name="theme-color" content="#060a14" />

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />

  <style>
    /* 3. 모바일 글자 크기 마법: 기본 단위를 키워 전체적으로 시원하게 보이게 합니다 */
    html {
      font-size: 16px;
    }
    
    @media (max-width: 480px) {
      html {
        font-size: 18px; /* 화면이 작은 폰일수록 글씨를 더 키웁니다 */
      }
    }

    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
      -webkit-tap-highlight-color: transparent; /* 터치 시 파란 박스 제거 */
    }

    html, body, #root { 
      height: 100%; 
      width: 100%;
    }

    body { 
      background: #060a14; 
      color: #e8ecf4;
      overflow-x: hidden; /* 가로 스크롤 방지 */
      -webkit-text-size-adjust: none; /* 아이폰 가로 모드 시 글자 커짐 방지 */
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
