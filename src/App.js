import React, { useState, useEffect, useRef, useReducer, useContext, createContext, useCallback, useMemo, memo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   Stato v4.9.2 — Powered by Emotion OS — Standalone (Auto-generated)
   Haru-Tech Lab

   ╔═══════════════════════════════════════════════════════════════╗
   ║  ⛔ 이 파일을 직접 수정하지 마세요!                           ║
   ║                                                               ║
   ║  이 파일은 scripts/build-standalone.cjs가 src/에서             ║
   ║  자동 생성한 배포용 번들입니다.                                ║
   ║                                                               ║
   ║  수정 흐름:                                                   ║
   ║    1. src/ 모듈에서 변경                                      ║
   ║    2. node scripts/build-standalone.cjs 로 재생성             ║
   ║    3. 이 파일은 생성 결과물 — 기준본이 아닙니다               ║
   ║                                                               ║
   ║  이 원칙을 지키지 않으면 다음 빌드에서 수정이 유실됩니다.     ║
   ╚═══════════════════════════════════════════════════════════════╝

   생성 시각: 2026-03-25T09:00:00.000Z

   v4.9.2 변경 사항:
   - Fix 1: state 변수 fs → fullScan (유틸 함수 fs() 섀도잉 해소)
   - Fix 2: 9개 useState → useReducer + AppContext (props drilling 완화)
   - Fix 3: calcRecheck pq/sq 재산정 정책 명시 (10%p 임계값 기반 전환)
   - Hotfix: morning Check-in 라벨/CTA 정합성 복원
   - Hotfix: ctxValue useMemo 안정화
   ═══════════════════════════════════════════════════════════════════ */

// ─── CONFIG ────────────────────────────────────────────────
// 저장소 키 상수 — 서버(DB) 연동 전환 시 이 파일만 교체
const STORAGE_KEY = "emotion-os-v4";
const STORAGE_KEY_V3 = "emotion-os-v3";
const STORAGE_KEY_V2 = "emotion-os-v2";
const STORAGE_KEY_V1 = "emotion-os-v1";
const ALOG_KEY = "emotion-os-v4-actionlog";
const ALOG_KEY_V3 = "emotion-os-v3-actionlog";
const ALOG_KEY_OLD = "emotion-os-actionlog";
const PERSONAL_KEY = "stato-personal-v1";
const ONBOARD_KEY = "stato-onboard-done";
const FONT_CDN = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css";


// ═══ M1: DATA ════════════════════════════════════════════════════
// M1: DATA — 질문, 라벨, DB, 노션 링크
// 의존성: 없음 (순수 데이터)

// ─── 21문항 (Q1~Q7 × 3) ───
const QS = [
  { id:"I01", p:"최근 2주간, 머릿속 엔진이 꺼지지 않아 쉬는 시간에도 할 일이 계속 맴돌았나요?", rcP:"지금 머릿속 RPM이 높아서 쉽게 가라앉지 않는 느낌인가요?", pq:"Q1", sq:"Q6", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I02", p:"최근 2주간, 빨리 끝내려다 중요한 걸 놓치거나 실수한 적이 있었나요?", rcP:"지금 머릿속 RPM이 높아서 쉽게 가라앉지 않는 느낌인가요?", pq:"Q1", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I03", p:"최근 2주간, 일이 조금만 지연돼도 몸이 먼저 긴장되거나 조급해졌나요?", rcP:"지금 머릿속 RPM이 높아서 쉽게 가라앉지 않는 느낌인가요?", pq:"Q1", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I04", p:"최근 2주간, 주변 소음이나 사람들의 말투가 평소보다 더 거슬렸나요?", rcP:"지금 주변 자극이 필터 없이 바로 들어오는 느낌인가요?", pq:"Q2", sq:"Q4", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I05", p:"최근 2주간, 사람이 많은 곳에 다녀오면 유독 쉽게 지쳤나요?", rcP:"지금 주변 자극이 필터 없이 바로 들어오는 느낌인가요?", pq:"Q2", sq:"Q5", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I06", p:"최근 2주간, 특별히 힘든 일은 없었는데도 하루 끝에 감각이 막힌 느낌이 들었나요?", rcP:"지금 주변 자극이 필터 없이 바로 들어오는 느낌인가요?", pq:"Q2", sq:"Q3", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I07", p:"최근 2주간, 마음이 답답한데도 이유를 딱 집어 설명하기 어려운 날이 많았나요?", rcP:"지금 내 마음 상태가 흐릿해서 정확히 읽기 어려운가요?", pq:"Q3", sq:"Q2", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I08", p:"최근 2주간, 속상한 일이 있어도 '별일 아니야'라며 넘긴 적이 많았나요?", rcP:"지금 내 마음 상태가 흐릿해서 정확히 읽기 어려운가요?", pq:"Q3", sq:"Q7", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I09", p:"최근 2주간, 이미 끝난 일인데도 마음 한쪽에 묘하게 남아 있는 느낌이 있었나요?", rcP:"지금 내 마음 상태가 흐릿해서 정확히 읽기 어려운가요?", pq:"Q3", sq:"Q5", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I10", p:"최근 2주간, 참았던 짜증이나 화가 어느 순간 갑자기 터진 적이 있었나요?", rcP:"지금 감정이 안에서 계속 쌓여 넘칠 듯한 느낌인가요?", pq:"Q4", sq:"Q1", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I11", p:"최근 2주간, 감정이 올라오면 말이 빨라지거나 거칠어졌나요?", rcP:"지금 감정이 안에서 계속 쌓여 넘칠 듯한 느낌인가요?", pq:"Q4", sq:"Q1", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I12", p:"최근 2주간, 감정을 표현한 뒤에도 개운함보다 피로감이 더 남았나요?", rcP:"지금 감정이 안에서 계속 쌓여 넘칠 듯한 느낌인가요?", pq:"Q4", sq:"Q6", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I13", p:"최근 2주간, 몸이 무겁게 느껴져 시작 자체가 잘 안 되는 날이 있었나요?", rcP:"지금 배터리가 거의 바닥이라 움직이기 버거운 상태인가요?", pq:"Q5", sq:"Q3", r1:"R4", leak:"회복단", bug:"BDY-BOOTFAIL-01", bugL:"시동 실패 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I14", p:"최근 2주간, 별로 한 일이 없는데도 저녁이면 기운이 거의 빠진 느낌이었나요?", rcP:"지금 배터리가 거의 바닥이라 움직이기 버거운 상태인가요?", pq:"Q5", sq:"Q2", r1:"R4", leak:"회복단", bug:"BDY-LOWPOWERLOCK-01", bugL:"저출력 고착 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I15", p:"최근 2주간, 쉬고 나서 다시 움직이기가 오히려 더 어렵게 느껴졌나요?", rcP:"지금 배터리가 거의 바닥이라 움직이기 버거운 상태인가요?", pq:"Q5", sq:"Q6", r1:"R4", leak:"회복단", bug:"BDY-BEDLOCK-01", bugL:"침대 고착 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I16", p:"최근 2주간, SNS나 타인의 소식을 보고 내 상태가 갑자기 작아 보였나요?", rcP:"지금 다른 사람과 나를 비교하며 마음이 흔들리고 있나요?", pq:"Q6", sq:"Q5", r1:"R1", leak:"처리단", bug:"MND-SELFDEVALUE-01", bugL:"자기비하 증폭 버그", patch:"Permission Reset", patchL:"허용 기준 복구 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I17", p:"최근 2주간, 남들과 비교하며 내 속도나 방향이 흔들린 적이 있었나요?", rcP:"지금 다른 사람과 나를 비교하며 마음이 흔들리고 있나요?", pq:"Q6", sq:"Q1", r1:"R1", leak:"처리단", bug:"MND-FALSEPATCH-01", bugL:"가짜 패치 버그", patch:"Benchmark Filter", patchL:"기준 필터 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I18", p:"최근 2주간, 다른 기준에 맞춰 내 하루를 다시 바꾸고 싶은 충동이 들었나요?", rcP:"지금 다른 사람과 나를 비교하며 마음이 흔들리고 있나요?", pq:"Q6", sq:"Q7", r1:"R1", leak:"처리단", bug:"MND-SELFDEVALUE-01", bugL:"자기비하 증폭 버그", patch:"Permission Reset", patchL:"허용 기준 복구 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I19", p:"최근 2주간, 예상과 다르게 흘러가면 다시 통제하지 않으면 불안했나요?", rcP:"지금 너무 많은 걸 통제하려 해서 마음이 계속 긴장된 상태인가요?", pq:"Q7", sq:"Q3", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
  { id:"I20", p:"최근 2주간, 작은 실수나 흐트러짐을 그냥 넘기기 어려웠나요?", rcP:"지금 너무 많은 걸 통제하려 해서 마음이 계속 긴장된 상태인가요?", pq:"Q7", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
  { id:"I21", p:"최근 2주간, 쉬는 시간에도 계속 정리하거나 맞추려는 생각이 멈추지 않았나요?", rcP:"지금 너무 많은 걸 통제하려 해서 마음이 계속 긴장된 상태인가요?", pq:"Q7", sq:"Q5", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
];

// ─── 라벨 사전 ───
const QL  = { Q1:"Q1 조급형", Q2:"Q2 과민형", Q3:"Q3 회피형", Q4:"Q4 분출형", Q5:"Q5 우울형", Q6:"Q6 비교형", Q7:"Q7 통제형" };
const QSH = { Q1:"조급", Q2:"과민", Q3:"회피", Q4:"분출", Q5:"우울", Q6:"비교", Q7:"통제" };
const RL  = { R1:"R1 인지", R2:"R2 조절", R3:"R3 공명", R4:"R4 회복", R5:"R5 갱신" };
const RD  = {
  R1:"감정을 읽고 구분하는 기능에 부담이 높습니다.",
  R2:"속도, 경계, 긴장을 조절하는 기능에 부담이 높습니다.",
  R3:"관계 안에서 감정을 조율하고 반응하는 기능에 부담이 높습니다.",
  R4:"가용성을 복구하고 다시 살아나는 기능에 부담이 높습니다.",
  R5:"반복 패턴을 수정하고 기준을 세우는 기능에 부담이 높습니다.",
};
const LD = {
  "입력단":"외부 자극이 과도하게 들어와 시스템이 쉽게 과부하되는 구간입니다.",
  "처리단":"감정을 해석하고 의미를 붙이는 과정에서 정체나 왜곡이 생기는 구간입니다.",
  "조절단":"속도, 긴장, 통제 조절이 어려워 과열되기 쉬운 구간입니다.",
  "출력단":"감정이 말이나 행동으로 전환될 때 폭주하거나 손실이 생기는 구간입니다.",
  "회복단":"에너지 복구와 가동성 재확보가 잘 이루어지지 않는 구간입니다.",
  "갱신단":"반복 패턴을 업데이트하지 못해 같은 오류가 재생되는 구간입니다.",
};
const SCALE = [
  { v:0, l:"전혀 아니다" },
  { v:1, l:"가끔 그렇다" },
  { v:2, l:"자주 그렇다" },
  { v:3, l:"거의 항상 그렇다" },
];

// ─── Hot Fix DB (exec: 실행형 여부) ───
const HOTFIX_DB = [
  { ref:"universal-reset", guideText:"1. 눈을 감으세요\n2. 코로 4초 들이마십니다\n3. 4초 멈춥니다\n4. 입으로 6초 내쉽니다\n5. 이 호흡만 반복하세요", label:"3분 리셋", desc:"모든 것을 멈추고 3분간 아무것도 하지 않습니다. 눈을 감고 호흡만 느끼세요.", cta:"지금 리셋하기", priority:0, bandMatch:["overload","low"], qMatch:null, exec:true, durationSec:180 },
  { ref:"slow-down", guideText:"1. 지금 하던 일을 멈추세요\n2. 손 위에 손을 올리세요\n3. 숨을 한번 깊이 쉬세요\n4. 아까 속도의 절반으로\n   다시 시작하세요", label:"속도 낮추기", desc:"지금 하고 있는 모든 일의 속도를 의식적으로 절반으로 줄입니다.", cta:"5분 감속 시작", priority:1, bandMatch:null, qMatch:["Q1"], exec:true, durationSec:300 },
  { ref:"root-reset", guideText:"1. 지금 통제하려는 것 하나를\n   머릿속에 떠올리세요\n2. '이건 안 해도 된다'고\n   소리 없이 말하세요\n3. 손을 펴고 힘을 빼세요", label:"통제 내려놓기", desc:"지금 통제하려는 것 하나를 골라 1분간 일부러 놓아봅니다. 완벽하지 않아도 세상은 안 무너집니다.", cta:"1분 내려놓기", priority:1, bandMatch:null, qMatch:["Q7"], exec:true, durationSec:60 },
  { ref:"sensory-reset", guideText:"1. 핸드폰 알림을 끄세요\n2. 눈을 감으세요\n3. 코로 4초 들이마시고\n   6초 내쉬세요\n4. 소리가 들려도\n   따라가지 마세요", label:"자극 차단", desc:"소리, 빛, 알림 등 외부 입력을 5분간 최소화합니다.", cta:"5분 차단 시작", priority:1, bandMatch:null, qMatch:["Q2"], exec:true, durationSec:300 },
  { ref:"stop-signal", guideText:"1. 지금 반응하지 마세요\n2. 속으로 10을 세세요\n3. 10 세는 동안\n   아무 말도 하지 마세요", label:"출력 멈춤", desc:"말하거나 반응하려는 충동을 10초간 멈추고 내부를 먼저 점검합니다.", cta:"10초 멈춤 시작", priority:1, bandMatch:null, qMatch:["Q4"], exec:true, durationSec:10 },
  { ref:"baseline-reset", guideText:"1. 자리에서 일어나세요\n2. 물 한 잔을 따르세요\n3. 천천히 마시세요\n4. 창문을 열거나\n   바깥을 한번 보세요", label:"기준선 복구", desc:"가장 작은 움직임 하나(물 한 잔, 창문 열기)로 시스템 재가동을 시도합니다.", cta:"1분 회복 시작", priority:1, bandMatch:null, qMatch:["Q5"], exec:true, durationSec:60 },
  { ref:"voice-activate", guideText:"1. 눈을 감으세요\n2. '지금 나는 어떤 느낌이지?'\n   물어보세요\n3. 한 단어로 이름을 붙이세요\n4. 정확하지 않아도 됩니다", label:"감정 이름 붙이기", desc:"지금 느끼는 것에 한 단어로 이름을 붙여봅니다. 정확하지 않아도 됩니다.", cta:"1분 감정 읽기", priority:2, bandMatch:null, qMatch:["Q3"], exec:true, durationSec:60 },
  { ref:"permission-reset", guideText:"1. 오늘 한 것 하나를 떠올리세요\n2. 아무리 작아도 됩니다\n3. '이것으로 충분하다'\n   소리 없이 말하세요\n4. 숨을 한번 깊이 내쉬세요", label:"허용 기준 복구", desc:"'지금까지 한 것'을 하나 떠올리고 그것으로 충분하다고 허락합니다.", cta:"1분 기준 복구", priority:2, bandMatch:null, qMatch:["Q6"], exec:true, durationSec:60 },
  { ref:"leak-note", guideText:"1. 오늘 가장 에너지가 빠진\n   순간을 떠올리세요\n2. 그 장면을 한 문장으로\n   머릿속에 정리하세요\n3. 정확하지 않아도 됩니다", label:"누수 순간 기록", desc:"오늘 가장 많이 에너지가 샌 순간을 한 문장으로 적습니다. 정확하지 않아도 됩니다.", cta:"1분 기록 시작", priority:2, bandMatch:null, qMatch:["Q3","Q4","Q5"], exec:true, durationSec:60 },
  { ref:"micro-move", guideText:"1. 발바닥을 바닥에 붙이세요\n2. 양팔을 한번 위로 드세요\n3. 천천히 내리세요\n4. 자리에서 일어나세요\n5. 딱 여기까지만 하세요", label:"1분 마이크로 무빙", desc:"발을 바닥에 붙이고, 팔을 한번 들고, 자리에서 일어섭니다. 딱 이것만 합니다.", cta:"1분 움직임 시작", priority:2, bandMatch:null, qMatch:["Q5"], exec:true, durationSec:60 },
  { ref:"env-reset", guideText:"1. 핸드폰 알림을 끄세요\n2. 주변 소음을 줄이세요\n3. 조명이 밝으면 낮추세요\n4. 눈을 감고\n   코로 4초 들이마시고\n   6초 내쉬세요", label:"환경 정리", desc:"알림을 끄고, 조명을 낮추거나, 소음을 줄입니다. 5분간 외부 입력을 최소화합니다.", cta:"5분 환경 정리", priority:2, bandMatch:null, qMatch:["Q2","Q1"], exec:true, durationSec:300 },
  { ref:"focus-anchor", guideText:"1. 눈앞의 물건 하나를 고르세요\n2. 그것의 색, 모양, 질감을\n   천천히 관찰하세요\n3. 다른 생각이 오면\n   다시 그 물건으로 돌아오세요\n4. 이것만 반복하세요", label:"주의력 앵커", desc:"지금 눈앞의 한 가지(손, 물건, 소리)에만 3분간 주의를 고정합니다. 다른 생각이 와도 다시 돌아옵니다.", cta:"3분 앵커 시작", priority:2, bandMatch:null, qMatch:["Q1","Q7"], exec:true, durationSec:180 },
  { ref:"compare-block", guideText:"1. SNS 앱을 닫으세요\n2. 알림을 끄세요\n3. '오늘 내가 한 것 하나'를\n   떠올리세요\n4. 그것만으로 오늘은 충분합니다", label:"비교 차단", desc:"SNS, 알림, 타인의 소식을 닫고 2분간 나만의 기준으로 오늘을 봅니다.", cta:"2분 차단 시작", priority:2, bandMatch:null, qMatch:["Q6"], exec:true, durationSec:120 },
  { ref:"body-scan", guideText:"1. 눈을 감으세요\n2. 머리 꼭대기에 주의를 두세요\n3. 천천히 아래로 내려가세요\n   이마 → 턱 → 어깨 → 팔\n   → 배 → 다리 → 발끝\n4. 긴장이 느껴지면\n   숨을 내쉬며 풀어주세요", label:"바디 스캔", desc:"눈을 감고 머리 → 어깨 → 배 → 다리 → 발끝 순서로 긴장을 알아차리고 내려놓습니다.", cta:"3분 스캔 시작", priority:2, bandMatch:null, qMatch:["Q3","Q5"], exec:true, durationSec:180 },
  { ref:"boundary-line", guideText:"1. 지금 신경 쓰이는 요청이나\n   기대 하나를 떠올리세요\n2. '이건 지금 안 해도 된다'\n   소리 없이 말하세요\n3. 숨을 내쉬고 내려놓으세요", label:"경계 한 줄", desc:"지금 당장 응하지 않아도 되는 요청이나 기대 하나를 정하고, 그것만 미뤄둡니다.", cta:"1분 경계 설정", priority:2, bandMatch:null, qMatch:["Q2","Q4"], exec:true, durationSec:60 },
];

// ─── Protocol DB (7, Q별 1개) ───
const PROTO_DB = [
  { ref:"slow-proto",      label:"슬로모드 프로토콜",     desc:"말의 속도를 늦추고, 결론을 서두르지 않고, 한 번에 하나만 처리합니다.", qMatch:["Q1"] },
  { ref:"sensory-proto",   label:"감각 보호 프로토콜",    desc:"자극이 많은 환경에서 의식적으로 입력량을 줄이는 운영 가이드입니다.", qMatch:["Q2"] },
  { ref:"naming-proto",    label:"감정읽기 프로토콜",     desc:"하루에 한 번, 지금 느끼는 감정에 이름을 붙이는 연습입니다.", qMatch:["Q3"] },
  { ref:"output-proto",    label:"출력 제어 프로토콜",    desc:"감정이 올라올 때 '10초 멈춤 → 한 문장 정리 → 전달'의 3단계를 따릅니다.", qMatch:["Q4"] },
  { ref:"coldstart-proto", label:"콜드 스타트 프로토콜",  desc:"시동이 안 걸릴 때 '가장 작은 움직임 하나'부터 시작합니다.", qMatch:["Q5"] },
  { ref:"benchmark-proto", label:"기준 필터 프로토콜",    desc:"비교 충동이 올 때 '어제보다 나아진 점 하나'를 떠올립니다.", qMatch:["Q6"] },
  { ref:"drop-proto",      label:"통제 내려놓기 프로토콜", desc:"완벽하게 정리하려는 충동이 올 때, 의도적으로 80%에서 멈춥니다.", qMatch:["Q7"] },
];

// ─── Practice DB (9, Q매칭) ───
const PRAC_DB = [
  { ref:"slow-breath",  label:"3분 감속 호흡",        desc:"들숨 4초, 날숨 6초로 호흡 속도를 의식적으로 늦추는 연습입니다.", qMatch:["Q1","Q7"] },
  { ref:"stim-log",     label:"자극 일지 기록",        desc:"오늘 가장 많은 에너지를 뺏은 자극 3개를 적어봅니다.", qMatch:["Q2"] },
  { ref:"emo-name",     label:"감정 이름 붙이기",      desc:"지금 느끼는 것에 3초 안에 한 단어로 이름을 붙이는 훈련입니다.", qMatch:["Q3"] },
  { ref:"10sec-pause",  label:"10초 멈춤 연습",        desc:"감정이 올라올 때 반응 전에 속으로 10을 세는 연습입니다.", qMatch:["Q4"] },
  { ref:"micro-move", guideText:"발을 바닥에 붙이고,\n팔을 한번 들고, 자리에서 일어섭니다.",   label:"1분 마이크로 무빙",     desc:"발만 바닥에 대기, 팔 한번 들기 같은 최소 움직임으로 재가동을 연습합니다.", qMatch:["Q5"] },
  { ref:"process-chk",  label:"과정 체크 연습",        desc:"오늘 '결과'가 아닌 '과정'에서 잘한 점 하나를 떠올리는 연습입니다.", qMatch:["Q6"] },
  { ref:"80pct-rule",   label:"80% 허용 연습",         desc:"오늘 하나의 일을 의도적으로 80%에서 멈추는 연습입니다.", qMatch:["Q7"] },
  { ref:"trigger-sig",  label:"Trigger Signal 연습",   desc:"손바닥(Stop), 손가락 2개(Time-out), [프리즈] 키워드를 미리 연습합니다.", qMatch:["Q3","Q4"] },
  { ref:"safe-exit",    label:"Safe Exit 문장 연습",   desc:"\"20분간 연결을 끊지만 반드시 다시 연결합니다\" 문장을 미리 연습합니다.", qMatch:["Q3","Q4"] },
];

// ─── Library (16 items) ───
const LIB = [
  { cat:"핵심 프레임", title:"Emotion OS",          desc:"감정을 운영체제로 읽는 상위 프레임",       tip:"핵심 원칙: 성격이 아니라 현재 시스템 상태다", url:"https://www.notion.so/Emotion-OS-324604b060a4805abeb8cd69aca313c9" },
  { cat:"핵심 프레임", title:"5R 기본 구조",         desc:"인지 → 조절 → 공명 → 회복 → 갱신",       tip:"감정은 5단계 순환으로 흐른다. 어디서 막혔는지가 핵심", url:"https://www.notion.so/5R-v1-3-320604b060a480f9bbbcd74d09be6ec8" },
  { cat:"핵심 프레임", title:"감정공학이란 무엇인가", desc:"감정공학의 정의와 목적",                   tip:"감정을 고치는 게 아니라, 운영 가능한 언어로 바꾸는 것", url:"https://www.notion.so/v1-3-31f604b060a480a88245fb446ea1bb1a" },
  { cat:"핵심 프레임", title:"호모 레귤란스",         desc:"Emotion OS를 일상적으로 가동하는 인간형",  tip:"회복은 사치가 아니라 전략. 조절하는 인간이 지속한다", url:"https://www.notion.so/Homo-Regulans-v2-5-321604b060a4809ab446f745c72b7e68" },
  { cat:"운영 구조",   title:"감정누수 유형 총론",   desc:"7가지 감정 누수 패턴 분류",               tip:"Q1 조급~Q7 통제, 에너지가 새는 7가지 방식", url:"https://www.notion.so/Q1-Q7-v1-3-325604b060a480b18e42f438fa5b7e43" },
  { cat:"운영 구조",   title:"Bug란 무엇인가",       desc:"반복되는 운영 오류의 표준 단위",          tip:"Bug는 성격 결함이 아니라 반복 패턴의 이름표", url:"https://www.notion.so/Bug-329604b060a4806e9af4e2720535a00e" },
  { cat:"운영 구조",   title:"Patch란 무엇인가",     desc:"Bug에 개입하는 수정 조치",               tip:"추천 패치: Root Reset, Sensory Reset, Cooldown", url:"https://www.notion.so/Patch-329604b060a480d099a5c020cbe22409" },
  { cat:"OS 영역",     title:"Body OS",              desc:"몸의 가동성과 회복을 읽는 프레임",        tip:"수면·식사·운동이 아니라, 몸이 보내는 신호를 읽는 것", url:"https://www.notion.so/Body-OS-329604b060a48005be9cc00ad34b32f7" },
  { cat:"OS 영역",     title:"Relation OS",          desc:"관계 안의 경계와 공명을 읽는 프레임",     tip:"관계 마찰은 성격 문제가 아니라 필터 용량 문제", url:"https://www.notion.so/Relation-OS-329604b060a480dabedce49cd532b625" },
  { cat:"심화 주제",   title:"회복과 감각 리셋의 원리", desc:"R4 회복의 구조와 실전 적용",           tip:"회복은 쉬는 게 아니라 감각을 리셋하는 것", url:"https://www.notion.so/R4-v1-3-326604b060a480829a7eef09c9f885df" },
  { cat:"심화 주제",   title:"감정 경계의 필요성",   desc:"R2 조절과 경계 설정의 원리",             tip:"추천 패치: Boundary Filter Patch", url:"https://www.notion.so/R2-v1-3-326604b060a4801bb755fa9585666a26" },
  { cat:"심화 주제",   title:"감정억제와 왜곡분출",   desc:"억압과 폭발의 구조적 분석",              tip:"Q3 회피와 Q4 분출은 같은 뿌리의 다른 출구", url:"https://www.notion.so/v1-3-320604b060a48025a30cf1ff68024a6d" },
  { cat:"심화 주제",   title:"비교 중독과 자기비하",   desc:"Q6 비교형의 심층 메커니즘",             tip:"추천 패치: Permission Reset Patch", url:"https://www.notion.so/v1-3-320604b060a48090a854cb5d62a7daf1" },
  { cat:"심화 주제",   title:"관계피로와 경계 설정",   desc:"관계 안에서 경계가 무너지는 구조",      tip:"관계 피로의 80%는 경계 부재에서 온다", url:"https://www.notion.so/v1-3-320604b060a480d99d1ed16bcf05b560" },
  { cat:"심화 주제",   title:"한국형 번아웃의 구조",   desc:"한국 사회 특유의 소진 메커니즘",        tip:"성실+원만+충성의 3중 과부하 구조", url:"https://www.notion.so/v1-3-320604b060a48047a6fbd5ed8452de6a" },
  { cat:"실전 도구",   title:"리커버리 프로토콜",     desc:"회복을 위한 구조화된 운영 절차",         tip:"low/overload 구간에서 가장 먼저 실행할 절차", url:"https://www.notion.so/Recovery-Protocol-v1-4-327604b060a4808f9201d83d9a9c13bb" },
];
const LCATS = ["핵심 프레임","운영 구조","OS 영역","심화 주제","실전 도구"];

// ─── 노션 링크 ───
const NL = { bug:"https://www.notion.so/Bug-329604b060a4806e9af4e2720535a00e", patch:"https://www.notion.so/Patch-329604b060a480d099a5c020cbe22409", q:"https://www.notion.so/Q1-Q7-v1-3-325604b060a480b18e42f438fa5b7e43", r5:"https://www.notion.so/5R-v1-3-320604b060a480f9bbbcd74d09be6ec8", rec:"https://www.notion.so/Recovery-Protocol-v1-4-327604b060a4808f9201d83d9a9c13bb" };
const QLinks = {"Q1":"https://www.notion.so/Q1-326604b060a4805497f1e228d3d81440","Q2":"https://www.notion.so/Q2-326604b060a480018557ebf2279df5fb","Q3":"https://www.notion.so/Q3-326604b060a480ef8fedfbdb19e18084","Q4":"https://www.notion.so/Q4-326604b060a4801eb9b1e4a85a24bed2","Q5":"https://www.notion.so/Q5-326604b060a4802f83c1fe4d5e717c69","Q6":"https://www.notion.so/Q6-326604b060a480db8ee3e7453a8947bc","Q7":"https://www.notion.so/Q7-326604b060a480478d6ff427b517ec78"};
const BLinks = {"MND-OVERCLOCK-01":"https://www.notion.so/326604b060a48067bd84e0dd1fdf9f07","MND-INPUTFLOOD-01":"https://www.notion.so/326604b060a48019be9bcac800bc768d","MND-EMOSUPPRESS-01":"https://www.notion.so/326604b060a480f0be69e58d38f61451","MND-OUTPUTHEAT-01":"https://www.notion.so/326604b060a480edb48be7ef7259bad4","BDY-BOOTFAIL-01":"https://www.notion.so/326604b060a480e49d80de69bb688bfa","BDY-LOWPOWERLOCK-01":"https://www.notion.so/326604b060a480c1bbedf33b4e3325f1","BDY-BEDLOCK-01":"https://www.notion.so/326604b060a4800f9195e1879f6adaba","MND-SELFDEVALUE-01":"https://www.notion.so/326604b060a4805bb3e4f39fe27642e7","MND-FALSEPATCH-01":"https://www.notion.so/326604b060a4809c9b66f76c9631835a","MND-OVERCONTROL-01":"https://www.notion.so/326604b060a4804da9e9d0927b1af375"};
const PLinks = {"Slow-Down Patch":"https://www.notion.so/Slow-Down-Patch-326604b060a480a29a93c43517f3560d","Sensory Reset":"https://www.notion.so/Sensory-Reset-Routine-327604b060a480bd967be841111490f6","Voice Activation":"https://www.notion.so/Voice-Activation-Patch-326604b060a480da82fee6cef256b41e","Stop Signal":"https://www.notion.so/Stop-Signal-Patch-326604b060a48049b883f43b729c4e4b","Baseline Reset":"https://www.notion.so/Baseline-Reset-Patch-v1-1-327604b060a4801a83b0f56d0ecf2506","Permission Reset":"https://www.notion.so/Permission-Reset-Patch-v1-3-327604b060a480bd8173c8981cc359e5","Benchmark Filter":"https://www.notion.so/Benchmark-Filter-Patch-326604b060a480e09cd3fb1dd87bea5f","Root Reset":"https://www.notion.so/Root-Reset-Patch-v1-2-327604b060a48081a8fcdfacb08f9f3c","Boundary Filter":"https://www.notion.so/Boundary-Filter-Patch-v1-3-327604b060a4807cb540d52fee668e91","Cooldown":"https://www.notion.so/Cooldown-Patch-v1-3-327604b060a480498e3ecc8ca3179e9c"};

// ═══ M1-B: BUG ALIAS — 사용자 언어 매핑 ════════════════════════════
const BUG_ALIAS = {
  "MND-OVERCLOCK-01":      { userName:"무한 불안 루프",      subName:"과속 실행",     oneLiner:"멈추면 더 불안해져 생각과 긴장이 계속 과속하는 상태입니다.", why:"속도 과열과 통제 긴장이 겹칠 때 잘 켜집니다." },
  "MND-INPUTFLOOD-01":     { userName:"입력 과부하",        subName:"자극 과부하",   oneLiner:"소리, 표정, 알림 같은 외부 자극이 너무 많이 들어오는 상태입니다.", why:"사람·소음·알림이 많은 환경에서 잘 켜집니다." },
  "MND-EMOSUPPRESS-01":    { userName:"감정 억제 누적",     subName:"감정 억압",     oneLiner:"느낌은 있는데 이름 붙이지 못하고 안으로 눌러두는 상태입니다.", why:"서운함·화·무거움을 넘기는 습관이 쌓일 때 잘 켜집니다." },
  "MND-OUTPUTHEAT-01":     { userName:"과열 반응 폭주",     subName:"출력 과열",     oneLiner:"감정이 말과 행동으로 나갈 때 예상보다 크게 터지는 상태입니다.", why:"누적 억제 뒤 폭발하거나 반응 속도가 빨라질 때 잘 켜집니다." },
  "BDY-BOOTFAIL-01":       { userName:"시동 실패",          subName:"시동 실패",     oneLiner:"해야 할 걸 알아도 몸에 시동이 잘 걸리지 않는 상태입니다.", why:"회복 저하와 무기력이 겹칠 때 잘 켜집니다." },
  "BDY-LOWPOWERLOCK-01":   { userName:"저출력 고착",        subName:"저출력 고착",   oneLiner:"많이 하지 않아도 방전되고 에너지 기준선이 낮아진 상태입니다.", why:"기본 가용성이 떨어진 채 오래 버틸 때 잘 켜집니다." },
  "BDY-BEDLOCK-01":        { userName:"침대 고착",          subName:"침대 고착",     oneLiner:"누워 있을수록 더 움직이기 어려워지는 악순환 상태입니다.", why:"회복단 정지와 무기력이 겹칠 때 잘 켜집니다." },
  "MND-SELFDEVALUE-01":    { userName:"자기비하 증폭",      subName:"자기비하 증폭", oneLiner:"남과 비교한 직후 내 삶과 속도가 과하게 초라해지는 상태입니다.", why:"성과 비교와 자기평가 오염이 겹칠 때 잘 켜집니다." },
  "MND-FALSEPATCH-01":     { userName:"비교 누수",          subName:"가짜 패치",     oneLiner:"남의 기준을 내 기준처럼 받아들여 하루를 다시 뜯어고치려는 상태입니다.", why:"SNS·성과 자극 직후 비교 충동이 올라올 때 잘 켜집니다." },
  "MND-OVERCONTROL-01":    { userName:"완벽주의 통제 과잉", subName:"과통제",       oneLiner:"작은 허술함도 놓치지 못하고 계속 조이고 붙드는 상태입니다.", why:"예상 밖 변수와 완벽주의가 겹칠 때 잘 켜집니다." },
};
function getBugAlias(bugId, bugL) {
  return BUG_ALIAS[bugId] || { userName:bugL||"대표 버그", subName:bugL||"", oneLiner:"지금 시스템에서 가장 부담이 큰 버그입니다.", why:"최근 2주 반복 패턴에서 활성화된 상태입니다." };
}
function getBugDisplay(src) {
  const meta = getBugAlias(src?.bug, src?.bugL);
  return { bugId:src?.bug, bugL:src?.bugL, patch:src?.patch, patchL:src?.patchL, ...meta, bugHref:BLinks[src?.bug], patchHref:PLinks[src?.patch] };
}

// ═══ M2: THEME ═══════════════════════════════════════════════════
// M2: THEME — 색상 팔레트, 밴드 정의, 폰트

const FF = `'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif`;

/**
 * 뷰포트 반응형 폰트 사이즈
 * - 375px(iPhone SE) 기준 약간 확대 (+1px)
 * - 414px(iPhone 14): 자연스럽게 더 확대
 * - 768px(iPad): max 제한으로 과도한 확대 방지
 * - 절대 최소 12px 보장 (접근성)
 * @param {number} px - 기준 폰트 크기
 * @returns {string} clamp(min, vw, max) CSS 값
 */
function fs(px) {
  const boosted = px + 1;
  const min = Math.max(boosted, 12);
  const vw = +(boosted / 375 * 100).toFixed(2);
  const max = Math.round(boosted * 1.2);
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

const C = {
  bg:"#060a14", card:"#0c1120", cardH:"#101828",
  border:"#182035", borderL:"#243050",
  text:"#e8ecf4", dim:"#8b95a8", muted:"#5a6478",
  accent:"#e8654a", accentD:"#e8654a18",
  teal:"#36c5b0", tealD:"#36c5b012",
  blue:"#5b8af5", blueD:"#5b8af512",
  green:"#34d399", amber:"#f5a623", red:"#ef5350", purple:"#a78bfa",
};

const BAND = {
  stable:   { l:"안정",   c:C.green, bg:`${C.green}06`, d:"현재 시스템은 비교적 안정적으로 작동하고 있습니다.", sub:"특정 상황에서 누수 패턴이 다시 활성화될 수 있으므로 현재 리듬을 유지하는 것이 좋습니다.", act:"패턴을 미리 이해해두면 다음 과열을 더 빨리 막을 수 있습니다." },
  caution:  { l:"주의",   c:C.amber, bg:`${C.amber}06`, d:"피로 신호가 감지되기 시작했습니다.", sub:"아직 전면 과부하는 아니지만, 같은 패턴이 반복되면 가동률이 빠르게 떨어질 수 있습니다.", act:"지금 결과를 조기 경고 신호로 활용하는 것이 좋습니다." },
  low:      { l:"저하",   c:C.accent, bg:`${C.accent}05`, d:"시스템 가동률이 눈에 띄게 떨어진 상태입니다.", sub:"회복보다 버티기가 앞서고 있을 가능성이 높습니다.", act:"지금은 해석보다 부하 완화와 회복 확보가 우선입니다." },
  overload: { l:"과부하", c:C.red, bg:`${C.red}05`, d:"시스템이 과열 또는 저전력 상태에 가깝습니다.", sub:"좋은 조언도 잘 들어오지 않을 수 있습니다.", act:"문제 해결보다 먼저 가동률 회복이 필요합니다." },
};

// ═══ M3: ENGINE ══════════════════════════════════════════════════
// M3: ENGINE — 진단 계산, 재점검, 상태 도출, Hot Fix 로직

/**
 * @typedef {Object} ScanResult
 * @property {Object<string, number>} nm - Q유형별 점수 (Q1~Q7)
 * @property {string} pq - 주 패턴 (Q1~Q7)
 * @property {string} sq - 보조 패턴
 * @property {number} hi - 최고 점수
 * @property {number} mean - 평균 점수
 * @property {'stable'|'caution'|'low'|'overload'} band - 가동성 밴드
 * @property {number} avail - 가동성 (0~100)
 * @property {boolean} spread - 복수 영역 동시 부하 여부
 * @property {string} leak - 누수 지점
 * @property {string} r1 - 1차 5R 축
 * @property {string} bug - Bug ID
 * @property {string} bugL - Bug 라벨
 * @property {string} patch - Patch 이름
 * @property {string} patchL - Patch 라벨
 * @property {string} mode - 추천 모드
 * @property {string} modeD - 모드 설명
 * @property {number} ts - 타임스탬프
 * @property {'full'|'recheck'} type - 스캔 유형
 * @property {number} [delta] - 직전 대비 가동성 변화 (recheck만)
 * @property {'recheck'|'full'} [baselineType] - 기준 유형 (recheck만)
 */

/**
 * @typedef {Object} ActionLogEntry
 * @property {string} id - 고유 ID
 * @property {string} ref - HotFix ref
 * @property {string} label - 표시 라벨
 * @property {number} startedAt - 시작 시각
 * @property {number} [completedAt] - 완료 시각
 * @property {number} [cancelledAt] - 중단 시각
 * @property {number} durationSec - 설정 시간(초)
 * @property {string} resultType - 진단 유형
 * @property {number|null} availAtStart - 실행 시 가동성
 * @property {'completed'|'cancelled'|'unknown'} status - 실행 상태
 */

/**
 * Full Scan 진단 계산
 * @param {number[]} a - 21문항 응답 배열 (0~3)
 * @returns {ScanResult}
 */

function calcFull(a) {
  const s = {Q1:0,Q2:0,Q3:0,Q4:0,Q5:0,Q6:0,Q7:0}, m = {...s};
  QS.forEach((q,i) => { const r = a[i] ?? 0; s[q.pq] += r*0.7; s[q.sq] += r*0.3; m[q.pq] += 3*0.7; m[q.sq] += 3*0.3; });
  const n = {};
  Object.keys(s).forEach(k => n[k] = m[k] > 0 ? Math.round(s[k]/m[k]*1000)/10 : 0);
  const st = Object.entries(n).sort((a,b) => b[1]-a[1]);
  const pq = st[0][0], sq = st[1][0], hi = st[0][1];
  const mn = Math.round(Object.values(n).reduce((a,b) => a+b, 0) / 7 * 10) / 10;
  let bd = "stable";
  if (hi >= 70) bd = "overload"; else if (hi >= 50) bd = "low"; else if (hi >= 30) bd = "caution";
  if (bd === "stable" && mn >= 25) bd = "caution";
  const av = Math.round(100 - hi);
  const sp = Object.values(n).filter(v => v >= 30).length >= 5;
  const d = QS.find(q => q.pq === pq);
  return { nm:n, pq, sq, hi, mean:mn, band:bd, avail:av, spread:sp, leak:d?.leak, r1:d?.r1, bug:d?.bug, bugL:d?.bugL, patch:d?.patch, patchL:d?.patchL, mode:d?.mode, modeD:d?.modeD, ts:Date.now(), type:"full" };
}

function getRecheckQs(r) {
  // Recheck에서 rcP는 Q유형별로 동일하므로, 유형당 1문항만 선택
  // 1순위: pq, 2순위: sq, 3순위: nm 점수 높은 순서
  const picked = new Set();
  const result = [];
  const pickOne = (qType) => {
    if (picked.has(qType)) return;
    const q = QS.find(x => x.pq === qType);
    if (q) { result.push(q); picked.add(qType); }
  };
  // pq, sq 우선
  pickOne(r.pq);
  pickOne(r.sq);
  // 나머지: nm 점수 높은 Q유형 순서로 채우기
  if (r.nm && result.length < 5) {
    const ranked = Object.entries(r.nm)
      .filter(([k]) => !picked.has(k))
      .sort((a, b) => b[1] - a[1]);
    for (const [qType] of ranked) {
      if (result.length >= 5) break;
      pickOne(qType);
    }
  }
  return result.slice(0, 5);
}

/**
 * Recheck 진단 계산
 *
 * ── pq/sq 재산정 정책 (v4.9.2) ──
 * 재점검은 3~5문항 소표본이므로, 두 가지 안정화를 적용한다:
 * 1) Q축 점수 블렌딩: 이전 50% + 재점검 50%로 급등락 댐핑
 * 2) pq/sq 전환 방어: 재점검 결과가 기존 pq를 **10%p 이상** 초과해야 전환
 *
 * @param {number[]} a - 재점검 응답 배열
 * @param {Object[]} qs - 재점검 문항 배열
 * @param {ScanResult} prev - 기준 결과 (fullScan 또는 직전 recheck)
 * @returns {ScanResult}
 */
function calcRecheck(a, qs, prev) {
  const s = {}, m = {};
  const prevNm = (prev && typeof prev.nm === "object" && prev.nm) ? prev.nm : { Q1:0, Q2:0, Q3:0, Q4:0, Q5:0, Q6:0, Q7:0 };
  Object.keys(prevNm).forEach(k => { s[k] = 0; m[k] = 0; });
  qs.forEach((q,i) => { const r = a[i] ?? 0; s[q.pq] += r*0.7; s[q.sq] += r*0.3; m[q.pq] += 3*0.7; m[q.sq] += 3*0.3; });
  const n = {...prevNm};
  // 블렌딩: 이전 50% + 재점검 50% — 소표본 급등락 댐핑
  Object.keys(s).forEach(k => {
    if (m[k] > 0) {
      const rawNew = Math.round(s[k]/m[k]*1000)/10;
      n[k] = Math.round((prevNm[k] * 0.5 + rawNew * 0.5) * 10) / 10;
    }
  });
  const st = Object.entries(n).sort((a,b) => b[1]-a[1]);
  const hi = st[0][1], mn = Math.round(Object.values(n).reduce((a,b) => a+b, 0) / 7 * 10) / 10;
  let bd = "stable";
  if (hi >= 70) bd = "overload"; else if (hi >= 50) bd = "low"; else if (hi >= 30) bd = "caution";
  if (bd === "stable" && mn >= 25) bd = "caution";
  const av = Math.round(100 - hi);

  // ── pq/sq 재산정: 점수 차이 10%p 이상이면 전환 허용 ──
  const RERANK_THRESHOLD = 10; // %p
  const newTopQ = st[0][0], newSecQ = st[1][0];
  const prevPqScore = n[prev.pq] ?? 0;
  const newTopScore = st[0][1];
  const shouldRerank = newTopQ !== prev.pq && (newTopScore - prevPqScore) >= RERANK_THRESHOLD;

  const finalPq = shouldRerank ? newTopQ : prev.pq;
  const finalSq = shouldRerank ? newSecQ : prev.sq;

  // 재산정 시 메타(leak, bug, patch 등)도 새 pq 기준으로 갱신
  const meta = shouldRerank ? QS.find(q => q.pq === finalPq) : null;

  return {
    nm:n, pq:finalPq, sq:finalSq, hi, mean:mn, band:bd, avail:av,
    spread:Object.values(n).filter(v => v >= 30).length >= 5,
    leak:   meta?.leak   ?? prev.leak,
    r1:     meta?.r1     ?? prev.r1,
    bug:    meta?.bug    ?? prev.bug,
    bugL:   meta?.bugL   ?? prev.bugL,
    patch:  meta?.patch  ?? prev.patch,
    patchL: meta?.patchL ?? prev.patchL,
    mode:   meta?.mode   ?? prev.mode,
    modeD:  meta?.modeD  ?? prev.modeD,
    ts:Date.now(), type:"recheck",
    delta:av - prev.avail,
    baselineType:prev.type === "recheck" ? "recheck" : "full",
    reranked: shouldRerank, // UI에서 "패턴 전환 감지" 표시용
  };
}

// leak → 우선 ref 맵 (P1-2)
const LEAK_PRIORITY_MAP = {
  "입력단":  ["env-reset","sensory-reset"],
  "처리단":  ["leak-note","voice-activate","permission-reset"],
  "조절단":  ["slow-down","root-reset"],
  "출력단":  ["stop-signal"],
  "회복단":  ["baseline-reset","micro-move"],
  "갱신단":  ["permission-reset"],
};

function scoreHotFix(h, r) {
  // 기준 점수: priority * 10 (낮을수록 좋음)
  let score = h.priority * 10;
  // pq/sq 보정
  if (h.qMatch) {
    if (h.qMatch.includes(r.pq)) score -= 20;
    else if (h.qMatch.includes(r.sq)) score -= 10;
  }
  // leak 보정
  const leakRefs = LEAK_PRIORITY_MAP[r.leak] || [];
  const leakIdx = leakRefs.indexOf(h.ref);
  if (leakIdx === 0) score -= 15;
  else if (leakIdx === 1) score -= 8;
  else if (leakIdx > 1) score -= 3;
  // band 보정: overload/low → universal-reset 최상단 고정
  if ((r.band === "overload" || r.band === "low") && h.ref === "universal-reset") score -= 100;
  // caution/stable → pq 기반 카드 한 번 더 강화
  if ((r.band === "caution" || r.band === "stable") && h.qMatch && h.qMatch.includes(r.pq)) score -= 5;
  return score;
}

function getHotFixes(r) {
  if (!r) return [];
  const candidates = HOTFIX_DB.filter(h => {
    if (h.bandMatch && h.bandMatch.includes(r.band)) return true;
    if (h.qMatch && (h.qMatch.includes(r.pq) || h.qMatch.includes(r.sq))) return true;
    // leak 기반 추가 포함
    const leakRefs = LEAK_PRIORITY_MAP[r.leak] || [];
    if (leakRefs.includes(h.ref)) return true;
    return false;
  });
  const scored = candidates.map(h => ({ ...h, _score: scoreHotFix(h, r) }));
  scored.sort((a, b) => a._score - b._score);
  return scored.slice(0, 3);
}

function isExecutableHotFix(ref) {
  const h = HOTFIX_DB.find(x => x.ref === ref);
  return h ? !!h.exec : false;
}

function getHotFixCtaLabel(ref, cta) {
  return isExecutableHotFix(ref) ? cta : "준비 중";
}

function deriveHS(fullScan, lastResult) {
  if (!fullScan && !lastResult) return { source:"empty" };
  const l = lastResult || fullScan, s = fullScan || l;
  return {
    source: l.type === "recheck" ? "recheck_overlay" : "full_scan",
    avail:l.avail, band:l.band, spread:l.spread, nm:l.nm,
    pq:s.pq, sq:s.sq, leak:s.leak, r1:s.r1, mode:s.mode, modeD:s.modeD,
    bug:s.bug, bugL:s.bugL, patch:s.patch, patchL:s.patchL, qpr:l,
    delta: l.type === "recheck" ? l.delta : undefined,
    baselineType: l.baselineType || null,
    isRc: l.type === "recheck",
    rcNote: l.type === "recheck" && l.delta !== undefined ? (l.delta > 0 ? "회복 중" : l.delta < 0 ? "부하 증가" : "변화 없음") : null,
  };
}

// ═══ M3-b: LIVE METRICS ══════════════════════════════════════════
// 체감 척도 엔진 — 가동률을 사용자 피부 언어로 번역

const LIVE_LABELS = {
  fatigue:      ["매우 낮음", "낮음", "보통", "높음", "매우 높음"],
  productivity: ["몰입 가능", "무난", "흔들림", "저하", "회복 우선"],
  friction:     ["안정", "약간 민감", "주의", "높음", "매우 높음"],
};

const LIVE_TONES = {
  green:  { bg:"#0d2818", fg:"#34D399", border:"#166534" },
  yellow: { bg:"#1a1a06", fg:"#F5A623", border:"#6b5c10" },
  orange: { bg:"#1a0f06", fg:"#E8654A", border:"#7c3318" },
  red:    { bg:"#1a0808", fg:"#EF4444", border:"#7f1d1d" },
};

function clamp(n, min = 0, max = 4) { return Math.max(min, Math.min(max, n)); }
function safePQ(result) { return result?.pq || "Q1"; }

function deriveLiveMetrics(result) {
  const avail = result?.avail ?? 0;
  const pq = safePQ(result);
  let fatigue = 0, productivity = 0, friction = 0;
  if (avail >= 85)      { fatigue = 1; productivity = 0; friction = 0; }
  else if (avail >= 70) { fatigue = 2; productivity = 1; friction = 1; }
  else if (avail >= 55) { fatigue = 3; productivity = 2; friction = 2; }
  else if (avail >= 40) { fatigue = 4; productivity = 3; friction = 3; }
  else                  { fatigue = 4; productivity = 4; friction = 4; }
  if (pq === "Q1") productivity = clamp(productivity + 1);
  if (pq === "Q2") friction = clamp(friction + 1);
  if (pq === "Q3") productivity = clamp(productivity + 1);
  if (pq === "Q4") friction = clamp(friction + 1);
  if (pq === "Q5") { fatigue = clamp(fatigue + 1); productivity = clamp(productivity + 1); }
  // Q5 중간가동률 역설: 60~70%라도 체감 피로는 '매우 높음'
  if (pq === "Q5" && avail >= 55 && avail < 75) fatigue = 4;
  if (pq === "Q6") productivity = clamp(productivity + 1);
  if (pq === "Q7") { fatigue = clamp(fatigue + 1); friction = clamp(friction + 1); }
  return { fatigueIdx:fatigue, productivityIdx:productivity, frictionIdx:friction, fatigueLabel:LIVE_LABELS.fatigue[fatigue], productivityLabel:LIVE_LABELS.productivity[productivity], frictionLabel:LIVE_LABELS.friction[friction] };
}

function deriveSummaryHeadline(result, metrics) {
  const avail = result?.avail ?? 0;
  const pq = safePQ(result);

  // 고가동 + 특정 취약성
  if (avail >= 85 && pq === "Q2") return "에너지는 충분하지만 외부 자극에는 예민한 날입니다.";
  if (avail >= 85 && pq === "Q4") return "움직일 힘은 충분하지만 감정 반응은 다소 거칠어질 수 있습니다.";
  if (avail >= 85 && pq === "Q7") return "전반적 가동률은 높지만 긴장과 통제 피로는 남아 있습니다.";

  // Q5 중간가동률 역설: 수치에 속지 않기
  if (pq === "Q5" && avail >= 55 && avail < 75) return "가동률 수치와 달리, 시스템은 깊은 침체 구간에 들어서고 있습니다. 수치에 속지 마세요.";

  // 저가동: 안도감 + 전략적 후퇴 (공포가 아닌 쉼의 프레임)
  if (avail < 40) return "오늘은 당신이 부족한 게 아니라, 시스템이 잠시 멈춰야 할 타이밍입니다. 내일을 위해 오늘을 양보하세요.";
  if (avail < 55) return "오늘의 후퇴는 실패가 아니라 시스템 보호입니다. 무리하지 않는 운영이 더 현명합니다.";

  // 일반 요약
  if (metrics.fatigueIdx >= 4 && metrics.productivityIdx >= 3) return "오늘은 성과보다 회복을 먼저 챙겨야 하는 날입니다.";
  if (metrics.frictionIdx >= 3 && metrics.productivityIdx <= 2) return "몰입은 가능하지만 사람과 자극에는 주의가 필요한 날입니다.";
  if (metrics.productivityIdx >= 4) return "지금은 밀어붙이기보다 리듬을 되찾는 것이 우선입니다.";
  if (metrics.fatigueIdx <= 1 && metrics.productivityIdx <= 1 && metrics.frictionIdx <= 1) return "비교적 안정적이며 중요한 일을 처리하기 좋은 날입니다.";

  return "버티고는 있지만 소모가 빨라 조절이 필요한 날입니다.";
}

function deriveActionMicrocopy(result) {
  const pq = safePQ(result);
  const map = {
    Q1:"속도가 붙을수록 에너지가 더 샐 수 있습니다. 오늘은 한 템포 늦추고 중요한 일 하나만 선명하게 끝내세요.",
    Q2:"자극을 많이 받을수록 감정 마찰이 커질 수 있습니다. 오늘은 사람보다 환경을 먼저 정리해 주세요. 중요한 대화는 미루는 편이 안전합니다.",
    Q3:"겉으론 괜찮아 보여도 내부 피로가 쌓이고 있습니다. 작은 일 하나만 끝내고 바로 쉬어주세요.",
    Q4:"반응이 커질수록 하루 전체가 흔들릴 수 있습니다. 감정이 올라오면 자리를 잠깐 벗어나 주세요. 지금의 말은 내일 후회할 확률이 높습니다.",
    Q5:"삶의 피로도가 임계점에 가깝습니다. 오늘은 중요한 결정을 미루고 몸을 먼저 움직여 주세요.",
    Q6:"비교가 시작되면 집중력이 빠르게 떨어질 수 있습니다. 오늘은 타인 말고 어제의 나와만 비교해 주세요.",
    Q7:"긴장이 높아 에너지가 새고 있습니다. 오늘은 정확함보다 관계의 온도를 먼저 지켜 주세요. 한 가지쯤은 그냥 지나가는 편이 좋습니다.",
  };
  return map[pq] || "오늘은 무리해서 당기기보다, 마찰을 줄이며 리듬을 회복하는 쪽이 더 유리합니다.";
}

function toneByIndex(idx) {
  if (idx <= 1) return LIVE_TONES.green;
  if (idx === 2) return LIVE_TONES.yellow;
  if (idx === 3) return LIVE_TONES.orange;
  return LIVE_TONES.red;
}

// ═══ M4: STATE ═══════════════════════════════════════════════════
// M4: STATE — localStorage 읽기/쓰기/삭제

// ─── 진단 상태 저장소 (v4, 마이그레이션 체인 포함) ───
function saveState(fullScan, lastResult, hist) {
  // ⚠️ JSON 키 fs/lr은 기존 저장 포맷 호환을 위해 유지
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fs:fullScan, lr:lastResult, hist, v:4 })); } catch(e) {}
}

function migrateState(key) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    if (d && d.v >= 2) {
      d.v = 4;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
      localStorage.removeItem(key);
      return d;
    }
  } catch(e) {}
  return null;
}

