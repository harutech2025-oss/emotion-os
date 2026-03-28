# Stato

오늘의 감정 상태를 읽고, 에너지가 새는 지점을 찾아, 하루를 다시 운영하게 만드는 앱

Powered by Emotion OS · by HaruTech Lab · Emotional Engineering Institute

🔗 [stato.kr](https://stato.kr)

---

## 소개

Stato는 감정공학 기반의 하루 운영 앱입니다.
감정 누수를 10%만 줄여도, 하루의 질은 달라집니다.

2분 점검 → 상태 해석 → 실행 패치 → 백과사전 연결까지 하나의 생태계로 이어집니다.

## 주요 기능

- 상태 점검 (Full Scan) — 21문항으로 현재 감정 운영 상태를 분석합니다.
- 7가지 누수 유형 (Q1~Q7) — 조급형, 과민형, 회피형, 분출형, 우울형, 비교형, 통제형
- 버그 감지 — 지금 시스템에서 활성화된 대표 버그를 사용자 언어로 보여줍니다.
- 실행 패치 (Hot Fix) — 상태에 따른 맞춤형 회복 행동을 타이머 기반으로 제공합니다. 15종.
- 가동률 재점검 (Re-check) — 패치 실행 후 변화를 측정합니다.
- 감정공학 백과사전 — Emotion OS, 5R, 호모 레귤란스, Bug/Patch 카드 등 40+ 문서 연결

## 기술 구조

```
Stato (사용자 브랜드)
├── Powered by Emotion OS (엔진)
│   ├── 21문항 Q1~Q7 진단 엔진
│   ├── 10종 Bug + BUG_ALIAS 사용자 언어 매핑
│   ├── 15종 실행형 Hot Fix (타이머 기반)
│   ├── 7종 Protocol + 9종 Practice
│   └── Trust Engine (D2) + 개인화 수집 (D3-alpha/beta)
├── Today (운영 콘솔)
│   ├── 가동률 + Daily Checklist
│   ├── Why Layer + Effect Layer
│   └── NextCheckinCard (시간대별 분기)
├── Reset (실행 엔진)
│   └── Hero 추천 1개 + 다른 리셋 보기
├── Library (감정공학 백과사전)
└── localStorage 기반 (서버 연동 추후 예정)
```

## 안전 고지

Stato는 심리 치료 도구가 아니며, 전문 의료 서비스를 대체하지 않습니다.
감정적 고통, 우울감, 불안 등이 일상생활에 심각한 지장을 줄 경우 반드시 전문 상담사 또는 정신건강의학과 전문의와 상담하시기 바랍니다.

## 라이선스

© 2026 HaruTech Lab. All Rights Reserved.
