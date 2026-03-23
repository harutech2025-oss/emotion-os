<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#060a14" />
    <meta name="description" content="Emotion OS — Haru-Tech Lab" />
    
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

    <title>Emotion OS</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />

    <style>
      /* 4. 모바일 글자 크기 및 UI 최적화 */
      html { font-size: 16px; }
      @media (max-width: 480px) { html { font-size: 18px; } }

      * { 
        margin: 0; padding: 0; box-sizing: border-box; 
        -webkit-tap-highlight-color: transparent; 
      }
      html, body, #root { height: 100%; width: 100%; }
      body { 
        background: #060a14; color: #e8ecf4; 
        overflow-x: hidden; -webkit-text-size-adjust: none; 
      }
    </style>
  </head>
  <body>
    <noscript>이 앱을 실행하려면 자바스크립트 활성화가 필요합니다.</noscript>
    <div id="root"></div>
    </body>
</html>