function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && d.v >= 2) {
      if (!Array.isArray(d.hist)) d.hist = [];
      // fs/lr shape 방어: 필수 필드 없으면 null 처리
      if (d.fs && (typeof d.fs.avail !== "number" || !d.fs.pq)) d.fs = null;
      if (d.lr && (typeof d.lr.avail !== "number" || !d.lr.pq)) d.lr = null;
      // nm shape 방어: 없거나 객체 아니면 기본값 주입
      if (d.fs && (!d.fs.nm || typeof d.fs.nm !== "object")) d.fs.nm = { Q1:0, Q2:0, Q3:0, Q4:0, Q5:0, Q6:0, Q7:0 };
      if (d.lr && (!d.lr.nm || typeof d.lr.nm !== "object")) d.lr.nm = { Q1:0, Q2:0, Q3:0, Q4:0, Q5:0, Q6:0, Q7:0 };
      // hist 내부 엔트리 shape 방어
      d.hist = d.hist.filter(h => h && typeof h.avail === "number" && h.ts);
      return d;
    }
  } catch(e) {}
  return migrateState(STORAGE_KEY_V3) || migrateState(STORAGE_KEY_V2) || migrateState(STORAGE_KEY_V1) || null;
}

function clearState() {
  try { [STORAGE_KEY, STORAGE_KEY_V3, STORAGE_KEY_V2, STORAGE_KEY_V1].forEach(k => localStorage.removeItem(k)); } catch(e) {}
}

// ─── D3-alpha: 개인화 데이터 수집 레이어 ───
const INIT_PERSONAL = { patchStats:{}, lastCompletedPatchRef:null };
function loadPersonalState() {
  try {
    const p = JSON.parse(localStorage.getItem(PERSONAL_KEY));
    if (!p || typeof p.patchStats !== "object") return INIT_PERSONAL;
    // patchStats 내부 shape 방어
    for (const ref of Object.keys(p.patchStats)) {
      const s = p.patchStats[ref];
      if (!s || typeof s !== "object") { p.patchStats[ref] = { tries:0, completes:0, skips:0, recentEffects:[], lastUsedAt:null }; continue; }
      if (!Array.isArray(s.recentEffects)) s.recentEffects = [];
      if (typeof s.tries !== "number") s.tries = 0;
      if (typeof s.completes !== "number") s.completes = 0;
      if (typeof s.skips !== "number") s.skips = 0;
    }
    return p;
  } catch(e) { return INIT_PERSONAL; }
}
function savePersonalState(ps) { try { localStorage.setItem(PERSONAL_KEY, JSON.stringify(ps)); } catch(e) {} }
function updatePatchStat(ps, ref, completed) {
  const prev = ps.patchStats?.[ref] || { tries:0, completes:0, skips:0, recentEffects:[], lastUsedAt:null };
  const next = completed
    ? { ...prev, tries:prev.tries+1, completes:prev.completes+1, lastUsedAt:Date.now() }
    : { ...prev, skips:prev.skips+1 };
  return { ...ps, patchStats:{ ...ps.patchStats, [ref]:next }, lastCompletedPatchRef:completed?ref:ps.lastCompletedPatchRef };
}
function attachPatchEffect(ps, ref, availDiff) {
  if (!ref || !ps.patchStats?.[ref]) return ps;
  const prev = ps.patchStats[ref];
  return { ...ps, patchStats:{ ...ps.patchStats, [ref]:{ ...prev, recentEffects:[...(prev.recentEffects||[]), availDiff].slice(-3) } }, lastCompletedPatchRef:null };
}

// ─── D3-beta: 개인화 점수 계산 (내부 전용, UI 미노출) ───
function getPatchEffectScore(stat) {
  if (!stat?.recentEffects || stat.recentEffects.length === 0) return 0;
  const recent = stat.recentEffects.slice(-3);
  return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length * 10) / 10;
}
function getPatchResistanceScore(stat) {
  if (!stat) return 0;
  const tries = stat.tries || 0, completes = stat.completes || 0, skips = stat.skips || 0;
  if (tries === 0 && skips === 0) return 0;
  let score = 0;
  if (skips >= 3) score += 3; else if (skips === 2) score += 2; else if (skips === 1) score += 1;
  if (tries >= 3) { const cr = completes / tries; if (cr < 0.34) score += 2; else if (cr < 0.5) score += 1; }
  return score;
}
function getPatchConfidence(stat) {
  if (!stat) return 0;
  const samples = (stat.recentEffects?.length || 0) + (stat.tries || 0) + (stat.skips || 0);
  if (samples >= 8) return 3; if (samples >= 5) return 2; if (samples >= 2) return 1; return 0;
}
function getPersonalAdjustment(stat) {
  const effect = getPatchEffectScore(stat), resistance = getPatchResistanceScore(stat), confidence = getPatchConfidence(stat);
  if (confidence === 0) return 0;
  const raw = effect - resistance;
  if (confidence === 1) return raw * 0.25; if (confidence === 2) return raw * 0.5; return raw * 0.75;
}
function canRunD3Beta(ps) {
  const stats = Object.values(ps?.patchStats || {});
  return stats.filter(s => (s.recentEffects?.length || 0) >= 2 || (s.tries || 0) >= 3 || (s.skips || 0) >= 2).length >= 2;
}
function getPersonalizedCandidates(baseList, ps) {
  return (baseList || []).map(item => {
    const stat = ps?.patchStats?.[item.ref];
    return { ...item, effectScore:getPatchEffectScore(stat), resistanceScore:getPatchResistanceScore(stat), confidenceScore:getPatchConfidence(stat), personalAdjustment:getPersonalAdjustment(stat), personalizedScore:item._score - getPersonalAdjustment(stat) };
  }).sort((a, b) => a.personalizedScore - b.personalizedScore);
}
function summarizePersonalization(baseList, personalizedList) {
  const bt = baseList?.[0], pt = personalizedList?.[0];
  const changed = !!(bt && pt && bt.ref !== pt.ref);
  return { baseTopRef:bt?.ref, baseTopLabel:bt?.label, personalTopRef:pt?.ref, personalTopLabel:pt?.label, changed, meaningfulChanged:changed && (pt?.confidenceScore || 0) >= 2 };
}
function debugPersonalization(baseList, personalizedList) {
  const s = summarizePersonalization(baseList, personalizedList);
  console.group("D3-beta personalization");
  console.log("summary", { baseTop:s.baseTopRef, personalTop:s.personalTopRef, changed:s.changed, meaningfulChanged:s.meaningfulChanged });
  console.table(personalizedList.map((x, i) => ({ rank:i+1, ref:x.ref, label:x.label, base:x._score, personalized:x.personalizedScore, effect:x.effectScore, resistance:x.resistanceScore, confidence:x.confidenceScore, adj:x.personalAdjustment })));
  console.groupEnd();
}

// ─── 실행 이력 저장소 (v4, 정규화 + 상태-시간 정합성 검사) ───
function saveActionLog(log) {
  try { localStorage.setItem(ALOG_KEY, JSON.stringify(log)); } catch(e) {}
}

function normalizeActionLog(arr) {
  return arr
    .filter(a => a && (a.startedAt || a.completedAt || a.cancelledAt))  // 타임스탬프 전무 레코드 제거
    .map(a => {
      let entry = { ...a };
      if (!entry.status) {
        if (entry.completedAt) entry.status = "completed";
        else if (entry.cancelledAt) entry.status = "cancelled";
        else entry.status = "unknown";
      }
      if (entry.status === "completed" && !entry.completedAt) entry.status = "unknown";
      if (entry.status === "cancelled" && !entry.cancelledAt) entry.status = "unknown";
      return entry;
    });
}

function loadAndNormalize(key) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    if (!Array.isArray(d)) return null;
    const normalized = normalizeActionLog(d);
    if (key !== ALOG_KEY) {
      localStorage.setItem(ALOG_KEY, JSON.stringify(normalized));
      localStorage.removeItem(key);
    } else if (normalized.length !== d.length || JSON.stringify(normalized) !== JSON.stringify(d)) {
      localStorage.setItem(ALOG_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch(e) { return null; }
}

function loadActionLog() {
  return loadAndNormalize(ALOG_KEY) || loadAndNormalize(ALOG_KEY_V3) || loadAndNormalize(ALOG_KEY_OLD) || [];
}

function clearActionLog() {
  try { [ALOG_KEY, ALOG_KEY_V3, ALOG_KEY_OLD].forEach(k => localStorage.removeItem(k)); } catch(e) {}
}

// ═══ M5: SERVICES ════════════════════════════════════════════════
// M5: SERVICES — 공유 URL, 공유 텍스트, ShareBtn

function getShareUrl() {
  return "https://stato.kr";
}

function buildShareText(r) {
  const shareUrl = getShareUrl();
  const m = deriveLiveMetrics(r);
  const headline = deriveSummaryHeadline(r, m);
  const action = deriveActionMicrocopy(r);
  // 행동 권고 1문장 축약 (첫 문장만)
  const actionShort = action.split(".")[0] + ".";
  return [
    `📊 Stato 운영 상태 리포트`, ``,
    headline, ``,
    `삶의 피로도: ${m.fatigueLabel}`,
    `몰입 생산성: ${m.productivityLabel}`,
    `감정 마찰도: ${m.frictionLabel}`, ``,
    `💡 오늘의 한 마디: ${actionShort}`, ``,
    `가동률: ${r.avail}% · ${QL[r.pq]} · ${r.leak}`,
    ``, `감정 누수를 10%만 줄여도, 하루의 질은 달라집니다.`,
    `— Stato · Powered by Emotion OS`,
    `Emotional Engineering Institute`, shareUrl,
  ].join("\n");
}

function ShareBtn({ result }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const text = buildShareText(result);
    const shareUrl = getShareUrl();

    // ── Tier 1: Web Share API (모바일 네이티브 공유) ──
    // AbortError = 사용자가 직접 취소 → 조용히 종료
    // 그 외 오류(NotAllowedError, 웹뷰 제한 등) → Tier 2로 fallback
    if (navigator.share) {
      try { await navigator.share({ title:"Stato 운영 상태 리포트", text, url:shareUrl }); return; }
      catch(e) { if (e instanceof DOMException && e.name === "AbortError") return; }
    }

    // ── Tier 2: Clipboard API ──
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); return; }
    catch(e) { /* Clipboard API 미지원 또는 권한 거부 → Tier 3 */ }

    // ── Tier 3: execCommand fallback (레거시) ──
    const ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch(e2) { alert("이 브라우저에서는 공유/복사가 제한됩니다. 텍스트를 직접 선택해 복사해 주세요."); }
    document.body.removeChild(ta);
  };
  return (
    <button onClick={share} style={{ width:"100%", padding:"14px", borderRadius:12, border:`1px solid ${copied ? C.green : C.accent}40`, background:copied ? `${C.green}12` : `${C.accent}08`, color:copied ? C.green : C.accent, fontSize:fs(14), fontWeight:600, fontFamily:FF, cursor:"pointer", marginBottom:8 }}>
      {copied ? "✓ 복사 완료" : "운영 리포트 공유하기"}
    </button>
  );
}

// ═══ M6-a: HELPERS ═══════════════════════════════════════════════
// 공용 유틸리티 — 시간 포매터 + 실행 이력 판정 함수 (단일 진실원)

function fmtTime(ts) {
  if (!ts) return "시각 불명";
  const d = new Date(ts), now = new Date(), diff = now - d;
  if (diff < 60000) return "방금 전";
  if (diff < 3600000) return `${Math.floor(diff/60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}시간 전`;
  return `${d.getMonth()+1}/${d.getDate()}`;
}

// ─── 내부: 시간 내림차순 정렬 ───
function sortByTime(actionLog) {
  return [...(actionLog || [])]
    .sort((a, b) => (b.completedAt || b.cancelledAt || b.startedAt || 0)
                   - (a.completedAt || a.cancelledAt || a.startedAt || 0));
}

// ─── 전체 최근 n건 (정렬만, 필터 없음) ───
function getRecentActions(actionLog, n = 3) {
  return sortByTime(actionLog).slice(0, n);
}

// ─── 사용자 화면용 n건 (unknown 제외) ───
function getVisibleActions(actionLog, n = 3) {
  return sortByTime(actionLog)
    .filter(a => a.status === "completed" || a.status === "cancelled")
    .slice(0, n);
}

// ─── ref별 최신 액션 1건 (✓ 실행됨 배지, 방금 실행 판정) ───
function getLatestActionByRef(actionLog, ref) {
  return sortByTime(actionLog).find(a => a.ref === ref) || null;
}

// ─── "방금 완료" 판정 (기본 30분 이내 + completed + completedAt 유효) ───
function isRecentlyCompleted(actionLog, ref, withinMs = 1800000) {
  const latest = getLatestActionByRef(actionLog, ref);
  return !!(latest && latest.status === "completed" && latest.completedAt
            && (Date.now() - latest.completedAt) < withinMs);
}

// ═══ M6-b: UI PRIMITIVES ═════════════════════════════════════════
// M6: UI Primitives — Card, Badge, Btn, MiniBar, Accordion, ANum, DBadge

function useCountUp(t, dur = 1000) {
  const [v, setV] = useState(0);
  const r = useRef(null);
  useEffect(() => {
    const s = performance.now();
    const step = n => { const p = Math.min((n-s)/dur, 1); setV(Math.round(t * (1 - Math.pow(1-p, 3)))); if (p < 1) r.current = requestAnimationFrame(step); };
    r.current = requestAnimationFrame(step);
    return () => { if (r.current) cancelAnimationFrame(r.current); };
  }, [t, dur]);
  return v;
}

const ANum = ({ value, color, size=24, suffix="" }) => {
  const d = useCountUp(value);
  return <span style={{ fontSize:fs(size), fontWeight:800, color, fontFamily:FF }}>{d}{suffix}</span>;
};

const DBadge = ({ delta, big }) => {
  if (delta == null) return null;
  const up = delta >= 0, z = delta === 0;
  const co = z ? C.dim : up ? C.green : C.red;
  const ar = z ? "→" : up ? "↑" : "↓";
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:big?8:5, padding:big?"8px 16px":"4px 12px", borderRadius:big?12:16, background:`${co}12`, border:`1px solid ${co}25`, animation:z?undefined:"dF 0.6s ease" }}>
      <span style={{ fontSize:big?20:14, fontWeight:800, color:co }}>{ar}</span>
      <span style={{ fontSize:big?16:12, fontWeight:700, color:co, fontFamily:FF }}>{up && !z ? "+" : ""}{delta}%</span>
      {!z && <span style={{ fontSize:big?11:9, color:`${co}aa` }}>{up ? "회복 중" : "주의 필요"}</span>}
    </div>
  );
};

const Card = ({ children, accent, style:s, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, border:`1px solid ${accent || C.border}`, borderRadius:14, padding:"20px 18px", marginBottom:14, cursor:onClick?"pointer":"default", ...s }}>
    {children}
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:16, fontSize:fs(10), fontWeight:700, color, background:`${color}15`, border:`1px solid ${color}25`, fontFamily:FF }}>
    {text}
  </span>
);

const MiniBar = ({ pct, color, h=5 }) => (
  <div style={{ width:"100%", height:h, background:C.border, borderRadius:h/2, overflow:"hidden" }}>
    <div style={{ width:`${Math.max(pct, 2)}%`, height:"100%", background:color, borderRadius:h/2, transition:"width 1s ease" }} />
  </div>
);

const Btn = ({ children, onClick, primary, small, style:s, disabled }) => (
  <button disabled={disabled} onClick={onClick} style={{
    padding:small?"10px 18px":"14px 24px", borderRadius:12,
    border:primary?"none":`1px solid ${C.border}`,
    background:primary?`linear-gradient(135deg,${C.accent},#d4523a)`:"transparent",
    color:primary?"#fff":C.dim, fontSize:small?13:14, fontWeight:600, fontFamily:FF,
    cursor:disabled?"default":"pointer", opacity:disabled?0.4:1, width:"100%", ...s,
  }}>{children}</button>
);

function Accordion({ title, children, defaultOpen = false }) {
  const [o, setO] = useState(defaultOpen);
  return (
    <Card>
      <button onClick={() => setO(!o)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:FF }}>
        <span style={{ fontSize:fs(12), color:C.muted }}>{title}</span>
        <span style={{ fontSize:fs(14), color:C.muted, transform:o?"rotate(180deg)":"rotate(0)", transition:"transform 0.3s" }}>▾</span>
      </button>
      {o && <div style={{ marginTop:10 }}>{children}</div>}
    </Card>
  );
}

// ─── ConfirmModal ───
function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px", animation:"esFadeIn 0.2s ease" }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"28px 24px", maxWidth:320, width:"100%", textAlign:"center", animation:"esSlideUp 0.25s ease" }}>
        <p style={{ fontSize:fs(14), color:C.text, lineHeight:1.65, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:8 }}>
          <Btn small onClick={onCancel} style={{ flex:1 }}>취소</Btn>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", background:`linear-gradient(135deg,${C.accent},#d4523a)`, color:"#fff", fontSize:fs(13), fontWeight:700, fontFamily:FF, cursor:"pointer" }}>초기화</button>
        </div>
      </div>
    </div>
  );
}

// ─── BugSignalCard (Today용 대표 버그 카드) ───
function BugSignalCard({ hs, onGoReset }) {
  if (!hs?.bug) return null;
  const d = getBugDisplay(hs);
  return (
    <Card>
      <div style={{ fontSize:fs(11), fontWeight:700, color:C.muted, marginBottom:10 }}>지금 가동률이 떨어진 이유</div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:fs(18), fontWeight:800, color:C.text, lineHeight:1.25 }}>{d.userName}</div>
          <div style={{ fontSize:fs(11), color:C.dim, marginTop:3 }}>{d.subName ? `${d.subName} · ${d.bugId}` : d.bugId}</div>
        </div>
        {d.patchHref ? (
          <a href={d.patchHref} target="_blank" rel="noopener noreferrer" style={{ padding:"6px 10px", borderRadius:999, background:`${C.accent}14`, border:`1px solid ${C.accent}33`, color:C.accent, fontSize:fs(10), fontWeight:700, whiteSpace:"nowrap", textDecoration:"none" }}>{d.patchL}</a>
        ) : (
          <span style={{ padding:"6px 10px", borderRadius:999, background:`${C.accent}14`, border:`1px solid ${C.accent}33`, color:C.accent, fontSize:fs(10), fontWeight:700, whiteSpace:"nowrap" }}>{d.patchL}</span>
        )}
      </div>
      <div style={{ marginTop:12, fontSize:fs(13), color:C.text, lineHeight:1.6 }}>{d.oneLiner}</div>
      <div style={{ marginTop:8, fontSize:fs(11.5), color:C.dim, lineHeight:1.55 }}>이 상태가 계속되면 하루의 리듬이 더 흔들릴 수 있습니다.</div>
      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {d.bugHref ? (
          <a href={d.bugHref} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", height:40, borderRadius:12, border:`1px solid ${C.border}`, background:C.cardH, color:C.text, fontWeight:700, fontSize:fs(12), fontFamily:FF, textDecoration:"none" }}>버그 카드 보기</a>
        ) : (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:40, borderRadius:12, border:`1px solid ${C.border}`, background:C.cardH, color:C.text, fontWeight:700, fontSize:fs(12) }}>버그 카드 보기</div>
        )}
        <button onClick={onGoReset} style={{ height:40, borderRadius:12, border:"none", background:C.accent, color:"#fff", fontWeight:800, fontSize:fs(12), fontFamily:FF, cursor:"pointer" }}>리셋으로 이동</button>
      </div>
      {d.patchHref && <a href={d.patchHref} target="_blank" rel="noopener noreferrer" style={{ display:"block", marginTop:10, padding:"8px 0", textDecoration:"none" }}><span style={{ fontSize:fs(10.5), color:C.muted }}>연결 패치: </span><span style={{ fontSize:fs(10.5), color:C.accent, fontWeight:600 }}>{d.patchL}</span></a>}
      <div style={{ marginTop:10, fontSize:fs(10.5), color:C.muted }}>실행 후에는 재점검으로 변화를 확인해보세요.</div>
    </Card>
  );
}

// ─── MetricsTrendCard (체감 척도 3종 추이 미니 그래프) ───
function MetricsTrendCard({ history }) {
  const recent = history.slice(-8);
  if (recent.length < 2) return null;
  const data = recent.map(h => {
    const m = deriveLiveMetrics({ avail:h.avail, pq:h.pq });
    return { fatigue:m.fatigueIdx, productivity:m.productivityIdx, friction:m.frictionIdx, ts:h.ts };
  });
  const W = 260, H = 40, pad = 4;
  const renderSparkline = (key, color) => {
    const vals = data.map(d => d[key]);
    const max = 4;
    const pts = vals.map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
      const y = pad + (v / max) * (H - pad * 2);
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:"block" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        {vals.map((v, i) => {
          const x = pad + (i / (vals.length - 1)) * (W - pad * 2);
          const y = pad + (v / max) * (H - pad * 2);
          return <circle key={i} cx={x} cy={y} r={i === vals.length - 1 ? 3 : 1.5} fill={color} />;
        })}
      </svg>
    );
  };
  const last = data[data.length - 1];
  const metrics = [
    { key:"fatigue", label:"피로", color:C.accent, val:LIVE_LABELS.fatigue[last.fatigue] },
    { key:"productivity", label:"몰입", color:C.blue, val:LIVE_LABELS.productivity[last.productivity] },
    { key:"friction", label:"마찰", color:C.amber, val:LIVE_LABELS.friction[last.friction] },
  ];
  return (
    <Accordion title={`체감 척도 추이 · 최근 ${recent.length}회`} defaultOpen={false}>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {metrics.map(m => (
          <div key={m.key}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
              <span style={{ fontSize:fs(10), color:C.dim }}>{m.label}</span>
              <span style={{ fontSize:fs(10), fontWeight:700, color:m.color }}>{m.val}</span>
            </div>
            {renderSparkline(m.key, m.color)}
          </div>
        ))}
      </div>
      <p style={{ fontSize:fs(9), color:C.muted, marginTop:8, lineHeight:1.4 }}>위로 갈수록 부하 높음 · 아래로 갈수록 안정</p>
    </Accordion>
  );
}

// ─── D2: Trust Engine — Why Layer + Effect Layer ───
const WHY_BY_PQ = {
  Q1: "생각이 과속하면서 긴장이 풀리지 않는 흐름이 있습니다",
  Q2: "외부 자극에 민감하게 반응하면서 에너지가 빠르게 빠지고 있습니다",
  Q3: "감정을 안으로 눌러두면서 처리되지 않은 무게가 쌓이고 있습니다",
  Q4: "반응이 예상보다 크게 나가면서 출력단에 부하가 걸리고 있습니다",
  Q5: "기본 에너지 기준선이 낮아지면서 시동이 잘 걸리지 않고 있습니다",
  Q6: "외부 기준과 비교하면서 자기 평가가 흔들리고 있습니다",
  Q7: "통제를 놓지 못하면서 조절단이 경직되고 있습니다",
};

function deriveWhyLayer({ hs, history, actionLog }) {
  const reasons = [];
  // 1순위: Q유형 기반 현재 흐름
  if (hs?.pq && WHY_BY_PQ[hs.pq]) reasons.push(WHY_BY_PQ[hs.pq]);
  // 2순위: 근거 보강
  const recent = (actionLog || []).filter(a => a.status === "completed").slice(-5);
  const hasRecovery = recent.some(a => ["universal-reset","micro-move","baseline-reset","body-scan"].includes(a.ref));
  if (!hasRecovery && recent.length > 0) reasons.push("최근 회복 루틴이 부족한 상태입니다");
  if (!hasRecovery && recent.length === 0) reasons.push("아직 시스템을 가볍게 조정한 기록이 없습니다");
  const recentHist = (history || []).slice(-5);
  const overloadCount = recentHist.filter(h => h.band === "overload" || h.band === "low").length;
  if (overloadCount >= 2) reasons.push("과부하 상태가 반복되고 있습니다");
  return reasons.slice(0, 2);
}

function deriveEffectLayer({ history }) {
  if (!history || history.length < 2) return null;
  const last = history[history.length - 1].avail;
  const prev = history[history.length - 2].avail;
  const diff = last - prev;
  if (diff > 3) return "최근 흐름이 좋아지고 있습니다";
  if (diff < -3) return "최근 흐름이 흔들리고 있습니다";
  return "현재 상태가 유지되고 있습니다";
}

// ─── D4-1: Daily Checklist (오늘의 시스템 운영) ───
function deriveDailyChecklist({ hist, actionLog }) {
  const today = new Date().toDateString();
  const todayScans = (hist || []).filter(h => new Date(h.ts).toDateString() === today);
  const todayActions = (actionLog || []).filter(a => {
    const t = a.completedAt || a.startedAt;
    return t && new Date(t).toDateString() === today && a.status === "completed";
  });
  const didScan = todayScans.length > 0;
  const didPatch = todayActions.some(a => a.ref !== "universal-reset");
  const didReset = todayActions.some(a => a.ref === "universal-reset");
  const isNight = (() => { const h = new Date().getHours(); return h >= 20 || h < 5; })();
  return [
    { id:"scan", label:"시스템 스캔", done:didScan, status:didScan ? "최신 상태가 반영되었습니다" : "시스템 데이터가 아직 업데이트되지 않았습니다" },
    { id:"patch", label:"운영 패치", done:didPatch, status:didPatch ? "부하 조정 이력이 기록되었습니다" : "미해결 부하가 감지되어 패치 대기 중입니다" },
    { id:"reset", label:"시스템 리셋", done:didReset, highlight:isNight && !didReset, status:didReset ? "회복 루틴이 적용되었습니다" : "오늘의 시스템 리셋이 아직 적용되지 않았습니다" },
  ];
}

function DailyChecklistCard({ items, onAction }) {
  const allDone = items.every(i => i.done);
  const hasHighlight = items.some(i => i.highlight);
  return (
    <Card style={{ padding:"14px 16px", ...(hasHighlight ? { border:`1px solid ${C.amber}40` } : {}) }}>
      {hasHighlight && (
        <div style={{ marginBottom:10, padding:"8px 10px", borderRadius:8, background:`${C.amber}08`, border:`1px solid ${C.amber}20` }}>
          <div style={{ fontSize:fs(10.5), fontWeight:700, color:C.amber }}>리셋 루틴이 아직 완료되지 않았습니다</div>
          <div style={{ fontSize:fs(9.5), color:C.muted, marginTop:2, lineHeight:1.45 }}>지금 3분이면 충분합니다</div>
        </div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:fs(11), fontWeight:700, color:C.muted }}>오늘의 시스템 운영</span>
        {allDone && <span style={{ fontSize:fs(9), color:C.teal, fontWeight:700, padding:"2px 8px", borderRadius:6, background:`${C.teal}12`, border:`1px solid ${C.teal}25` }}>완료</span>}
      </div>
      {items.map((item, i) => (
        <div key={item.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderTop:i > 0 ? `1px solid ${C.border}` : "none" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:fs(12), fontWeight:item.done ? 600 : 750, color:item.done ? C.dim : C.text }}>
              <span style={{ color:item.done ? C.teal : C.muted, marginRight:6 }}>{item.done ? "✓" : "○"}</span>
              {item.label}
            </div>
            <div style={{ fontSize:fs(10), color:C.muted, marginTop:2, marginLeft:18 }}>{item.status}</div>
          </div>
          {!item.done && (
            <button onClick={() => onAction(item.id)} style={{ flexShrink:0, fontSize:fs(10), padding:"5px 10px", borderRadius:8, border:item.highlight ? `1px solid ${C.amber}` : `1px solid ${C.accent}33`, background:item.highlight ? `${C.amber}12` : `${C.accent}10`, color:item.highlight ? C.amber : C.accent, fontWeight:700, fontFamily:FF, cursor:"pointer", marginLeft:8 }}>바로 하기</button>
          )}
        </div>
      ))}
      {allDone && (
        <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:`${C.teal}08`, border:`1px solid ${C.teal}20`, textAlign:"center" }}>
          <span style={{ fontSize:fs(11), fontWeight:700, color:C.teal }}>오늘의 운영 루틴이 정리되었습니다</span>
        </div>
      )}
    </Card>
  );
}

// ─── SectionBrandHeader (탭 공통 브랜드 헤더) ───
function SectionBrandHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:fs(12.6), letterSpacing:1.1, color:C.accent, textTransform:"uppercase", fontWeight:850, lineHeight:1.0, marginBottom:4 }}>Stato</div>
      <div style={{ fontSize:fs(5.8), letterSpacing:0.6, color:C.dim, textTransform:"uppercase", fontWeight:700, lineHeight:1.15, opacity:0.82, marginBottom:10 }}>Powered by Emotion OS</div>
      <div style={{ fontSize:fs(24), fontWeight:850, color:C.text, lineHeight:1.08, marginBottom:subtitle?6:0 }}>{title}</div>
      {!!subtitle && <div style={{ fontSize:fs(12.5), color:C.dim, lineHeight:1.5, maxWidth:520 }}>{subtitle}</div>}
    </div>
  );
}

// ─── BugDetailModal (Library용 버그 상세 화면) ───
const BUG_META = {
  "MND-OVERCLOCK-01":    { linkedQ:["Q1"], patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", leak:"조절단" },
  "MND-INPUTFLOOD-01":   { linkedQ:["Q2"], patch:"Sensory Reset", patchL:"감각 리셋 루틴", leak:"입력단" },
  "MND-EMOSUPPRESS-01":  { linkedQ:["Q3"], patch:"Voice Activation", patchL:"표현 활성화 패치", leak:"처리단" },
  "MND-OUTPUTHEAT-01":   { linkedQ:["Q4"], patch:"Stop Signal", patchL:"출력 차단 신호 패치", leak:"출력단" },
  "BDY-BOOTFAIL-01":     { linkedQ:["Q5"], patch:"Baseline Reset", patchL:"기준선 복구 패치", leak:"회복단" },
  "BDY-LOWPOWERLOCK-01": { linkedQ:["Q5"], patch:"Baseline Reset", patchL:"기준선 복구 패치", leak:"회복단" },
  "BDY-BEDLOCK-01":      { linkedQ:["Q5"], patch:"Baseline Reset", patchL:"기준선 복구 패치", leak:"회복단" },
  "MND-SELFDEVALUE-01":  { linkedQ:["Q6"], patch:"Permission Reset", patchL:"허용 기준 복구 패치", leak:"처리단" },
  "MND-FALSEPATCH-01":   { linkedQ:["Q6"], patch:"Benchmark Filter", patchL:"기준 필터 패치", leak:"처리단" },
  "MND-OVERCONTROL-01":  { linkedQ:["Q7"], patch:"Root Reset", patchL:"근원 재설정 패치", leak:"조절단" },
};

function BugDetailModal({ bugId, onClose }) {
  if (!bugId) return null;
  const alias = BUG_ALIAS[bugId];
  const meta = BUG_META[bugId];
  if (!alias || !meta) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px", animation:"esFadeIn 0.2s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"24px 20px", maxWidth:380, width:"100%", animation:"esSlideUp 0.25s ease", maxHeight:"85vh", overflowY:"auto" }}>
        {/* 버그명 */}
        <div style={{ fontSize:fs(20), fontWeight:850, color:C.text, lineHeight:1.25, marginBottom:4 }}>{alias.userName}</div>
        <div style={{ fontSize:fs(11), color:C.dim, marginBottom:14 }}>{alias.subName} · {bugId}</div>
        {/* 한 줄 상태 */}
        <div style={{ padding:"10px 14px", borderRadius:10, background:C.bg, marginBottom:12 }}>
          <div style={{ fontSize:fs(13), color:C.text, lineHeight:1.6 }}>{alias.oneLiner}</div>
        </div>
        {/* 원인 */}
        <div style={{ fontSize:fs(11), color:C.muted, marginBottom:4 }}>활성화 조건</div>
        <div style={{ fontSize:fs(12), color:C.dim, lineHeight:1.55, marginBottom:14 }}>{alias.why}</div>
        {/* 누수 위치 + 관련 Q유형 */}
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          <span style={{ padding:"4px 10px", borderRadius:8, background:`${C.accent}10`, border:`1px solid ${C.accent}25`, fontSize:fs(10), fontWeight:700, color:C.accent }}>누수: {meta.leak}</span>
          {meta.linkedQ.map(q => (
            <a key={q} href={QLinks[q]} target="_blank" rel="noopener noreferrer" style={{ padding:"4px 10px", borderRadius:8, background:`${C.blue}10`, border:`1px solid ${C.blue}25`, fontSize:fs(10), fontWeight:700, color:C.blue, textDecoration:"none" }}>{QL[q]}</a>
          ))}
        </div>
        {/* 연결 패치 */}
        <div style={{ fontSize:fs(11), color:C.muted, marginBottom:4 }}>연결 패치</div>
        <a href={PLinks[meta.patch]||"#"} target="_blank" rel="noopener noreferrer" style={{ display:"block", width:"100%", padding:"10px 14px", borderRadius:10, background:`${C.teal}06`, border:`1px solid ${C.teal}18`, marginBottom:14, cursor:"pointer", fontFamily:FF, textAlign:"left", textDecoration:"none" }}>
          <div style={{ fontSize:fs(14), fontWeight:700, color:C.teal }}>{meta.patchL}</div>
          <div style={{ fontSize:fs(10), color:C.dim, marginTop:2 }}>{meta.patch}</div>
        </a>
        {/* 하단 버튼 */}
        <div style={{ display:"flex", gap:8 }}>
          {BLinks[bugId] && <a href={BLinks[bugId]} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", height:40, borderRadius:12, border:`1px solid ${C.border}`, background:C.cardH, color:C.text, fontWeight:700, fontSize:fs(12), textDecoration:"none", fontFamily:FF }}>노션에서 자세히 보기</a>}
          <button onClick={onClose} style={{ flex:1, height:40, borderRadius:12, border:"none", background:C.accent, color:"#fff", fontWeight:800, fontSize:fs(12), fontFamily:FF, cursor:"pointer" }}>닫기</button>
        </div>
      </div>
    </div>
  );
}

// ─── PrincipleBanner (핵심 운영 문장 배너) ───
const PRINCIPLE_BY_BAND = {
  stable:  "좋은 흐름을 오래 유지하세요.",
  caution: "지금은 가동률이 떨어지기 전에 조정할 타이밍입니다.",
  low:     "오늘은 가동률 회복이 우선입니다.",
  overload:"지금은 더 새지 않게 막는 것이 먼저입니다.",
};
const PRINCIPLE_DEFAULT = "지금 상태를 읽고, 하루를 다시 운영하세요.";

function getPrincipleText(band) {
  return PRINCIPLE_BY_BAND[band] || PRINCIPLE_DEFAULT;
}

function PrincipleBanner({ text, tone }) {
  const color = tone === "accent" ? C.accent : tone === "teal" ? C.teal : tone === "blue" ? C.blue : C.muted;
  return (
    <div style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${color}14`, background:`${color}04`, marginBottom:10 }}>
      <p style={{ fontSize:fs(11), fontWeight:600, color, lineHeight:1.5, margin:0 }}>{text}</p>
    </div>
  );
}

// ─── Next Check-in 카드 ───
// 아침(5~11) / 점심(11~14) / 저녁(14~20) / 밤(20~5) 4 타임포인트
const CHECKIN_SLOTS = [
  { id:"morning",  range:[5,11],  icon:"🌅", label:"오늘 첫 운영 점검",             hint:"하루가 시작됩니다. 지금 상태를 먼저 스캔해두세요.",            cta:"Full Scan 새로 하기" },
  { id:"noon",     range:[11,14], icon:"☀️", label:"가동률 다시 보기",             hint:"오전의 피로 누적을 확인하고 지금 상태를 재점검합니다.",          cta:"가동률 재점검" },
  { id:"evening",  range:[14,20], icon:"🌆", label:"오늘 가장 많이 샌 감정 1개 기록", hint:"지금 이 순간까지 가장 에너지가 샌 패턴을 한 줄로 적습니다.",   cta:"누수 순간 기록" },
  { id:"night",    range:[20,29], icon:"🌙", label:"잠들기 전 3분 회복",            hint:"자기 전 3분. 오늘의 누수를 인정하고 내려놓는 시간입니다.",       cta:"3분 리셋" },
];

// 밴드별 하루 체크인 빈도 정의
const CHECKIN_FREQ = { stable:1, caution:2, low:3, overload:4 };

function getCheckinSlot() {
  const h = new Date().getHours();
  // 밤 20시 이후는 index 3, 아침 이전(0~4시)도 night으로 처리
  if (h >= 20 || h < 5) return CHECKIN_SLOTS[3];
  return CHECKIN_SLOTS.find(s => h >= s.range[0] && h < s.range[1]) || CHECKIN_SLOTS[0];
}

// 슬롯별 기본 ref + 폴백 체인
const SLOT_REF_MAP = { morning:null, noon:null, evening:"leak-note", night:"universal-reset" };
const CHECKIN_COOLDOWN_MS = 30 * 60 * 1000; // 30분 (P1 spec)

// ref별 대체 우선순위 체인 (spec 그대로)
const CHECKIN_FALLBACK = {
  "universal-reset": ["leak-note", "micro-move"],
  "leak-note":       ["micro-move", "env-reset"],
  "micro-move":      ["leak-note", "env-reset"],
  "env-reset":       ["leak-note", "universal-reset"],
  "slow-down":       ["root-reset", "leak-note"],
  "root-reset":      ["slow-down", "leak-note"],
  "voice-activate":  ["leak-note", "micro-move"],
};

// 실행 가능한 ref를 반환 (30분 내 completed면 폴백 체인 탐색)
function resolveCheckinRef(primaryRef, band, actionLog) {
  if (!primaryRef) return { ref:null, isOverloadException:false };
  const alog = actionLog || [];
  const done = (ref) => isRecentlyCompleted(alog, ref, CHECKIN_COOLDOWN_MS);

  // overload 예외: universal-reset은 방금 해도 한 번 더 허용
  if (primaryRef === "universal-reset" && band === "overload") {
    return { ref:"universal-reset", isOverloadException:true };
  }

  if (!done(primaryRef)) return { ref:primaryRef, isOverloadException:false };

  // 폴백 체인 탐색
  const chain = CHECKIN_FALLBACK[primaryRef] || [];
  for (const fb of chain) {
    if (!done(fb)) return { ref:fb, isOverloadException:false };
  }
  // 모든 체인이 소진 → 재점검 폴백 (ref null = onRc 호출)
  return { ref:null, isOverloadException:false, exhausted:true };
}

function NextCheckinCard({ band, onScan, onRc, onTimer, actionLog }) {
  const slot = getCheckinSlot();
  const freq = CHECKIN_FREQ[band] || 1;
  const freqLabel = freq >= 3 ? `하루 ${freq}회 체크인 권장` : freq === 2 ? "오전·저녁 체크인 권장" : "하루 1회 체크인";

  const primaryRef = SLOT_REF_MAP[slot.id] || null;
  const { ref:resolvedRef, isOverloadException, exhausted } = resolveCheckinRef(primaryRef, band, actionLog);

  // 폴백 발생 여부 (원래 ref와 다른 ref가 나왔으면)
  const isFallback = primaryRef && resolvedRef && resolvedRef !== primaryRef;
  const isAllDone = primaryRef && (exhausted || (!resolvedRef && !isOverloadException));

  // 폴백/예외 케이스에 맞는 라벨·힌트·cta 계산
  const getDisplay = () => {
    if (!primaryRef) {
      // morning 소프트 분기: 최근 12시간 내 실행 이력이 있으면 Full Scan 대신 가동률 확인 유도
      if (slot.id === "morning") {
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        const recentExecToday = (actionLog || []).some(a =>
          a.status === "completed" && a.completedAt &&
          a.completedAt >= todayStart.getTime() - 12 * 60 * 60 * 1000 // 12시간 내
        );
        if (recentExecToday) {
          return {
            label: "오늘 상태 먼저 확인",
            hint: "최근 실행 이력이 있습니다. 새 스캔보다 현재 가동률을 먼저 확인해보세요.",
            cta: "가동률 재점검",
            ctaAction: onRc,
            isMorningSoft: true,
          };
        }
      }
      return { label:slot.label, hint:slot.hint, cta:slot.cta, ctaAction:() => {
        if (slot.cta === "Full Scan 새로 하기") onScan();
        else onRc();
      }};
    }
    if (isAllDone) return { label:"오늘 체크인 완료", hint:"오늘 권장 루틴을 모두 완료했습니다. 가동률 재점검으로 현재 상태를 확인해보세요.", cta:"가동률 재점검", ctaAction:onRc };
    if (isOverloadException) return { label:slot.label, hint:"과부하 상태입니다. 한 번 더 안정화가 필요합니다.", cta:"한 번 더 안정화", ctaAction:() => onTimer && onTimer("universal-reset") };
    if (isFallback) {
      const fbHf = HOTFIX_DB.find(h => h.ref === resolvedRef);
      return { label:fbHf?.label || slot.label, hint:`방금 ${slot.cta.replace(" →","")} 대신 다른 방식으로 안정화를 이어갑니다.`, cta:fbHf?.cta || "실행", ctaAction:() => onTimer && onTimer(resolvedRef) };
    }
    return { label:slot.label, hint:slot.hint, cta:slot.cta, ctaAction:() => {
      if (slot.cta === "누수 순간 기록") onTimer && onTimer("leak-note");
      else if (slot.cta === "3분 리셋") onTimer && onTimer("universal-reset");
      else onScan();
    }};
  };

  const display = getDisplay();
  const { label, hint, cta, ctaAction } = display;
  const isMorningSoft = !!display.isMorningSoft;
  const accentColor = isAllDone ? C.green : isFallback ? C.teal : isMorningSoft ? C.blue : C.accent;
  const borderColor = isAllDone ? C.green+"40" : isFallback ? C.teal+"40" : isMorningSoft ? C.blue+"40" : C.borderL;
  const bgColor = isAllDone ? `${C.green}05` : isFallback ? `${C.teal}04` : isMorningSoft ? `${C.blue}04` : C.cardH;

  return (
    <div style={{ borderRadius:12, border:`1px solid ${borderColor}`, background:bgColor, padding:"14px 16px", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:fs(10), fontWeight:700, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Next Check-in</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {isAllDone && <span style={{ fontSize:fs(9), color:C.green, fontWeight:600, background:`${C.green}15`, padding:"1px 8px", borderRadius:8 }}>완료</span>}
          {isFallback && <span style={{ fontSize:fs(9), color:C.teal, fontWeight:600, background:`${C.teal}15`, padding:"1px 8px", borderRadius:8 }}>대안</span>}
          {isOverloadException && <span style={{ fontSize:fs(9), color:C.red, fontWeight:600, background:`${C.red}15`, padding:"1px 8px", borderRadius:8 }}>과부하</span>}
          {isMorningSoft && <span style={{ fontSize:fs(9), color:C.blue, fontWeight:600, background:`${C.blue}15`, padding:"1px 8px", borderRadius:8 }}>이력 반영</span>}
          <span style={{ fontSize:fs(9), color:C.muted }}>{freqLabel}</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <span style={{ fontSize:fs(18) }}>{slot.icon}</span>
        <span style={{ fontSize:fs(13), fontWeight:700, color:isAllDone ? C.green : C.text }}>{label}</span>
      </div>
      <p style={{ fontSize:fs(11), color:C.dim, lineHeight:1.6, marginBottom:10 }}>{hint}</p>
      <button
        onClick={ctaAction}
        style={{ padding:"8px 16px", borderRadius:9, border:`1px solid ${accentColor}40`, background:`${accentColor}10`, color:accentColor, fontSize:fs(12), fontWeight:600, fontFamily:FF, cursor:"pointer" }}
      >
        {cta} →
      </button>
    </div>
  );
}

// ═══ M6-c: NAVIGATION ════════════════════════════════════════════
// Bottom Navigation

const IH = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IS = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IA = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const IL = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>);

function BNav({ tab, setTab }) {
  const ts = [{ id:"home", I:IH, l:"Today" }, { id:"scan", I:IS, l:"Scan" }, { id:"action", I:IA, l:"Reset" }, { id:"library", I:IL, l:"Library" }];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.bg, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"8px 0 env(safe-area-inset-bottom,8px)", zIndex:200 }}>
      {ts.map(t => {
        const a = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"4px 12px", opacity:a?1:0.55 }}>
            <t.I a={a} />
            <span style={{ fontSize:fs(10), fontWeight:a?700:500, color:a?C.accent:C.muted, fontFamily:FF }}>{t.l}</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══ M6-d: 5R RADAR ══════════════════════════════════════════════
// 5R 레이더 차트

const RK = ["R1","R2","R3","R4","R5"];
const RS = { R1:"인지", R2:"조절", R3:"공명", R4:"회복", R5:"갱신" };

function R5RadarInner({ pr, result }) {
  const rL = { R1:0, R2:0, R3:0, R4:0, R5:0 };
  QS.forEach(q => { if (q.r1) rL[q.r1] = Math.max(rL[q.r1], result.nm[q.pq] || 0); });
  // R5(갱신)은 QS에 직접 매핑 없음 → Q6(비교)+Q7(통제) 평균으로 파생
  rL["R5"] = Math.round(((result.nm["Q6"] || 0) + (result.nm["Q7"] || 0)) / 2 * 10) / 10;
  // P0-1: SVG 180×180, rd 62, 라벨 반경 rd+20 — 모바일 한글 라벨 깨짐 방지
  const SZ = 180;
  const cx = SZ/2, cy = SZ/2, rd = 62, as = 2*Math.PI/5, sa = -Math.PI/2;
  const pts = RK.map((k,i) => { const a = sa+i*as, r = rd * Math.max(Math.min(rL[k]/100, 1), 0.08); return { x:cx+r*Math.cos(a), y:cy+r*Math.sin(a), k }; });
  // 라벨 반경 확대 + 각도별 dy 개별 보정 (상단·하단 라벨 잘림 방지)
  const lps = RK.map((k,i) => {
    const a = sa+i*as, r = rd+20;
    const x = cx+r*Math.cos(a), y = cy+r*Math.sin(a);
    const dy = i === 0 ? 2 : (i === 2 || i === 3) ? 3 : 0;
    return { x, y, k, dy };
  });
  return (
    <div style={{ display:"flex", justifyContent:"center", margin:"12px 0 8px" }}>
      <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`} style={{ overflow:"visible" }}>
        {[.33,.66,1].map(s => (<polygon key={s} points={RK.map((k,i) => { const a = sa+i*as, r = rd*s; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; }).join(" ")} fill="none" stroke={C.border} strokeWidth=".5" />))}
        {RK.map((k,i) => <line key={i} x1={cx} y1={cy} x2={cx+rd*Math.cos(sa+i*as)} y2={cy+rd*Math.sin(sa+i*as)} stroke={C.border} strokeWidth=".5" />)}
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill={`${C.accent}20`} stroke={C.accent} strokeWidth="1.5" />
        {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={p.k===pr?4:2.5} fill={p.k===pr?C.accent:C.dim} />)}
        {lps.map((p,i) => (
          <text
            key={i} x={p.x} y={p.y} dy={p.dy}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={12}
            fontWeight={p.k===pr ? 800 : 500}
            fill={p.k===pr ? C.accent : C.dim}
            fontFamily={FF}
          >{RS[p.k]}</text>
        ))}
      </svg>
    </div>
  );
}

const R5Radar = memo(R5RadarInner);

// ═══ M6-e: HISTORY GRAPH ═════════════════════════════════════════
// 히스토리 그래프 (실행 마커 포함)

function HistoryGraphInner({ history, actionLog }) {
  if (!history || history.length < 2) return null;
  const recent = history.slice(-10);
  const w = 280, h = 90, px = 12, py = 14;
  const gw = w - px*2, gh = h - py*2;
  const mn = Math.min(...recent.map(p => p.avail));
  const mx = Math.max(...recent.map(p => p.avail));
  const range = Math.max(mx - mn, 10);
  const pts = recent.map((p,i) => {
    const x = px + (i/(recent.length-1)) * gw;
    const y = py + gh - (((p.avail-mn)/range) * gh);
    return { x, y, avail:p.avail, type:p.type, ts:p.ts };
  });
  const pathD = pts.map((p,i) => i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`).join(" ");
  const areaD = pathD + ` L${pts[pts.length-1].x},${h-py} L${pts[0].x},${h-py} Z`;

  const acts = (actionLog || []).filter(a => a.status === "completed" && a.completedAt);
  const actionPts = [];
  for (let i = 1; i < pts.length; i++) {
    const prevTs = pts[i-1].ts || 0, curTs = pts[i].ts || 0;
    const between = acts.filter(a => a.completedAt > prevTs && a.completedAt <= curTs);
    if (between.length > 0) actionPts.push({ x:pts[i].x, y:pts[i].y - 12, count:between.length });
  }
  const lastTs = pts[pts.length-1].ts || 0;
  const pending = acts.filter(a => a.completedAt > lastTs);
  if (pending.length > 0) {
    const lastPt = pts[pts.length-1];
    actionPts.push({ x:Math.min(lastPt.x + 16, w - px), y:lastPt.y - 12, count:pending.length, isPending:true });
  }

  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:fs(12), color:C.muted }}>가동률 변화 추이</span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {actionPts.length > 0 && <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:fs(9), color:C.green }}><svg width="6" height="6"><polygon points="3,0 6,6 0,6" fill={C.green}/></svg>실행</span>}
          <span style={{ fontSize:fs(10), color:C.muted }}>최근 {recent.length}회</span>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          {[0,.5,1].map(r => (<line key={r} x1={px} y1={py+gh*(1-r)} x2={w-px} y2={py+gh*(1-r)} stroke={C.border} strokeWidth=".5" strokeDasharray="3,3" />))}
          {/* 50% 기준선 (Critical Line) */}
          {mn < 50 && mx > 50 && (() => { const y50 = py + gh - (((50-mn)/range) * gh); return (<><line x1={px} y1={y50} x2={w-px} y2={y50} stroke={C.amber} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" /><text x={w-px-1} y={y50-3} style={{ fontSize:7, fill:C.amber, textAnchor:"end", opacity:0.6 }}>50%</text></>); })()}
          <path d={areaD} fill={`${C.accent}08`} />
          <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p,i) => (<circle key={i} cx={p.x} cy={p.y} r={i===pts.length-1?4:2.5} fill={i===pts.length-1?C.accent:C.dim} stroke={i===pts.length-1?C.bg:"none"} strokeWidth={i===pts.length-1?2:0} />))}
          {actionPts.map((a,i) => (
            <g key={`a${i}`}>
              <polygon points={`${a.x},${a.y} ${a.x+4},${a.y+7} ${a.x-4},${a.y+7}`} fill={C.green} opacity={a.isPending ? 0.5 : 0.85} strokeDasharray={a.isPending ? "2,1" : "none"} stroke={a.isPending ? C.green : "none"} strokeWidth={a.isPending ? 0.5 : 0} />
              {a.count > 1 && <><circle cx={a.x} cy={a.y-6} r={6} fill={C.green} /><text x={a.x} y={a.y-5.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:fs(7), fill:"#fff", fontWeight:700, fontFamily:FF }}>{a.count}</text></>}
            </g>
          ))}
          <text x={px} y={h-2} style={{ fontSize:fs(8), fill:C.muted }}>{mn}%</text>
          <text x={w-px} y={py-2} style={{ fontSize:fs(8), fill:C.muted, textAnchor:"end" }}>{mx}%</text>
        </svg>
      </div>
      {recent.length >= 2 && (() => { const last = recent[recent.length-1].avail, prev = recent[recent.length-2].avail, d = last - prev; return d !== 0 ? <p style={{ fontSize:fs(11), color:d>0?C.green:C.red, marginTop:6, textAlign:"center" }}>직전 대비 {d>0?"+":""}{d}%</p> : null; })()}
    </Card>
  );
}

const HistoryGraph = memo(HistoryGraphInner);

// ─── Onboarding (최초 1회, 3페이지) ───
function Onboarding({ onDone, onScan }) {
  const [page, setPage] = useState(0);
  const pages = [
    { title:"감정도 운영이 됩니다", body:"Stato는 오늘의 감정 상태를 읽고,\n에너지가 새는 지점을 찾아\n하루를 다시 운영하게 돕는 앱입니다.\n\n2분 점검으로 지금 상태를 확인해보세요." },
    { title:"점검 → 해석 → 실행", body:"이건 문제를 한 번에 해결하는 앱이 아닙니다.\n\n지금 무너지는 상태를 짧게 조정하고,\n재점검으로 변화를 확인하는 앱입니다.\n\n지금 바로 시작할 수 있습니다.", cta:"지금 스캔 시작하기", ctaAction:() => { try { localStorage.setItem(ONBOARD_KEY, "1"); } catch(e) {} onScan(); }, footnote:"기록은 현재 기기에 저장됩니다" },
    { title:"기록은 이 기기에 저장됩니다", body:"운영 기록은 현재 이 기기의 브라우저에 저장됩니다.\n브라우저 초기화 또는 기기 변경 시 기록이 삭제될 수 있습니다.\n\n서버 연동은 추후 업데이트에서 지원할 예정입니다." },
  ];
  const p = pages[page];
  return (
    <div style={{ minHeight:"76vh", padding:"28px 20px 112px", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:360, textAlign:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:22 }}>
          <div style={{ width:70, height:70, borderRadius:22, background:"linear-gradient(135deg, #0c8a89 0%, #2eb5a5 100%)", border:`1px solid ${C.borderL}`, boxShadow:"0 14px 34px rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none"><path d="M23.8 17.8C20.1 17.8 16.7 20.2 15.4 23.7C19.4 24.4 22.4 22.8 24.2 19.4C24.4 19 24.1 17.8 23.8 17.8Z" fill="#B9F58F"/><path d="M26.1 16.8C31.7 16.8 35.7 20.5 36.7 25.8C31.8 26.6 28.2 24.7 25.9 20.5C25.6 20 25.8 16.8 26.1 16.8Z" fill="#B9F58F"/><path d="M24.7 23.5C24.7 23.1 23.3 23.1 23.3 23.5V35.5C23.3 36.4 24 37.1 24.9 37.1H25.1C26 37.1 26.7 36.4 26.7 35.5V24.7C26.7 24 25.6 23.5 24.7 23.5Z" fill="#B9F58F"/></svg>
          </div>
          <div style={{ fontSize:fs(16.5), letterSpacing:1.0, color:C.accent, textTransform:"uppercase", fontWeight:850, lineHeight:1.0 }}>Stato</div>
        </div>
        <h2 style={{ fontSize:fs(20), fontWeight:800, color:C.text, lineHeight:1.3, marginBottom:12 }}>{p.title}</h2>
        <p style={{ fontSize:fs(12.5), color:C.dim, lineHeight:1.72, marginBottom:20, whiteSpace:"pre-line" }}>{p.body}</p>
        {p.cta && <Btn primary onClick={p.ctaAction} style={{ width:"100%", maxWidth:320, marginBottom:8 }}>{p.cta}</Btn>}
        {p.footnote && <p style={{ fontSize:fs(9.5), color:C.muted, opacity:0.88, fontWeight:600, marginBottom:12 }}>{p.footnote}</p>}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:16 }}>
          {pages.map((_, i) => <div key={i} style={{ width:i===page?20:6, height:6, borderRadius:3, background:i===page?C.accent:`${C.muted}40`, transition:"width 0.2s ease" }} />)}
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          {page > 0 && <Btn small onClick={() => setPage(page-1)} style={{ minWidth:80 }}>이전</Btn>}
          {page < pages.length - 1 ? (
            <Btn small onClick={() => setPage(page+1)} style={{ minWidth:80 }}>다음</Btn>
          ) : (
            <Btn primary small onClick={onDone} style={{ minWidth:120 }}>시작하기</Btn>
          )}
        </div>
        {page < pages.length - 1 && <button onClick={onDone} style={{ marginTop:12, background:"none", border:"none", fontSize:fs(10), color:C.muted, cursor:"pointer", fontFamily:FF }}>건너뛰기</button>}
      </div>
    </div>
  );
}

// ═══ M7-a: HOME ══════════════════════════════════════════════════
// Today Screen (formerly Home)

function Home() {
  const { hs, hist, onScan, onRc, onCp, onClear, onTimer, onGoReset, actionLog, cr } = useApp();
  const [onboardDone, setOnboardDone] = useState(() => { try { return !!localStorage.getItem(ONBOARD_KEY); } catch(e) { return false; } });
  const finishOnboard = () => { try { localStorage.setItem(ONBOARD_KEY, "1"); } catch(e) {} setOnboardDone(true); };

  // D3-beta: 내부 개인화 점수 계산 (콘솔 전용, UI 미노출)
  // ⚠️ React Hook 순서 보장: 모든 useEffect는 조기 반환 전에 배치
  const fx = (hs.source !== "empty" && hs.qpr) ? getHotFixes(hs.qpr) : [];
  useEffect(() => {
    if (hs.source === "empty" || fx.length === 0) return;
    const ps = loadPersonalState();
    if (!canRunD3Beta(ps)) return;
    const personalized = getPersonalizedCandidates(fx, ps);
    debugPersonalization(fx, personalized);
  }, [hs.avail]);

  if (hs.source === "empty" && !onboardDone) return <Onboarding onDone={finishOnboard} onScan={() => { finishOnboard(); onScan(); }} />;

  if (hs.source === "empty") return (
    <div style={{ minHeight:"76vh", padding:"28px 20px 112px", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:360, textAlign:"center" }}>
        {/* Brand block */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:22 }}>
          <div style={{ width:70, height:70, borderRadius:22, background:"linear-gradient(135deg, #0c8a89 0%, #2eb5a5 100%)", border:`1px solid ${C.borderL}`, boxShadow:"0 14px 34px rgba(0,0,0,0.28)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M23.8 17.8C20.1 17.8 16.7 20.2 15.4 23.7C19.4 24.4 22.4 22.8 24.2 19.4C24.4 19 24.1 17.8 23.8 17.8Z" fill="#B9F58F" />
              <path d="M26.1 16.8C31.7 16.8 35.7 20.5 36.7 25.8C31.8 26.6 28.2 24.7 25.9 20.5C25.6 20 25.8 16.8 26.1 16.8Z" fill="#B9F58F" />
              <path d="M24.7 23.5C24.7 23.1 23.3 23.1 23.3 23.5V35.5C23.3 36.4 24 37.1 24.9 37.1H25.1C26 37.1 26.7 36.4 26.7 35.5V24.7C26.7 24 25.6 23.5 24.7 23.5Z" fill="#B9F58F" />
            </svg>
          </div>
          <div style={{ fontSize:fs(16.5), letterSpacing:1.0, color:C.accent, textTransform:"uppercase", fontWeight:850, lineHeight:1.0 }}>Stato</div>
          <div style={{ fontSize:fs(6.2), letterSpacing:0.6, color:C.dim, textTransform:"uppercase", fontWeight:700, lineHeight:1.15, marginTop:5, opacity:0.82 }}>Powered by Emotion OS</div>
        </div>
        {/* Hook */}
        <h2 style={{ fontSize:fs(18.8), fontWeight:800, color:C.text, lineHeight:1.28, marginBottom:8 }}>요즘 감정 날씨는 어떤가요?</h2>
        <p style={{ fontSize:fs(12.2), color:C.accent, fontWeight:700, lineHeight:1.5, marginBottom:16 }}>감정 누수 10%만 줄여도 하루의 질이 달라집니다.</p>
        {/* Empty info card */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"13px 16px 12px", marginBottom:18 }}>
          <div style={{ fontSize:fs(12.9), fontWeight:720, color:C.text, marginBottom:4 }}>아직 시스템 데이터가 없습니다</div>
          <p style={{ fontSize:fs(11.2), color:`${C.text}cc`, fontWeight:500, lineHeight:1.58, margin:0 }}>먼저 2분 스캔으로 현재 감정 운영 상태를 확인하세요.</p>
        </div>
        <Btn primary onClick={onScan} style={{ width:"100%", maxWidth:320, marginBottom:18 }}>지금 스캔 시작하기</Btn>
        <div style={{ fontSize:fs(9.2), color:C.muted, opacity:0.96, lineHeight:1.45, marginTop:2 }}>by HaruTech Lab · Emotional Engineering Institute</div>
      </div>
    </div>
  );

  const b = BAND[hs.band];
  // fx는 이미 조기 반환 전에 계산됨
  // 체크리스트용: universal-reset 제외 1순위
  const patchExecTop = fx.find(f => isExecutableHotFix(f.ref) && f.ref !== "universal-reset");
  // Quick Patch용: 체크리스트 1순위도 제외한 다른 실행형 패치 (중복 방지)
  const execTop = patchExecTop
    ? fx.find(f => isExecutableHotFix(f.ref) && f.ref !== "universal-reset" && f.ref !== patchExecTop.ref)
    : null;
  const homeProto = PROTO_DB.find(p => p.qMatch.includes(hs.pq));
  const homePrac = PRAC_DB.find(p => p.qMatch.includes(hs.pq));
  const recentActions = getVisibleActions(actionLog, 3);
  const isHighStress = hs.band === "overload" || hs.band === "low";
  const justCompleted = !isHighStress && execTop && isRecentlyCompleted(actionLog, execTop.ref);
  const showExecTop = execTop && !justCompleted;

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:fs(15.5), letterSpacing:1.4, color:C.accent, textTransform:"uppercase", fontWeight:800, lineHeight:1.0 }}>Stato</div>
          <div style={{ fontSize:fs(7.4), letterSpacing:0.78, color:C.dim, textTransform:"uppercase", marginTop:2, lineHeight:1.15, opacity:0.88, fontWeight:700 }}>Powered by Emotion OS</div>
          <div style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginTop:6 }}>Today</div>
        </div>
        {hs.isRc && hs.delta != null && <DBadge delta={hs.delta} />}
      </div>

      {/* 1. 상단 Full Scan CTA */}
      <Btn primary onClick={onScan} style={{ width:"100%", marginBottom:14 }}>새 Full Scan</Btn>

      {/* 2. TodayHeroCard: 상태 요약 + 가동률 */}
      {(() => {
        const m = deriveLiveMetrics(hs);
        const headline = deriveSummaryHeadline(hs, m);
        const badges = [
          { l:m.fatigueLabel, t:toneByIndex(m.fatigueIdx), k:"피로" },
          { l:m.productivityLabel, t:toneByIndex(m.productivityIdx), k:"몰입" },
          { l:m.frictionLabel, t:toneByIndex(m.frictionIdx), k:"마찰" },
        ];
        return (
          <Card style={{ padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:fs(11), color:C.muted }}>오늘의 상태</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:fs(10), color:C.dim }}>현재 가동률</span>
                <ANum value={hs.avail} color={b.c} size={18} suffix="%" />
              </div>
            </div>
            <p style={{ fontSize:fs(14), fontWeight:700, color:C.text, lineHeight:1.5, marginBottom:8 }}>{headline}</p>
            <div style={{ fontSize:fs(12), color:C.accent, fontWeight:700, lineHeight:1.45, marginBottom:10 }}>오늘은 5%만 올려보세요</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {badges.map((bg,i) => (
                <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:999, fontSize:fs(10), fontWeight:600, color:bg.t.fg, background:bg.t.bg, border:`1px solid ${bg.t.border}` }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:bg.t.fg }} />{bg.k} {bg.l}
                </span>
              ))}
            </div>
          </Card>
        );
      })()}

      {/* 2.5 오늘의 시스템 운영 체크리스트 */}
      {(() => {
        const checklist = deriveDailyChecklist({ hist, actionLog });
        const handleAction = (id) => {
          if (id === "scan") onScan();
          else if (id === "patch") { if (patchExecTop) onTimer(patchExecTop.ref); else onGoReset(); }
          else if (id === "reset") onTimer("universal-reset");
        };
        return <DailyChecklistCard items={checklist} onAction={handleAction} />;
      })()}

      {/* 3. PrincipleBanner */}
      <PrincipleBanner text={getPrincipleText(hs.band)} tone={hs.band === "stable" ? "teal" : "accent"} />

      {/* 3.2 Why Layer — 왜 지금 이 상태인가 */}
      {(() => {
        const whys = deriveWhyLayer({ hs, history:hist, actionLog });
        if (!whys.length) return null;
        return (
          <div style={{ padding:"8px 14px", borderRadius:8, background:C.card, border:`1px solid ${C.border}`, marginBottom:10 }}>
            <div style={{ fontSize:fs(10), color:C.muted, marginBottom:4 }}>현재 상태 해석</div>
            {whys.map((w,i) => <p key={i} style={{ fontSize:fs(i===0?12:11), fontWeight:i===0?700:500, color:i===0?C.text:C.muted, lineHeight:1.55, margin:0, marginTop:i>0?3:0 }}>{w}</p>)}
          </div>
        );
      })()}

      {/* 3.5 지금 가동률이 떨어진 이유 */}
      <BugSignalCard hs={hs} onGoReset={onGoReset} />

      {/* 4. Quick Patch 1순위 (지금 가장 먼저 할 것) */}
      {justCompleted ? (() => {
        const todayCount = (actionLog || []).filter(a => { const t = a.completedAt; return t && new Date(t).toDateString() === new Date().toDateString() && a.status === "completed"; }).length;
        return (
        <Card accent={`${C.green}30`} style={{ background:`${C.green}05` }}>
          <div style={{ fontSize:fs(11), color:C.green, fontWeight:700, marginBottom:6 }}>✓ 방금 회복 완료</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.green, marginBottom:4 }}>과열이 낮아졌습니다</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.6 }}>지금 가벼운 일 하나를 처리하기 좋은 상태입니다.</p>
          {todayCount > 0 && <p style={{ fontSize:fs(10), color:C.teal, fontWeight:600, margin:"6px 0 0" }}>오늘 {todayCount}회 회복 완료</p>}
          <div style={{ marginTop:10 }}><Btn small style={{ maxWidth:220 }} onClick={onRc}>재점검으로 변화 확인</Btn></div>
        </Card>);
      })() : showExecTop ? (
        <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>지금 가장 먼저 할 것</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.teal, marginBottom:4 }}>{execTop.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>큰 해결보다 지금 상태를 먼저 조정합니다.</p>
          <div style={{ marginTop:10 }}><Btn primary small style={{ maxWidth:220 }} onClick={() => onTimer && onTimer(execTop.ref)}>{execTop.cta}</Btn></div>
        </Card>
      ) : homeProto ? (
        <Card accent={`${C.blue}20`} style={{ background:`${C.blue}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>추천 Protocol</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.blue, marginBottom:4 }}>{homeProto.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{homeProto.desc}</p>
          <div style={{ marginTop:10 }}><Btn small onClick={onGoReset} style={{ maxWidth:200 }}>Reset 탭에서 보기</Btn></div>
        </Card>
      ) : homePrac ? (
        <Card accent={`${C.teal}20`} style={{ background:`${C.teal}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>추천 Practice</div>
          <div style={{ fontSize:fs(13), fontWeight:600, color:C.teal, marginBottom:4 }}>{homePrac.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{homePrac.desc}</p>
          <div style={{ marginTop:10 }}><Btn small onClick={onGoReset} style={{ maxWidth:200 }}>Reset 탭에서 적용</Btn></div>
        </Card>
      ) : (
        <Card accent={`${C.accent}20`} style={{ background:`${C.accent}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>Quick Reset</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.accent, marginBottom:4 }}>3분 리셋</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>모든 것을 멈추고 3분간 아무것도 하지 않습니다. 눈을 감고 호흡만 느끼세요.</p>
          <div style={{ marginTop:10 }}><Btn primary small style={{ maxWidth:200 }} onClick={() => onTimer && onTimer("universal-reset")}>지금 리셋하기</Btn></div>
        </Card>
      )}

      {/* 4.5 Effect Layer — 최근 흐름 해석 */}
      {(() => {
        const effect = deriveEffectLayer({ history:hist });
        if (!effect) return null;
        const isUp = effect.includes("좋아지고");
        const color = isUp ? C.teal : effect.includes("흔들리고") ? C.accent : C.dim;
        return (
          <div style={{ padding:"6px 14px", borderRadius:8, background:`${color}06`, border:`1px solid ${color}14`, marginBottom:10 }}>
            <p style={{ fontSize:fs(10.5), color, fontWeight:600, lineHeight:1.45, margin:0 }}>{effect}</p>
          </div>
        );
      })()}

      {/* 5. 실행 이력 */}
      {recentActions.length > 0 && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:fs(11), fontWeight:700, color:C.green, letterSpacing:2, textTransform:"uppercase" }}>실행 이력</span>
            <span style={{ fontSize:fs(10), color:C.muted }}>최근 {recentActions.length}건</span>
          </div>
          {recentActions.map((a,i) => (
            <div key={a.id||i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop:i>0?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:3, background:a.status==="cancelled"?C.amber:a.status==="unknown"?C.muted:C.green, flexShrink:0 }} />
                <span style={{ fontSize:fs(12), color:C.text }}>{a.label}</span>
                {a.status==="cancelled" && <span style={{ fontSize:fs(9), color:C.amber }}>중단</span>}
                {a.status==="unknown" && <span style={{ fontSize:fs(9), color:C.muted }}>기록 불완전</span>}
              </div>
              <span style={{ fontSize:fs(11), color:C.muted }}>{fmtTime(a.completedAt || a.cancelledAt || a.startedAt)}</span>
            </div>
          ))}
        </Card>
      )}

      {/* 6. 가동률 상세 (아래로 이동) */}
      <Accordion title="가동률 상세" defaultOpen={false}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:fs(12), color:C.dim }}>현재 가동률</span>
          <Badge text={b.l} color={b.c} />
        </div>
        <MiniBar pct={hs.avail} color={b.c} h={6} />
        <p style={{ fontSize:fs(12), color:C.dim, marginTop:8, lineHeight:1.5 }}>{b.d}</p>
        {hs.spread && <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${C.amber}06`, border:`1px solid ${C.amber}20` }}><span style={{ fontSize:fs(11), fontWeight:600, color:C.amber }}>복수 영역 동시 부하 감지</span></div>}
        {hs.source === "recheck_overlay" && <p style={{ fontSize:fs(10), color:C.muted, marginTop:6 }}>가동률은 최근 재점검 기준이며, 핵심 패턴은 Full Scan 기준입니다</p>}
        {(() => { const fst = hist.filter(h => h.type === "full").slice(-1)[0]?.ts; if (!fst) return null; const days = Math.floor((Date.now() - fst) / 86400000); return <p style={{ fontSize:fs(10), color:C.muted, marginTop:6 }}>마지막 Full Scan: {days === 0 ? "오늘" : `${days}일 전`}{days >= 14 ? " · 새 Full Scan을 권장합니다" : ""}</p>; })()}
      </Accordion>

      {/* 6.5 Next Check-in 카드 */}
      <NextCheckinCard band={hs.band} onScan={onScan} onRc={onRc} onTimer={onTimer} actionLog={actionLog} />

      {/* 7~8: 운영 데이터 더 보기 (2차 영역 — 접기) */}
      <div style={{ fontSize:fs(10), color:C.muted, margin:"8px 0 6px", paddingLeft:2, letterSpacing:1.4, textTransform:"uppercase" }}>상세 분석</div>
      <Accordion title="운영 데이터 더 보기 · 최근 추이 요약" defaultOpen={false}>
        <HistoryGraph history={hist} actionLog={actionLog} />
        <MetricsTrendCard history={hist} />
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <span style={{ fontSize:fs(12), color:C.muted }}>현재 활성 패턴</span>
            {hs.source === "recheck_overlay" && <span style={{ fontSize:fs(9), color:C.muted }}>Full Scan 기준</span>}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:fs(15), fontWeight:700, color:C.accent }}>{QL[hs.pq]}</span>
            <Badge text={hs.leak} color={C.blue} />
            <Badge text={RL[hs.r1]} color={C.purple} />
          </div>
          {hs.mode && <p style={{ fontSize:fs(12), color:C.dim, marginTop:8 }}><strong style={{ color:C.teal }}>{hs.mode}</strong> — {hs.modeD}</p>}
        </Card>
        {hs.mode && (
          <Card accent={`${C.teal}20`} style={{ background:`${C.teal}04` }}>
            <div style={{ fontSize:fs(10), color:C.muted, marginBottom:6 }}>오늘의 운영 모드</div>
            <div style={{ fontSize:fs(17), fontWeight:800, color:C.teal, lineHeight:1.2, marginBottom:6 }}>{hs.mode}</div>
            <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.55, marginBottom:8 }}>{hs.modeD}</p>
            <div style={{ padding:"8px 12px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}` }}>
              <p style={{ fontSize:fs(10.5), color:C.muted, lineHeight:1.5, margin:0 }}>성격을 바꾸라는 뜻이 아닙니다. 지금 시스템 상태에서 가동률을 덜 잃는 임시 운영 자세입니다.</p>
            </div>
          </Card>
        )}
      </Accordion>

      {/* 하단 버튼 */}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <Btn small onClick={onRc} style={{ flex:1 }}>가동률 재점검</Btn>
        <Btn small onClick={onGoReset} style={{ flex:1 }}>Reset 탭 열기</Btn>
      </div>
      <div style={{ marginTop:12, textAlign:"center" }}>
        <p style={{ fontSize:fs(9), color:C.muted, opacity:0.7, lineHeight:1.45, marginBottom:8 }}>현재 운영 기록은 이 기기에 저장됩니다. 브라우저 초기화 시 기록이 삭제될 수 있습니다.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", alignItems:"center" }}>
          <button onClick={() => { try { const data = { state:JSON.parse(localStorage.getItem(STORAGE_KEY)), actionLog:JSON.parse(localStorage.getItem(ALOG_KEY)), personal:JSON.parse(localStorage.getItem(PERSONAL_KEY)), exportedAt:new Date().toISOString() }; const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`stato-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url); } catch(e) { console.error("Export failed", e); } }} style={{ background:"none", border:"none", fontSize:fs(10), color:C.dim, cursor:"pointer", fontFamily:FF, padding:4 }}>기록 백업 저장</button>
          <button onClick={onClear} style={{ background:"none", border:"none", fontSize:fs(10), color:C.muted, cursor:"pointer", fontFamily:FF, padding:4 }}>데이터 초기화</button>
        </div>
        <p style={{ fontSize:fs(8), color:C.muted, opacity:0.5, marginTop:4 }}>복원 기능은 추후 지원 예정</p>
      </div>
    </div>
  );
}

// ═══ M7-b: SCAN FLOW ═════════════════════════════════════════════
// Scan Flow

function ScanFlow({ onComplete, isRc, rcQs }) {
  const qs = isRc ? rcQs : QS;
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState(Array(qs.length).fill(null));
  const ref = useRef(null);
  const q = qs[idx];

  const pick = v => {
    const n = [...ans]; n[idx] = v; setAns(n);
    if (idx < qs.length - 1) setTimeout(() => setIdx(idx+1), 180);
    else setTimeout(() => onComplete(n, qs), 250);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = "0"; ref.current.style.transform = "translateY(8px)";
      requestAnimationFrame(() => { if (ref.current) { ref.current.style.transition = "opacity 0.3s,transform 0.3s"; ref.current.style.opacity = "1"; ref.current.style.transform = "translateY(0)"; } });
    }
  }, [idx]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px 100px" }}>
      <div style={{ maxWidth:460, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <Badge text={isRc ? "가동률 재점검" : "Full Scan"} color={C.accent} />
          <span style={{ fontSize:fs(12), color:C.muted }}>{idx+1} / {qs.length}</span>
        </div>
        <div style={{ width:"100%", height:3, background:C.border, borderRadius:2, overflow:"hidden", marginBottom:26 }}>
          <div style={{ width:`${((idx+1)/qs.length)*100}%`, height:"100%", background:C.accent, borderRadius:2, transition:"width 0.4s" }} />
        </div>
        <div ref={ref}>
          {idx === 0 && !isRc && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:`${C.teal}06`, border:`1px solid ${C.teal}18`, marginBottom:20 }}>
              <p style={{ fontSize:fs(11.5), color:C.teal, fontWeight:700, margin:0, marginBottom:4 }}>성격 검사가 아닙니다</p>
              <p style={{ fontSize:fs(10.5), color:C.dim, margin:0, lineHeight:1.5 }}>최근 2주간 반복된 패턴을 확인하는 점검입니다. 21문항을 진솔하게 답변할수록 진단 정확도가 높아집니다.</p>
            </div>
          )}
          <p style={{ fontSize:fs(15), color:C.text, lineHeight:1.75, marginBottom:26, minHeight:54 }}>{isRc ? (q.rcP || q.p) : q.p}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {SCALE.map(o => {
              const sel = ans[idx] === o.v;
              return (
                <button key={o.v} onClick={() => pick(o.v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 16px", borderRadius:11, border:`1px solid ${sel?C.accent:C.border}`, background:sel?C.accentD:C.card, color:sel?C.text:C.dim, fontSize:fs(14), fontFamily:FF, cursor:"pointer", textAlign:"left" }}>
                  <span style={{ width:26, height:26, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", fontSize:fs(12), fontWeight:700, color:sel?C.accent:C.muted, background:sel?`${C.accent}20`:C.border, flexShrink:0 }}>{o.v}</span>
                  {o.l}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:18 }}>
          <button onClick={() => idx > 0 && setIdx(idx-1)} disabled={idx===0} style={{ padding:"6px 12px", borderRadius:6, border:`1px solid ${C.border}`, background:"transparent", color:idx===0?C.border:C.dim, fontSize:fs(11), cursor:idx===0?"default":"pointer", fontFamily:FF }}>이전</button>
          <span style={{ fontSize:fs(10), color:C.muted }}>{isRc ? "지금 이 순간 기준" : "최근 2주 기준"}</span>
        </div>
      </div>
    </div>
  );
}

// ═══ M7-c: SCAN TAB ══════════════════════════════════════════════
// Scan Tab

function ScanTab() {
  const { cr:result, onScan, onRc, onCp } = useApp();
  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <SectionBrandHeader title="Scan" subtitle="새 스캔, 재점검, Couple 연결을 관리하는 도구 탭" />
      <Card onClick={onScan} style={{ cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.accentD, display:"flex", alignItems:"center", justifyContent:"center" }}><IS a /></div>
          <div><div style={{ fontSize:fs(14), fontWeight:700, color:C.text }}>새 Full Scan</div><div style={{ fontSize:fs(12), color:C.dim }}>21문항 · 약 2분</div></div>
        </div>
      </Card>
      <Card onClick={result?onRc:null} style={{ cursor:result?"pointer":"default", opacity:result?1:0.4 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.tealD, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg></div>
          <div><div style={{ fontSize:fs(14), fontWeight:700, color:C.text }}>가동률 재점검</div><div style={{ fontSize:fs(12), color:C.dim }}>{result ? "3~5문항 · 현재 가동률 오버레이" : "Full Scan을 먼저 진행하세요"}</div></div>
        </div>
      </Card>
      <Card onClick={onCp} style={{ cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.blueD, display:"flex", alignItems:"center", justifyContent:"center" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg></div>
          <div><div style={{ fontSize:fs(14), fontWeight:700, color:C.text }}>Couple Sync <span style={{ fontSize:fs(11), color:C.amber, fontWeight:600 }}>(Beta)</span></div><div style={{ fontSize:fs(12), color:C.dim }}>미리보기 모드 · 연결 엔진 준비 중</div></div>
        </div>
      </Card>
      <div style={{ textAlign:"center", padding:"16px 0 0", fontSize:fs(9), color:C.muted }}>by HaruTech Lab · Emotional Engineering Institute</div>
    </div>
  );
}

// ═══ M7-d: ACTION TAB ════════════════════════════════════════════
// Action Tab

function ActionTab() {
  const { cr:result, onTimer, actionLog } = useApp();
  const fx = getHotFixes(result).slice(0, 3);
  const hi = result && (result.band === "overload" || result.band === "low");

  if (!result) return (
    <div style={{ padding:"20px 16px 100px" }}>
      <SectionBrandHeader title="Reset" subtitle="스캔 결과가 있어야 맞춤형 패치를 추천할 수 있습니다." />
    </div>
  );

  const proto = PROTO_DB.find(p => p.qMatch.includes(result.pq));
  const prac = PRAC_DB.find(p => p.qMatch.includes(result.pq)) || PRAC_DB.find(p => p.qMatch.includes(result.sq));
  const extra = PRAC_DB.filter(p => p !== prac && (p.qMatch.includes(result.pq) || p.qMatch.includes(result.sq))).slice(0, 2);
  const execFx = fx.filter(f => isExecutableHotFix(f.ref));
  const pendFx = fx.filter(f => !isExecutableHotFix(f.ref));
  // Today 1순위와 Reset 상단 중복 제거
  const topExecRef = execFx[0]?.ref || null;
  const execFxAlt = topExecRef ? execFx.filter(f => f.ref !== topExecRef) : execFx;
  const execFxForReset = execFxAlt.length > 0 ? execFxAlt : execFx;
  const recentActs = getVisibleActions(actionLog, 3);
  const wasExecuted = (ref) => {
    const latest = getLatestActionByRef(actionLog, ref);
    return latest ? latest.status === "completed" && !!latest.completedAt : false;
  };

  // Reset 탭 Hero 추천 결정
  const b = BAND[result.band] || BAND.stable;
  const heroFx = execFxForReset[0] || null;
  const heroRef = heroFx?.ref || "universal-reset";
  const heroHf = heroFx || HOTFIX_DB.find(h => h.ref === "universal-reset");
  const restFx = execFxForReset.slice(1);

  // 상태 인식 문구 (진단 + 행동 명령)
  const statusLine = result.band === "overload" ? "지금은 해결하려 하지 마세요. 먼저 식히세요"
    : result.band === "low" ? "시동이 안 걸리는 상태입니다. 가장 작은 것부터 시작하세요"
    : result.band === "caution" ? "누수가 감지되고 있습니다. 지금 차단하세요"
    : "안정 상태입니다. 리듬을 유지하세요";

  // Hero 버튼 문구 (행동형)
  const heroCta = result.band === "overload" ? `지금 식히기 (${Math.floor((heroHf?.durationSec||180)/60)}분)`
    : result.band === "low" ? `시동 걸기 (${Math.floor((heroHf?.durationSec||60)/60)}분)`
    : `지금 시작 (${Math.floor((heroHf?.durationSec||180)/60)}분)`;

  // Hero 효과 문구
  const heroEffect = result.band === "overload" ? "90초 안에 안정화를 시작합니다"
    : result.band === "low" ? "가장 작은 움직임으로 시스템을 재가동합니다"
    : result.band === "caution" ? "가장 먼저 시도할 작은 조정입니다"
    : "현재 리듬을 더 단단하게 만듭니다";

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <SectionBrandHeader title="Reset" subtitle="설명보다 실행. 지금 바로." />

      {/* 1. 상태 인식 (진단 + 명령) */}
      <div style={{ padding:"8px 14px", borderRadius:8, background:b.bg, border:`1px solid ${b.c}20`, marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:4, background:b.c, flexShrink:0 }} />
          <span style={{ fontSize:fs(11), fontWeight:700, color:b.c }}>{b.l} 상태</span>
        </div>
        <p style={{ fontSize:fs(11.5), fontWeight:600, color:C.text, margin:"4px 0 0", lineHeight:1.45 }}>{statusLine}</p>
      </div>

      {/* 2. Hero: 버튼 먼저 → 설명 나중 */}
      {heroHf && (
        <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05`, textAlign:"center", padding:"20px 16px" }}>
          {wasExecuted(heroRef) && <div style={{ marginBottom:10 }}><Badge text="✓ 오늘 실행 완료" color={C.green} /></div>}
          <Btn primary onClick={() => onTimer && onTimer(heroRef)} style={{ width:"100%", maxWidth:300, padding:"16px 0", fontSize:fs(15), marginBottom:14 }}>{heroCta}</Btn>
          <div style={{ fontSize:fs(16), fontWeight:800, color:C.teal, lineHeight:1.2, marginBottom:4 }}>{heroHf.label}</div>
          <p style={{ fontSize:fs(11.5), color:C.dim, lineHeight:1.5, maxWidth:280, margin:"0 auto" }}>{heroEffect}</p>
          <p style={{ fontSize:fs(9.5), color:C.muted, marginTop:10, maxWidth:260, margin:"10px auto 0", lineHeight:1.45, textAlign:"center" }}>문제를 끝내는 버튼이 아니라, 지금 상태를 식히는 작은 조정입니다.</p>
        </Card>
      )}

      {/* 3. 다른 리셋 보기 (전부 접기) */}
      <Accordion title="다른 리셋 보기" defaultOpen={false}>
        {/* 3a. 나머지 실행형 패치 */}
        {restFx.length > 0 && restFx.map(f => (
          <div key={f.ref} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, border:`1px solid ${C.accent}20`, background:`${C.accent}04`, marginBottom:6 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <span style={{ fontSize:fs(12), fontWeight:700, color:C.accent }}>{f.label}</span>
              {wasExecuted(f.ref) && <Badge text="✓" color={C.green} />}
              <p style={{ fontSize:fs(10.5), color:C.dim, margin:"2px 0 0", lineHeight:1.4 }}>{f.desc}</p>
            </div>
            <button onClick={() => onTimer && onTimer(f.ref)} style={{ flexShrink:0, padding:"6px 10px", borderRadius:8, border:`1px solid ${C.accent}33`, background:`${C.accent}10`, color:C.accent, fontSize:fs(10), fontWeight:700, fontFamily:FF, cursor:"pointer" }}>{f.cta}</button>
          </div>
        ))}

        {/* 3b. 유형별 대안 */}
        {(() => {
          const RESET_TYPES = [
            { ref:"leak-note",     icon:"✏️", type:"기록형",     color:C.blue,   qMatch:["Q3","Q4","Q5"] },
            { ref:"micro-move",    icon:"🏃", type:"움직임형",   color:C.green,  qMatch:["Q5"] },
            { ref:"env-reset",     icon:"🔇", type:"환경정리형", color:C.teal,   qMatch:["Q2","Q1"] },
            { ref:"focus-anchor",  icon:"🎯", type:"집중형",     color:C.amber,  qMatch:["Q1","Q7"] },
            { ref:"compare-block", icon:"🚫", type:"차단형",     color:C.purple, qMatch:["Q6"] },
            { ref:"body-scan",     icon:"🧘", type:"신체감각형", color:C.green,  qMatch:["Q3","Q5"] },
            { ref:"boundary-line", icon:"🛡️", type:"경계형",     color:C.blue,   qMatch:["Q2","Q4"] },
          ];
          const pq = result?.pq, sq = result?.sq;
          const featuredRefs = new Set([...execFx.map(f => f.ref), ...pendFx.map(f => f.ref), heroRef]);
          let diverseResets = RESET_TYPES
            .map(rt => ({ ...rt, hf: HOTFIX_DB.find(h => h.ref === rt.ref) }))
            .filter(rt => rt.hf && !featuredRefs.has(rt.ref) && (rt.qMatch.includes(pq) || rt.qMatch.includes(sq)))
            .slice(0, 3);
          if (diverseResets.length === 0) return null;
          return diverseResets.map(rt => (
            <div key={rt.ref} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, border:`1px solid ${rt.color}20`, background:`${rt.color}04`, marginBottom:6 }}>
              <span style={{ fontSize:fs(18), flexShrink:0 }}>{rt.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:fs(12), fontWeight:700, color:C.text }}>{rt.hf.label}</span>
                  <span style={{ fontSize:fs(8), color:rt.color, fontWeight:600, background:`${rt.color}12`, padding:"1px 5px", borderRadius:6 }}>{rt.type}</span>
                </div>
                <p style={{ fontSize:fs(10.5), color:C.dim, margin:"2px 0 0", lineHeight:1.4 }}>{rt.hf.desc}</p>
              </div>
              <button onClick={() => onTimer && onTimer(rt.ref)} style={{ flexShrink:0, padding:"6px 10px", borderRadius:8, border:`1px solid ${rt.color}33`, background:`${rt.color}10`, color:rt.color, fontSize:fs(10), fontWeight:700, fontFamily:FF, cursor:"pointer" }}>{rt.hf.cta}</button>
            </div>
          ));
        })()}

        {/* 3c. Protocol / Practice */}
        {!hi && proto && (
          <div style={{ padding:"10px 12px", borderRadius:10, border:`1px solid ${C.blue}20`, background:`${C.blue}04`, marginBottom:6 }}>
            <span style={{ fontSize:fs(9), color:C.blue, fontWeight:600 }}>Protocol</span>
            <div style={{ fontSize:fs(12), fontWeight:700, color:C.text, marginTop:2 }}>{proto.label}</div>
            <p style={{ fontSize:fs(10.5), color:C.dim, margin:"2px 0 0", lineHeight:1.4 }}>{proto.desc}</p>
          </div>
        )}
        {!hi && prac && (
          <div style={{ padding:"10px 12px", borderRadius:10, border:`1px solid ${C.teal}20`, background:`${C.teal}04`, marginBottom:6 }}>
            <span style={{ fontSize:fs(9), color:C.teal, fontWeight:600 }}>Practice</span>
            <div style={{ fontSize:fs(12), fontWeight:700, color:C.text, marginTop:2 }}>{prac.label}</div>
            <p style={{ fontSize:fs(10.5), color:C.dim, margin:"2px 0 0", lineHeight:1.4 }}>{prac.desc}</p>
          </div>
        )}
      </Accordion>

      {/* 실행 이력 */}
      {recentActs.length > 0 && (
        <Card style={{ marginTop:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:fs(11), fontWeight:700, color:C.green, letterSpacing:2, textTransform:"uppercase" }}>실행 이력</span>
            <span style={{ fontSize:fs(10), color:C.muted }}>최근 {recentActs.length}건</span>
          </div>
          {recentActs.map((a,i) => (
            <div key={a.id||i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop:i>0?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:3, background:a.status==="cancelled"?C.amber:a.status==="unknown"?C.muted:C.green, flexShrink:0 }} />
                <span style={{ fontSize:fs(12), color:C.text }}>{a.label}</span>
                {a.status==="cancelled" && <span style={{ fontSize:fs(9), color:C.amber }}>중단</span>}
                {a.status==="unknown" && <span style={{ fontSize:fs(9), color:C.muted }}>기록 불완전</span>}
              </div>
              <span style={{ fontSize:fs(11), color:C.muted }}>{fmtTime(a.completedAt || a.cancelledAt || a.startedAt)}</span>
            </div>
          ))}
        </Card>
      )}

      <div style={{ marginTop:18 }}>
        <a href={NL.patch} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
          <Card style={{ textAlign:"center", cursor:"pointer" }}><span style={{ fontSize:fs(13), color:C.dim }}>다른 패치도 보기 →</span></Card>
        </a>
      </div>
      <div style={{ textAlign:"center", padding:"16px 0 0", fontSize:fs(9), color:C.muted }}>by HaruTech Lab · Emotional Engineering Institute</div>
    </div>
  );
}

// ═══ M7-e: LIBRARY TAB ═══════════════════════════════════════════
// Library Tab

function LibTab() {
  const [detailBugId, setDetailBugId] = useState(null);
  const cc = { "핵심 프레임":C.accent, "운영 구조":C.blue, "OS 영역":C.teal, "심화 주제":C.purple, "실전 도구":C.amber };
  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <SectionBrandHeader title="Library" subtitle="버그, 패치, 운영 구조를 탐색하는 지식 레이어" />

      {/* 처음이신가요? 진입 안내 */}
      <a href="https://www.notion.so/v1-3-31f604b060a480a88245fb446ea1bb1a" target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
        <div style={{ padding:"14px 16px", borderRadius:12, background:`${C.teal}06`, border:`1px solid ${C.teal}20`, marginBottom:18, cursor:"pointer" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:fs(12), fontWeight:700, color:C.teal, marginBottom:3 }}>처음이신가요?</div>
              <div style={{ fontSize:fs(11), color:C.dim, lineHeight:1.45 }}>감정공학이란 무엇인지, 이 앱이 어떤 원리로 작동하는지 먼저 읽어보세요.</div>
            </div>
            <span style={{ fontSize:fs(16), color:C.teal, flexShrink:0, marginLeft:12 }}>→</span>
          </div>
        </div>
      </a>

      {/* 대표 버그 카드 섹션 */}
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:fs(11), fontWeight:700, color:C.accent, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>대표 버그 10종</div>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {Object.entries(BUG_ALIAS).map(([bugId, meta]) => (
            <div key={bugId} onClick={() => setDetailBugId(bugId)} style={{ padding:"12px 14px", borderRadius:12, border:`1px solid ${C.border}`, background:C.card, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ fontSize:fs(14), fontWeight:800, color:C.text, lineHeight:1.25 }}>{meta.userName}</div>
                <span style={{ fontSize:fs(9), color:C.muted, flexShrink:0, marginLeft:8 }}>{bugId.split("-").slice(0,2).join("-")}</span>
              </div>
              <div style={{ fontSize:fs(11), color:C.dim, lineHeight:1.5 }}>{meta.oneLiner}</div>
            </div>
          ))}
        </div>
      </div>

      {LCATS.map(cat => {
        const items = LIB.filter(i => i.cat === cat);
        if (!items.length) return null;
        return (
          <div key={cat} style={{ marginBottom:22 }}>
            <div style={{ fontSize:fs(11), fontWeight:700, color:cc[cat]||C.dim, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{cat}</div>
            {items.map(item => (
              <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
                <Card style={{ cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:fs(14), fontWeight:700, color:C.text, marginBottom:3 }}>{item.title}</div>
                      <p style={{ fontSize:fs(12), color:C.dim, margin:0 }}>{item.desc}</p>
                      {item.tip && (() => {
                        const parts = item.tip.split("추천 패치:");
                        return (<>
                          <p style={{ fontSize:fs(10), color:C.muted, margin:0, marginTop:6, padding:"4px 8px", background:C.cardH, borderRadius:6, lineHeight:1.5 }}>{parts[0].trim()}</p>
                          {parts[1] && <p style={{ fontSize:fs(10), color:C.teal, margin:0, marginTop:4, padding:"3px 8px", fontWeight:600 }}>추천 패치: {parts[1].trim()}</p>}
                        </>);
                      })()}
                    </div>
                    <span style={{ fontSize:fs(10), color:C.muted, marginLeft:8, whiteSpace:"nowrap", marginTop:4 }}>자세히 보기 →</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        );
      })}
      <div style={{ textAlign:"center", padding:"16px 0 0", fontSize:fs(9), color:C.muted }}>by HaruTech Lab · Emotional Engineering Institute</div>
      <BugDetailModal bugId={detailBugId} onClose={() => setDetailBugId(null)} />
    </div>
  );
}

// ═══ M7-f: RESULT ════════════════════════════════════════════════
// Result Screen — 체감 요약 중심 배치 (v4.3)

// ─── 체감 배지 (다크 테마) ───
function MetricBadge({ label, tone }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:999, fontSize:fs(11), fontWeight:700, color:tone.fg, background:tone.bg, border:`1px solid ${tone.border}`, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:tone.fg, display:"inline-block" }} />
      {label}
    </span>
  );
}

// ─── 체감 요약 카드 ───
function LiveSummaryCard({ result }) {
  const metrics = deriveLiveMetrics(result);
  const headline = deriveSummaryHeadline(result, metrics);
  const actionCopy = deriveActionMicrocopy(result);
  const recoveryPrefix = (result.delta != null && result.delta > 0) ? "회복이 시작되었습니다. " : "";
  return (
    <Card>
      <div style={{ fontSize:fs(11), fontWeight:700, color:C.muted, marginBottom:8 }}>오늘의 체감 요약</div>
      <div style={{ fontSize:fs(16), fontWeight:800, lineHeight:1.5, color:C.text, marginBottom:10 }}>{recoveryPrefix && <span style={{ color:C.green }}>{recoveryPrefix}</span>}{headline}</div>
      <div style={{ fontSize:fs(12), lineHeight:1.7, color:C.dim }}>{actionCopy}</div>
    </Card>
  );
}

// ─── 체감 척도 3종 카드 ───
function LiveMetricsCard({ result }) {
  const m = deriveLiveMetrics(result);
  const rows = [
    { title:"삶의 피로도", desc:"오늘 하루가 얼마나 버겁게 느껴지는가", label:m.fatigueLabel, tone:toneByIndex(m.fatigueIdx) },
    { title:"몰입 생산성", desc:"해야 할 일을 붙잡고 밀고 갈 수 있는가", label:m.productivityLabel, tone:toneByIndex(m.productivityIdx) },
    { title:"감정 마찰도", desc:"예민함과 충돌 가능성이 얼마나 올라와 있는가", label:m.frictionLabel, tone:toneByIndex(m.frictionIdx) },
  ];
  return (
    <Card>
      <div style={{ fontSize:fs(13), fontWeight:800, color:C.text, marginBottom:14 }}>오늘의 체감 상태</div>
      <div style={{ display:"grid", gap:14 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
            <div style={{ minWidth:160, flex:"1 1 180px" }}>
              <div style={{ fontSize:fs(12), fontWeight:700, color:C.text }}>{r.title}</div>
              <div style={{ fontSize:fs(10), color:C.muted, marginTop:3 }}>{r.desc}</div>
            </div>
            <div style={{ marginLeft:"auto", marginTop:2, flexShrink:0 }}>
              <MetricBadge label={r.label} tone={r.tone} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── 메인 Result ───
function Result({ result, onDone, isRc, onCp }) {
  const b = BAND[result.band];
  const hi = result.band === "low" || result.band === "overload";
  const [showFirstNotice, setShowFirstNotice] = useState(() => {
    try { if (localStorage.getItem("stato-first-scan-noticed")) return false; return true; } catch(e) { return false; }
  });
  useEffect(() => {
    if (showFirstNotice && !isRc) { try { localStorage.setItem("stato-first-scan-noticed", "1"); } catch(e) {} const t = setTimeout(() => setShowFirstNotice(false), 4000); return () => clearTimeout(t); }
  }, []);
  return (
    <div style={{ padding:"28px 16px 100px", maxWidth:500, margin:"0 auto" }}>
      {showFirstNotice && !isRc && (
        <div style={{ padding:"10px 14px", borderRadius:10, background:`${C.teal}08`, border:`1px solid ${C.teal}20`, marginBottom:14, textAlign:"center" }}>
          <p style={{ fontSize:fs(11), color:C.teal, fontWeight:700, margin:0 }}>운영 기록이 저장되기 시작했습니다</p>
          <p style={{ fontSize:fs(9.5), color:C.muted, margin:"4px 0 0" }}>이 기록은 현재 기기에 저장됩니다</p>
        </div>
      )}
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <div style={{ fontSize:fs(15.5), letterSpacing:1.4, color:C.accent, textTransform:"uppercase", fontWeight:800, lineHeight:1.0 }}>Stato</div>
        <div style={{ fontSize:fs(7.4), letterSpacing:0.78, color:C.dim, textTransform:"uppercase", marginTop:2, lineHeight:1.15, opacity:0.88, fontWeight:700 }}>Powered by Emotion OS</div>
        <h1 style={{ fontSize:fs(20), fontWeight:800, color:C.text, marginTop:6 }}>{isRc ? "가동률 재점검 리포트" : "운영 상태 리포트"}</h1>
        <p style={{ fontSize:fs(11), color:C.muted, marginTop:6 }}>{isRc ? "직전 스캔 기준 · 가동률 변화 확인" : "최근 2주 반복 패턴 기준 · 지금 어디서 에너지가 새는지를 보여줍니다"}</p>
        {isRc && result.delta != null && <div style={{ marginTop:10 }}><DBadge delta={result.delta} big /><p style={{ fontSize:fs(10), color:C.muted, marginTop:4 }}>{result.baselineType === "recheck" ? "직전 재점검 대비" : "풀 스캔 대비"}</p></div>}
        {isRc && result.reranked && <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${C.amber}08`, border:`1px solid ${C.amber}25` }}><span style={{ fontSize:fs(11), fontWeight:700, color:C.amber }}>패턴 전환 감지</span><p style={{ fontSize:fs(10), color:C.dim, margin:"4px 0 0", lineHeight:1.5 }}>재점검 결과, 주 패턴이 {QL[result.pq]}으로 전환되었습니다. 가동률 변화와 함께 확인해보세요.</p></div>}
      </div>

      {/* ── TIER 1: 기본 노출 (4개) ── */}

      {/* 1. 체감 요약 */}
      <LiveSummaryCard result={result} />

      {/* 2. 가동률 */}
      <Card accent={`${b.c}30`} style={{ background:b.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:fs(12), color:C.dim }}>현재 가동률</span>
          <Badge text={b.l} color={b.c} />
        </div>
        <ANum value={result.avail} color={b.c} size={26} suffix="%" />
        <MiniBar pct={result.avail} color={b.c} h={6} />
        <div style={{ marginTop:6, fontSize:fs(11), fontWeight:700, color:b.c }}>{result.avail >= 70 ? "정상 범위" : result.avail >= 40 ? "정비 필요" : "즉시 회복 필요"}</div>
        <p style={{ fontSize:fs(11), color:C.dim, marginTop:6, lineHeight:1.5 }}>{b.d}</p>
        {result.spread && <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${C.amber}06`, border:`1px solid ${C.amber}20` }}><span style={{ fontSize:fs(11), fontWeight:600, color:C.amber }}>복수 영역 동시 부하 감지</span></div>}
      </Card>

      {/* 3. 핵심 패턴 1줄 */}
      <Card>
        <div style={{ fontSize:fs(12), color:C.muted, marginBottom:6 }}>핵심 패턴</div>
        <p style={{ fontSize:fs(14), color:C.text, lineHeight:1.6 }}>현재 <a href={QLinks[result.pq]||NL.q} target="_blank" rel="noopener noreferrer" style={{ color:C.accent, fontWeight:700, textDecoration:"none" }}>{QL[result.pq]}</a> 누수가 가장 강하게 활성화되어 있습니다.</p>
        <p style={{ fontSize:fs(11), color:C.muted, marginTop:4 }}>보조: <a href={QLinks[result.sq]||NL.q} target="_blank" rel="noopener noreferrer" style={{ color:C.blue, textDecoration:"none" }}>{QL[result.sq]}</a></p>
      </Card>

      {/* 4. 지금 가장 먼저 할 것 */}
      {(() => {
        const topFx = getHotFixes(result)[0];
        if (!topFx || !isExecutableHotFix(topFx.ref)) return null;
        return (
          <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05` }}>
            <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>지금 가장 먼저 할 것</div>
            <div style={{ fontSize:fs(15), fontWeight:700, color:C.teal, marginBottom:4 }}>{topFx.label}</div>
            <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>큰 해결보다 지금 상태를 먼저 조정합니다.</p>
            <div style={{ marginTop:10 }}><Btn primary small onClick={onDone} style={{ maxWidth:240 }}>Today에서 실행하기</Btn></div>
          </Card>
        );
      })()}

      {/* ── TIER 2: 왜 이런 결과가 나왔는지 보기 ── */}
      <Accordion title="왜 이런 결과가 나왔는지 보기" defaultOpen={false}>
        {/* 체감 척도 3종 */}
        <LiveMetricsCard result={result} />

        {/* 추천 운영 모드 */}
        <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05` }}>
          <div style={{ fontSize:fs(12), color:C.muted, marginBottom:6 }}>추천 운영 모드</div>
          <div style={{ fontSize:fs(16), fontWeight:800, color:C.teal, marginBottom:6 }}>{result.mode || "운영 모드"}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.55 }}>{result.modeD || ""}</p>
          <div style={{ marginTop:8, padding:"6px 10px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}` }}>
            <p style={{ fontSize:fs(10), color:C.muted, lineHeight:1.5, margin:0 }}>성격을 바꾸라는 뜻이 아닙니다. 지금 상태에서 가동률을 덜 잃는 임시 운영 자세입니다.</p>
          </div>
        </Card>

        {/* Bug / Patch */}
        {(() => { const bm = getBugAlias(result.bug, result.bugL); return (
        <Card>
          <div style={{ fontSize:fs(12), color:C.muted, marginBottom:4 }}>연결 Bug</div>
          <a href={BLinks[result.bug]||NL.bug} target="_blank" rel="noopener noreferrer" style={{ display:"block", fontSize:fs(15), color:C.text, fontWeight:800, lineHeight:1.35, textDecoration:"none" }}>{bm.userName}</a>
          <div style={{ fontSize:fs(11), color:C.muted, marginTop:3, marginBottom:10 }}>{result.bugL || ""} · {result.bug || ""}</div>
          <a href={BLinks[result.bug]||NL.bug} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}><div style={{ padding:"10px 14px", borderRadius:8, background:C.bg, marginBottom:10, fontSize:fs(12), color:C.text, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span>{bm.oneLiner}</span><span style={{ color:C.muted, fontSize:fs(11), marginLeft:8, flexShrink:0 }}>→</span></div></a>
          <div style={{ fontSize:fs(12), color:C.muted, marginBottom:4 }}>연결 Patch</div>
          <a href={PLinks[result.patch]||NL.patch} target="_blank" rel="noopener noreferrer" style={{ display:"block", fontSize:fs(15), color:C.teal, fontWeight:800, lineHeight:1.35, textDecoration:"none" }}>{result.patchL}</a>
          <div style={{ fontSize:fs(11), color:C.muted, marginTop:3, marginBottom:10 }}>{result.patch}</div>
          <a href={PLinks[result.patch]||NL.patch} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}><div style={{ padding:"10px 14px", borderRadius:8, background:C.bg, fontSize:fs(12), color:C.teal, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span>패치 카드 보기</span><span style={{ color:C.muted, fontSize:fs(11) }}>→</span></div></a>
        </Card>
        ); })()}

      </Accordion>

      {/* ── TIER 3: 상세 분석 보기 ── */}
      <Accordion title="상세 분석 보기" defaultOpen={false}>
        {/* Q유형 점수 분포 */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:fs(11), fontWeight:700, color:C.muted, marginBottom:8 }}>Q유형 점수 분포</div>
          {Object.entries(result.nm || {}).sort((a,b) => b[1]-a[1]).map(([k,v]) => (
            <div key={k} style={{ marginBottom:6 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:fs(11), color:k===result.pq?C.accent:C.dim, marginBottom:2 }}><span>{QSH[k]}</span><span>{v}%</span></div>
              <MiniBar pct={v} color={k===result.pq?C.accent:k===result.sq?C.blue:C.borderL} h={4} />
            </div>
          ))}
        </div>
        {/* 병목 분석 */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:fs(11), fontWeight:700, color:C.muted, marginBottom:8 }}>병목 분석</div>
          <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap" }}><Badge text={`누수: ${result.leak}`} color={C.accent} /><Badge text={RL[result.r1]} color={C.purple} /></div>
          <R5Radar pr={result.r1} result={result} />
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{LD[result.leak]}</p>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5, marginTop:4 }}>{RD[result.r1]}</p>
        </div>
        {/* 안내 + 참고 링크 */}
        <Card>
          <p style={{ fontSize:fs(11), color:C.muted }}>이 결과는 의료적 진단이 아니라, 반복되는 감정 누수 패턴을 운영 언어로 읽기 위한 안내입니다.</p>
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            <a href={NL.q} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="Q유형 총론" color={C.blue} /></a>
            <a href={NL.r5} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="5R 구조" color={C.purple} /></a>
            {hi && <a href={NL.rec} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="리커버리 프로토콜" color={C.teal} /></a>}
          </div>
        </Card>
      </Accordion>

      {/* ── 하단 ── */}
      <ShareBtn result={result} />
      <div style={{ textAlign:"center", padding:"10px 0" }}>
        <button onClick={onCp} style={{ fontSize:fs(10), color:C.muted, border:`1px solid ${C.border}`, borderRadius:999, padding:"6px 16px", background:"none", cursor:"pointer", fontFamily:FF }}>파트너와 공유하기 (준비 중) →</button>
      </div>

      {/* 모토 (하단 이동) */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"10px 16px", marginBottom:14, borderRadius:10, border:`1px solid ${C.accent}22`, background:`${C.accent}06` }}>
        <span style={{ fontSize:fs(11), color:C.accent, fontWeight:700, letterSpacing:0.3, textAlign:"center", lineHeight:1.55 }}>
          감정 누수를 10%만 줄여도, 하루의 질은 달라집니다.
        </span>
      </div>

      <Card style={{ textAlign:"center", background:C.cardH, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:fs(11), fontWeight:700, color:C.text, marginBottom:4 }}>Stato</div>
        <div style={{ fontSize:fs(9), color:C.dim, marginBottom:4 }}>Powered by Emotion OS</div>
        <div style={{ fontSize:fs(10), color:C.dim, lineHeight:1.6 }}>HaruTech Lab<br />Emotional Engineering Institute</div>
      </Card>

      {isRc && <Card style={{ background:`${C.teal}05`, border:`1px solid ${C.teal}15` }}><p style={{ fontSize:fs(11), color:C.dim, lineHeight:1.7, margin:0 }}>재점검은 핵심 패턴을 다시 분류하지 않습니다. 최근 Full Scan을 기준축으로 유지한 채, 현재 가동률 변화만 다시 확인합니다.</p></Card>}

      <Btn primary onClick={onDone}>Today로 돌아가기</Btn>
    </div>
  );
}

// ═══ M7-g: LOADING ═══════════════════════════════════════════════
// Loading Screen

function Loading({ msg }) {
  const [d, setD] = useState("");
  useEffect(() => { const iv = setInterval(() => setD(x => x.length >= 3 ? "" : x + "."), 500); return () => clearInterval(iv); }, []);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:40 }}>
      <div style={{ width:40, height:40, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.accent}`, borderRadius:"50%", animation:"esSpin 1s linear infinite", marginBottom:20 }} />
      <p style={{ fontSize:fs(14), color:C.text }}>{msg}{d}</p>
      <p style={{ fontSize:fs(11), color:C.muted, marginTop:6 }}>성격 판정이 아닌 운영 상태 요약입니다.</p>
    </div>
  );
}

// ═══ M7-h: COUPLE ════════════════════════════════════════════════
// Couple Screen (Beta/Preview)

function Couple({ onBack }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center" }}>
      <div style={{ fontSize:fs(10), letterSpacing:4, color:C.blue, textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>Couple Sync <span style={{ color:C.amber }}>(Beta)</span></div>
      <h2 style={{ fontSize:fs(20), fontWeight:700, color:C.text, marginBottom:16 }}>파트너 연결 미리보기</h2>

      <Card accent={`${C.blue}30`} style={{ background:`${C.blue}06`, maxWidth:340, width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.text }}>Couple Sync <span style={{ fontSize:fs(11), color:C.amber, fontWeight:600 }}>(Beta)</span></div>
          <Badge text="Preview" color={C.amber} />
        </div>
        <p style={{ fontSize:fs(13), color:C.dim, lineHeight:1.65, marginBottom:10 }}>현재는 관계 연결 흐름을 소개하는 미리보기 화면입니다. 실시간 코드 매칭, 파트너 인증, 결과 병합 분석은 백엔드 엔진 탑재 후 제공됩니다.</p>
        <div style={{ padding:"12px 14px", borderRadius:12, background:C.cardH, border:`1px dashed ${C.borderL}` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>예시 연결 코드</div>
          <div style={{ fontSize:fs(20), fontWeight:800, color:C.blue, letterSpacing:3 }}>A7K2P1</div>
          <p style={{ fontSize:fs(11), color:C.muted, marginTop:8, lineHeight:1.5 }}>실제 매칭 기능은 아직 비활성 상태입니다. 현재는 향후 연결 UX를 미리 보는 단계입니다.</p>
        </div>
      </Card>

      <Card style={{ maxWidth:300, width:"100%", marginTop:4 }}>
        <div style={{ fontSize:fs(13), fontWeight:600, color:C.text, marginBottom:6 }}>향후 구현 예시</div>
        <div style={{ fontSize:fs(12), color:C.dim, lineHeight:1.7 }}>
          1. 두 사람 모두 개인 Full Scan 완료<br/>
          2. 코드 기반 매칭 시스템 (구현 예정)<br/>
          3. 병합 리포트 자동 생성 (구현 예정)<br/>
          4. 관계 패턴 요약 제공 (구현 예정)
        </div>
        <p style={{ fontSize:fs(10), color:C.muted, marginTop:8 }}>위 흐름은 개발 예정 기능이며, 현재는 동작하지 않습니다.</p>
      </Card>

      <div style={{ display:"flex", gap:8, marginTop:12, maxWidth:300, width:"100%" }}>
        <Btn small disabled style={{ flex:1 }}>연결 방식 미리보기</Btn>
        <Btn small disabled style={{ flex:1 }}>병합 분석 예고</Btn>
      </div>
      <div style={{ marginTop:12, padding:"10px 16px", borderRadius:10, background:C.cardH, border:`1px solid ${C.border}`, maxWidth:300, width:"100%" }}>
        <p style={{ fontSize:fs(11), color:C.dim, margin:0, textAlign:"center", lineHeight:1.5 }}>Couple Sync 정식 버전은 현재 <strong style={{ color:C.blue }}>출시 준비 중</strong>입니다.</p>
      </div>
      <p style={{ fontSize:fs(11), color:C.muted, marginTop:16, maxWidth:300, lineHeight:1.5 }}>상대의 상세 점수는 직접 노출되지 않으며, 관계 상태 요약만 제공됩니다.</p>
      <div style={{ marginTop:16, maxWidth:300, width:"100%" }}><Btn small onClick={onBack}>돌아가기</Btn></div>
    </div>
  );
}

// ═══ M7-i: TIMER ═════════════════════════════════════════════════
// Timer Screen

function TimerScreen({ timer, onComplete, onCancel }) {
  const safeLabel = timer?.label || "패치 실행";
  const safeGuideText = typeof timer?.guideText === "string" && timer.guideText.length > 0 ? timer.guideText : "1. 눈을 감으세요\n2. 코로 4초 들이마십니다\n3. 입으로 6초 내쉽니다";
  const safeDuration = Number.isFinite(timer?.durationSec) && timer.durationSec > 0 ? timer.durationSec : 60;
  const [remaining, setRemaining] = useState(safeDuration);
  const [done, setDone] = useState(false);
  const endAt = useRef((timer?.startedAt || Date.now()) + safeDuration * 1000);

  useEffect(() => {
    const iv = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) { setDone(true); clearInterval(iv); }
    }, 250);
    return () => clearInterval(iv);
  }, []);

  const mm = String(Math.floor(remaining/60)).padStart(2, "0");
  const ss = String(remaining%60).padStart(2, "0");
  const pct = safeDuration > 0 ? ((safeDuration - remaining) / safeDuration) * 100 : 0;
  const circR = 80, circC = 2 * Math.PI * circR;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center" }}>
      <div style={{ fontSize:fs(15.5), letterSpacing:1.4, color:C.accent, textTransform:"uppercase", fontWeight:800, marginBottom:24, lineHeight:1.0 }}>Stato</div>
      <h2 style={{ fontSize:fs(22), fontWeight:800, color:C.text, marginBottom:8 }}>{safeLabel}</h2>
      <p style={{ fontSize:fs(13), color:C.dim, marginBottom:32, lineHeight:1.6, maxWidth:300 }}>
        {safeGuideText.split("\n").map((line, i, arr) => (
          <React.Fragment key={i}>{line}{i < arr.length - 1 && <br/>}</React.Fragment>
        ))}
      </p>
      <div style={{ position:"relative", width:200, height:200, marginBottom:32 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="100" cy="100" r={circR} fill="none" stroke={C.border} strokeWidth="4" />
          <circle cx="100" cy="100" r={circR} fill="none" stroke={done?C.green:C.accent} strokeWidth="4" strokeLinecap="round" strokeDasharray={circC} strokeDashoffset={circC * (1 - pct/100)} style={{ transition:"stroke-dashoffset 0.3s ease, stroke 0.3s" }} />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:fs(42), fontWeight:800, color:done?C.green:C.text, fontFamily:FF }}>{mm}:{ss}</span>
          {!done && <span style={{ fontSize:fs(11), color:C.muted, marginTop:4 }}>남은 시간</span>}
          {done && <span style={{ fontSize:fs(12), color:C.green, marginTop:4, fontWeight:600 }}>완료!</span>}
        </div>
      </div>
      {!done && <Btn small onClick={onCancel} style={{ maxWidth:200, marginBottom:8 }}>중단하기</Btn>}
      {done && (
        <>
          <p style={{ fontSize:fs(13), color:C.green, marginBottom:12, lineHeight:1.7, maxWidth:280, textAlign:"center", fontStyle:"italic" }}>
            과열이 낮아졌습니다.<br />지금 가벼운 일 하나를 처리하기 좋은 상태입니다.
          </p>
          <p style={{ fontSize:fs(10), color:C.muted, marginBottom:18, lineHeight:1.5, maxWidth:260, textAlign:"center" }}>
            처음엔 작게 느껴집니다. 3일 반복하면 차이가 보이기 시작합니다.
          </p>
          <Btn primary onClick={onComplete} style={{ maxWidth:260 }}>완료 · 돌아가기</Btn>
        </>
      )}
    </div>
  );
}

// ═══ M7-j: REDUCER + CONTEXT ═════════════════════════════════════
// App 전역 상태를 useReducer로 통합, Context로 하위 컴포넌트에 전달
// ── Fix 1: 'fs' → 'fullScan' (유틸 함수 fs() 섀도잉 해소)
// ── Fix 2: 9개 useState → 단일 useReducer + AppContext

const MAX_HIST = 20; // 이력 최대 보관 수 (상수화)
const MAX_ALOG = 30; // 실행 로그 최대 보관 수

/** @type {AppState} */
const INIT_APP = {
  tab:          "home",
  scr:          "tabs",
  fullScan:     null,   // ← 기존 fs (섀도잉 해소)
  lastResult:   null,   // ← 기존 lr
  rcQs:         [],
  hist:         [],
  activeTimer:  null,
  actionLog:    [],
  confirmOpen:  false,
};

/**
 * 앱 리듀서 — 모든 상태 전환을 한 곳에서 관리
 * @param {AppState} s
 * @param {Object} a - action
 */
function appReducer(s, a) {
  switch (a.type) {
    // ── 네비게이션 ──
    case "SET_TAB":    return { ...s, tab: a.tab };
    case "SET_SCR":    return { ...s, scr: a.scr };
    case "NAV_HOME":   return { ...s, scr: "tabs", tab: "home" };

    // ── 진단 데이터 ──
    case "LOAD_SAVED":
      return { ...s, fullScan: a.fullScan, lastResult: a.lastResult, hist: a.hist || [] };

    case "SCAN_DONE": {
      const h = [...s.hist.slice(-(MAX_HIST - 1)), a.entry];
      return { ...s, fullScan: a.result, lastResult: a.result, hist: h, scr: "res" };
    }
    case "RECHECK_DONE": {
      const h = [...s.hist.slice(-(MAX_HIST - 1)), a.entry];
      return { ...s, lastResult: a.result, hist: h, scr: "rcRes" };
    }
    case "SET_RC_QS":  return { ...s, rcQs: a.rcQs };

    // ── 타이머 ──
    case "OPEN_TIMER":  return { ...s, activeTimer: a.timer, scr: "timer" };
    case "CLOSE_TIMER": return { ...s, activeTimer: null, scr: "tabs" };

    // ── 실행 로그 ──
    case "LOG_ACTION": {
      const next = [a.entry, ...s.actionLog].slice(0, MAX_ALOG);
      return { ...s, actionLog: next };
    }

    // ── UI ──
    case "SET_CONFIRM": return { ...s, confirmOpen: a.open };

    // ── 초기화 ──
    case "FULL_RESET":
      return { ...INIT_APP, actionLog: [] };

    default: return s;
  }
}

/** Context — state + dispatch + derived + handlers */
const AppContext = createContext(null);

/** @returns {{ state, dispatch, hs, cr, onScan, onRc, onCp, onTimer, onGoReset, onClear }} */
function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppContext.Provider>");
  return ctx;
}

// ═══ M8: APP ═════════════════════════════════════════════════════
// M8: APP — 메인 앱 (useReducer + Context)
// Stato v4.9.2 — Powered by Emotion OS

function EmotionOSApp() {
  const [state, dispatch] = useReducer(appReducer, {
    ...INIT_APP,
    actionLog: loadActionLog(),
  });

  const { tab, scr, fullScan, lastResult, rcQs, hist, activeTimer, actionLog, confirmOpen } = state;

  // ── Global keyframes (1회 주입) ──
  useEffect(() => {
    const styleId = "emotion-os-global-keyframes";
    if (!document.getElementById(styleId)) {
      const el = document.createElement("style");
      el.id = styleId;
      el.textContent = `
        @keyframes esSpin { to { transform: rotate(360deg); } }
        @keyframes dF { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes esSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes esFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes esPulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `;
      document.head.appendChild(el);
    }
  }, []);

  // ── 폰트 로드 (standalone fallback) ──
  useEffect(() => {
    if (!document.querySelector('link[href*="pretendard"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONT_CDN;
      document.head.appendChild(l);
    }
  }, []);

  // ── 브라우저 뒤로가기 방어 (pushState only — hash 미사용) ──
  const scrRef = useRef(scr);
  const tabRef = useRef(tab);
  scrRef.current = scr;
  tabRef.current = tab;
  useEffect(() => {
    const url = window.location.pathname + window.location.search;
    window.history.replaceState({p:0}, "", url);
    window.history.pushState({p:1}, "", url);
    window.history.pushState({p:2}, "", url);
    window.history.pushState({p:3}, "", url);
    const handlePop = () => {
      if (scrRef.current !== "tabs" || tabRef.current !== "home") {
        dispatch({ type:"NAV_HOME" });
      }
      window.history.pushState({p:Date.now()}, "", url);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // ── localStorage → reducer 복원 ──
  useEffect(() => {
    const d = loadState();
    if (d) dispatch({ type:"LOAD_SAVED", fullScan:d.fs, lastResult:d.lr, hist:d.hist || [] });
  }, []);

  // ── reducer → localStorage 동기화 ──
  useEffect(() => {
    if (fullScan || lastResult) saveState(fullScan, lastResult, hist);
  }, [fullScan, lastResult, hist]);

  // ── derived ──
  const hs = deriveHS(fullScan, lastResult);
  const cr = lastResult || fullScan;

  // ── handlers (useCallback으로 안정 참조) ──
  const onScan = useCallback(() => dispatch({ type:"SET_SCR", scr:"scan" }), []);

  const onRc = useCallback(() => {
    const b = lastResult || fullScan;
    if (!b) return;
    dispatch({ type:"SET_RC_QS", rcQs:getRecheckQs(b) });
    dispatch({ type:"SET_SCR", scr:"rc" });
  }, [lastResult, fullScan]);

  const onCp = useCallback(() => dispatch({ type:"SET_SCR", scr:"cp" }), []);
  const onGoReset = useCallback(() => dispatch({ type:"SET_TAB", tab:"action" }), []);
  const onClear = useCallback(() => dispatch({ type:"SET_CONFIRM", open:true }), []);

  const onTimer = useCallback((ref) => {
    const hf = HOTFIX_DB.find(h => h.ref === ref);
    if (!hf || !hf.exec) { console.error("Stato: unknown or non-exec hotfix ref:", ref); return; }
    // 입구 정규화: TimerScreen 전에 safe 값 보장
    const label = (typeof hf.label === "string" && hf.label) ? hf.label : "패치 실행";
    const durationSec = (Number.isFinite(hf.durationSec) && hf.durationSec > 0) ? hf.durationSec : 60;
    const guideText = (typeof hf.guideText === "string" && hf.guideText.length > 0) ? hf.guideText : "1. 눈을 감으세요\n2. 코로 4초 들이마십니다\n3. 입으로 6초 내쉽니다";
    dispatch({ type:"OPEN_TIMER", timer:{
      ref, label, durationSec, guideText,
      startedAt:Date.now(), availAtStart:cr?.avail ?? null, resultType:cr?.type ?? null,
    }});
  }, [cr]);

  const completeTimer = useCallback(() => {
    if (!activeTimer) return;
    const entry = {
      id:`act_${Date.now()}`, ref:activeTimer.ref, label:activeTimer.label,
      startedAt:activeTimer.startedAt, completedAt:Date.now(),
      durationSec:activeTimer.durationSec, resultType:activeTimer.resultType,
      availAtStart:activeTimer.availAtStart, status:"completed",
    };
    dispatch({ type:"LOG_ACTION", entry });
    saveActionLog([entry, ...actionLog].slice(0, MAX_ALOG));
    // D3-alpha: 개인화 데이터 수집
    const ps = updatePatchStat(loadPersonalState(), activeTimer.ref, true);
    savePersonalState(ps);
    dispatch({ type:"CLOSE_TIMER" });
  }, [activeTimer, actionLog]);

  const cancelTimer = useCallback(() => {
    if (activeTimer) {
      const entry = {
        id:`act_${Date.now()}`, ref:activeTimer.ref, label:activeTimer.label,
        startedAt:activeTimer.startedAt, cancelledAt:Date.now(),
        durationSec:activeTimer.durationSec, resultType:activeTimer.resultType,
        availAtStart:activeTimer.availAtStart, status:"cancelled",
      };
      dispatch({ type:"LOG_ACTION", entry });
      saveActionLog([entry, ...actionLog].slice(0, MAX_ALOG));
      // D3-alpha: skip 기록
      const ps = updatePatchStat(loadPersonalState(), activeTimer.ref, false);
      savePersonalState(ps);
    }
    dispatch({ type:"CLOSE_TIMER" });
  }, [activeTimer, actionLog]);

  const executeClear = useCallback(() => {
    clearState(); clearActionLog();
    dispatch({ type:"FULL_RESET" });
  }, []);

  // ── Context value (useMemo로 안정화 — 의존값이 바뀔 때만 재생성) ──
  const ctxValue = useMemo(() => ({
    state, dispatch,
    hs, cr, hist, actionLog,
    onScan, onRc, onCp, onTimer, onGoReset, onClear,
  }), [state, hs, cr, hist, actionLog, onScan, onRc, onCp, onTimer, onGoReset, onClear]);

  return (
    <AppContext.Provider value={ctxValue}>
    <div style={{ fontFamily:FF, background:C.bg, color:C.text, minHeight:"100vh", WebkitFontSmoothing:"antialiased" }}>

      {scr === "tabs" && <>
        {tab === "home" && <Home />}
        {tab === "scan" && <ScanTab />}
        {tab === "action" && <ActionTab />}
        {tab === "library" && <LibTab />}
        <BNav tab={tab} setTab={t => dispatch({ type:"SET_TAB", tab:t })} />
      </>}

      {scr === "scan" && <ScanFlow onComplete={a => {
        dispatch({ type:"SET_SCR", scr:"ld" });
        setTimeout(() => {
          const r = calcFull(a);
          const entry = { avail:r.avail, band:r.band, pq:r.pq, type:r.type, ts:r.ts };
          dispatch({ type:"SCAN_DONE", result:r, entry });
        }, 1800);
      }} />}

      {scr === "rc" && <ScanFlow onComplete={(a,q) => {
        dispatch({ type:"SET_SCR", scr:"ld" });
        const b = lastResult || fullScan;
        setTimeout(() => {
          const r = calcRecheck(a, q, b);
          const entry = { avail:r.avail, band:r.band, pq:r.pq, type:r.type, ts:r.ts };
          dispatch({ type:"RECHECK_DONE", result:r, entry });
          // D3-alpha: 마지막 실행 패치에 avail 변화 연결
          const ps = loadPersonalState();
          if (ps.lastCompletedPatchRef && r.delta !== undefined) {
            savePersonalState(attachPatchEffect(ps, ps.lastCompletedPatchRef, r.delta));
          }
        }, 1500);
      }} isRc rcQs={rcQs} />}

      {scr === "ld" && <Loading msg="시스템 패턴 분석 중" />}
      {scr === "res" && cr && <Result result={cr} onDone={() => dispatch({ type:"NAV_HOME" })} onCp={onCp} />}
      {scr === "rcRes" && cr && <Result result={cr} onDone={() => dispatch({ type:"NAV_HOME" })} isRc onCp={onCp} />}
      {scr === "cp" && <Couple onBack={() => dispatch({ type:"NAV_HOME" })} />}
      {scr === "timer" && activeTimer && <TimerScreen timer={activeTimer} onComplete={completeTimer} onCancel={cancelTimer} />}

      <ConfirmModal
        open={confirmOpen}
        message={"모든 운영 이력과 실행 기록이 영구 삭제됩니다.\n계속하시겠습니까?"}
        onConfirm={executeClear}
        onCancel={() => dispatch({ type:"SET_CONFIRM", open:false })}
      />
    </div>
    </AppContext.Provider>
  );
}

// ─── ErrorBoundary (앱 전체 크래시 방지) ───
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(e) { return { hasError:true, error:e }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ fontFamily:`'Pretendard',-apple-system,sans-serif`, background:"#060a14", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
        <div style={{ fontSize:fs(28), marginBottom:16 }}>⚠️</div>
        <h2 style={{ fontSize:fs(18), fontWeight:700, color:"#e8ecf4", marginBottom:8 }}>시스템 오류가 발생했습니다</h2>
        <p style={{ fontSize:fs(13), color:"#8b95a8", lineHeight:1.6, marginBottom:24, maxWidth:280 }}>저장 데이터에 문제가 있을 수 있습니다.<br/>초기화하면 정상 작동합니다.</p>
        <button onClick={() => { try { ["emotion-os-v4","emotion-os-v3","emotion-os-v2","emotion-os-v1","emotion-os-v4-actionlog","emotion-os-v3-actionlog","emotion-os-actionlog"].forEach(k => localStorage.removeItem(k)); } catch(e) {} window.location.reload(); }} style={{ padding:"12px 28px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#e8654a,#d4523a)", color:"#fff", fontSize:fs(14), fontWeight:700, cursor:"pointer" }}>
          데이터 초기화 후 재시작
        </button>
      </div>
    );
  }
}

export default function EmotionOSAppWithBoundary(props) {
  return (
    <ErrorBoundary>
      <EmotionOSApp {...props} />
    </ErrorBoundary>
  );
}
