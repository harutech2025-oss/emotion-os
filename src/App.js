import React, { useState, useEffect, useRef, memo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   EMOTION OS v4.6.0 — Standalone (Auto-generated)
   Haru-Tech Lab

   ⚠️ 이 파일은 scripts/build-standalone.cjs가 src/에서 자동 생성했습니다.
   수정은 src/ 모듈에서 먼저 하고, 이 스크립트로 재생성하세요.
   생성 시각: 2026-03-23T20:49:33.201Z
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
const FONT_CDN = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css";


// ═══ M1: DATA ════════════════════════════════════════════════════
// M1: DATA — 질문, 라벨, DB, 노션 링크
// 의존성: 없음 (순수 데이터)

// ─── 21문항 (Q1~Q7 × 3) ───
const QS = [
  { id:"I01", p:"최근 2주간, 쉬고 있을 때조차 다음에 해야 할 일이 자동으로 떠올라 머리가 쉬지 못했다.", pq:"Q1", sq:"Q6", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I02", p:"최근 2주간, 빨리 끝내려다 실수하거나 중요한 단계를 건너뛴 적이 있었다.", pq:"Q1", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I03", p:"최근 2주간, 진행이 느려지거나 멈추면 몸이 먼저 긴장되고 불안감이 올라왔다.", pq:"Q1", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCLOCK-01", bugL:"과속 실행 버그", patch:"Slow-Down Patch", patchL:"속도 강제 저하 패치", mode:"슬로모드", modeD:"속도를 낮추고 긴장을 풀어 조절단 과열을 식히는 운영 자세" },
  { id:"I04", p:"최근 2주간, 상대의 사소한 말투나 미세한 표정 변화에 신경이 날카롭게 반응했다.", pq:"Q2", sq:"Q4", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I05", p:"최근 2주간, 사람이 많거나 소음이 큰 공간에 있으면 평소보다 빠르게 에너지가 빠졌다.", pq:"Q2", sq:"Q5", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I06", p:"최근 2주간, 특별히 힘든 일이 없었는데도 하루가 끝나면 감각이 과부하된 느낌이 들었다.", pq:"Q2", sq:"Q3", r1:"R1", leak:"입력단", bug:"MND-INPUTFLOOD-01", bugL:"자극 과부하 버그", patch:"Sensory Reset", patchL:"감각 리셋 루틴", mode:"무심 모드", modeD:"외부 자극과 해석 과부하를 줄여 입력단 부담을 낮추는 운영 자세" },
  { id:"I07", p:"최근 2주간, 마음이 불편한데 그게 정확히 어떤 감정인지 이름을 붙이기 어려운 순간이 많았다.", pq:"Q3", sq:"Q2", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I08", p:"최근 2주간, 속으로는 서운하거나 화가 났지만 겉으로는 아무렇지 않은 듯 넘긴 적이 많았다.", pq:"Q3", sq:"Q7", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I09", p:"최근 2주간, 이미 끝난 일인데도 설명하기 어려운 무거움이 마음에 계속 남아 있었다.", pq:"Q3", sq:"Q5", r1:"R1", leak:"처리단", bug:"MND-EMOSUPPRESS-01", bugL:"감정 억압 버그", patch:"Voice Activation", patchL:"표현 활성화 패치", mode:"감정읽기 모드", modeD:"회피된 감정을 이름 붙여 처리단 정체를 풀어 주는 운영 자세" },
  { id:"I10", p:"최근 2주간, 감정을 누르고 있다가 어느 순간 예상보다 크게 한꺼번에 터져나온 적이 있었다.", pq:"Q4", sq:"Q1", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I11", p:"최근 2주간, 흥분하거나 화가 나면 말이 빨라지고 세져서 끝나고 나서 후회한 적이 있었다.", pq:"Q4", sq:"Q1", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I12", p:"최근 2주간, 감정을 표현하고 나면 해소되기보다 오히려 더 깊은 피로나 수치심이 남았다.", pq:"Q4", sq:"Q6", r1:"R3", leak:"출력단", bug:"MND-OUTPUTHEAT-01", bugL:"출력 과열 버그", patch:"Stop Signal", patchL:"출력 차단 신호 패치", mode:"평정 모드", modeD:"폭발 직전의 출력단을 진정시키고 반응 속도를 늦추는 운영 자세" },
  { id:"I13", p:"최근 2주간, 해야 할 일이 눈앞에 있는데도 몸에 시동이 걸리지 않는 느낌이 반복됐다.", pq:"Q5", sq:"Q3", r1:"R4", leak:"회복단", bug:"BDY-BOOTFAIL-01", bugL:"시동 실패 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I14", p:"최근 2주간, 많이 하지 않았는데도 하루 끝에 바닥까지 방전된 것 같은 피로가 있었다.", pq:"Q5", sq:"Q2", r1:"R4", leak:"회복단", bug:"BDY-LOWPOWERLOCK-01", bugL:"저출력 고착 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I15", p:"최근 2주간, 누워 있는 시간이 길어질수록 오히려 더 움직이기 힘들어지는 악순환이 있었다.", pq:"Q5", sq:"Q6", r1:"R4", leak:"회복단", bug:"BDY-BEDLOCK-01", bugL:"침대 고착 버그", patch:"Baseline Reset", patchL:"기준선 복구 패치", mode:"무빙 모드", modeD:"최소 움직임으로 정지된 시스템의 재가동을 돕는 운영 자세" },
  { id:"I16", p:"최근 2주간, 다른 사람과 비교한 뒤 자신이 초라하고 뒤처졌다는 느낌이 오래 지속됐다.", pq:"Q6", sq:"Q5", r1:"R1", leak:"처리단", bug:"MND-SELFDEVALUE-01", bugL:"자기비하 증폭 버그", patch:"Permission Reset", patchL:"허용 기준 복구 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I17", p:"최근 2주간, 누군가의 성취를 접한 직후 내가 세워둔 기준이 갑자기 흔들리는 느낌이 있었다.", pq:"Q6", sq:"Q1", r1:"R1", leak:"처리단", bug:"MND-FALSEPATCH-01", bugL:"가짜 패치 버그", patch:"Benchmark Filter", patchL:"기준 필터 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I18", p:"최근 2주간, SNS나 메신저에서 타인의 근황을 확인한 뒤 자신의 상태를 다시 점검하거나 비교한 적이 잦았다.", pq:"Q6", sq:"Q7", r1:"R1", leak:"처리단", bug:"MND-SELFDEVALUE-01", bugL:"자기비하 증폭 버그", patch:"Permission Reset", patchL:"허용 기준 복구 패치", mode:"최선 모드", modeD:"타인 기준이 아닌 과정 기준으로 비교 오염을 줄이는 운영 자세" },
  { id:"I19", p:"최근 2주간, 일이 예상대로 정리되지 않으면 몸 전체가 경직되고 마음이 과하게 조여왔다.", pq:"Q7", sq:"Q3", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
  { id:"I20", p:"최근 2주간, 작은 실수나 사소한 허술함을 쉽게 흘려보내지 못하고 계속 붙들었다.", pq:"Q7", sq:"Q4", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
  { id:"I21", p:"최근 2주간, 쉬는 시간에도 무언가를 정리하거나 통제하려는 상태에서 완전히 벗어나지 못했다.", pq:"Q7", sq:"Q5", r1:"R2", leak:"조절단", bug:"MND-OVERCONTROL-01", bugL:"과통제 버그", patch:"Root Reset", patchL:"근원 재설정 패치", mode:"설렁설렁 모드", modeD:"과도한 통제와 완벽주의를 낮춰 조절단 경직을 푸는 운영 자세" },
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
  { ref:"universal-reset", label:"3분 리셋", desc:"모든 것을 멈추고 3분간 아무것도 하지 않습니다. 눈을 감고 호흡만 느끼세요.", cta:"지금 리셋하기", priority:0, bandMatch:["overload","low"], qMatch:null, exec:true, durationSec:180 },
  { ref:"slow-down", label:"속도 낮추기", desc:"지금 하고 있는 모든 일의 속도를 의식적으로 절반으로 줄입니다.", cta:"속도 낮추기", priority:1, bandMatch:null, qMatch:["Q1","Q7"], exec:false, durationSec:300 },
  { ref:"sensory-reset", label:"자극 차단", desc:"소리, 빛, 알림 등 외부 입력을 5분간 최소화합니다.", cta:"자극 차단하기", priority:1, bandMatch:null, qMatch:["Q2"], exec:false, durationSec:300 },
  { ref:"stop-signal", label:"출력 멈춤", desc:"말하거나 반응하려는 충동을 10초간 멈추고 내부를 먼저 점검합니다.", cta:"일단 멈추기", priority:1, bandMatch:null, qMatch:["Q4"], exec:false, durationSec:10 },
  { ref:"baseline-reset", label:"기준선 복구", desc:"가장 작은 움직임 하나(물 한 잔, 창문 열기)로 시스템 재가동을 시도합니다.", cta:"회복 시작하기", priority:1, bandMatch:null, qMatch:["Q5"], exec:false, durationSec:60 },
  { ref:"voice-activate", label:"감정 이름 붙이기", desc:"지금 느끼는 것에 한 단어로 이름을 붙여봅니다. 정확하지 않아도 됩니다.", cta:"감정 읽기", priority:2, bandMatch:null, qMatch:["Q3"], exec:false, durationSec:60 },
  { ref:"permission-reset", label:"허용 기준 복구", desc:"'지금까지 한 것'을 하나 떠올리고 그것으로 충분하다고 허락합니다.", cta:"기준 복구하기", priority:2, bandMatch:null, qMatch:["Q6"], exec:false, durationSec:60 },
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
  { ref:"micro-move",   label:"1분 마이크로 무빙",     desc:"발만 바닥에 대기, 팔 한번 들기 같은 최소 움직임으로 재가동을 연습합니다.", qMatch:["Q5"] },
  { ref:"process-chk",  label:"과정 체크 연습",        desc:"오늘 '결과'가 아닌 '과정'에서 잘한 점 하나를 떠올리는 연습입니다.", qMatch:["Q6"] },
  { ref:"80pct-rule",   label:"80% 허용 연습",         desc:"오늘 하나의 일을 의도적으로 80%에서 멈추는 연습입니다.", qMatch:["Q7"] },
  { ref:"trigger-sig",  label:"Trigger Signal 연습",   desc:"손바닥(Stop), 손가락 2개(Time-out), [프리즈] 키워드를 미리 연습합니다.", qMatch:["Q3","Q4"] },
  { ref:"safe-exit",    label:"Safe Exit 문장 연습",   desc:"\"20분간 연결을 끊지만 반드시 다시 연결합니다\" 문장을 미리 연습합니다.", qMatch:["Q3","Q4"] },
];

// ─── Library (16 items) ───
const LIB = [
  { cat:"핵심 프레임", title:"Emotion OS",          desc:"감정을 운영체제로 읽는 상위 프레임",       url:"https://www.notion.so/Emotion-OS-324604b060a4805abeb8cd69aca313c9" },
  { cat:"핵심 프레임", title:"5R 기본 구조",         desc:"인지 → 조절 → 공명 → 회복 → 갱신",       url:"https://www.notion.so/5R-v1-3-320604b060a480f9bbbcd74d09be6ec8" },
  { cat:"핵심 프레임", title:"감정공학이란 무엇인가", desc:"감정공학의 정의와 목적",                   url:"https://www.notion.so/v1-3-31f604b060a480a88245fb446ea1bb1a" },
  { cat:"핵심 프레임", title:"호모 레귤란스",         desc:"Emotion OS를 일상적으로 가동하는 인간형",  url:"https://www.notion.so/Homo-Regulans-v2-5-321604b060a4809ab446f745c72b7e68" },
  { cat:"진단 체계",   title:"감정누수 유형 총론",   desc:"7가지 감정 누수 패턴 분류",               url:"https://www.notion.so/Q1-Q7-v1-3-325604b060a480b18e42f438fa5b7e43" },
  { cat:"진단 체계",   title:"Bug란 무엇인가",       desc:"반복되는 운영 오류의 표준 단위",          url:"https://www.notion.so/Bug-329604b060a4806e9af4e2720535a00e" },
  { cat:"진단 체계",   title:"Patch란 무엇인가",     desc:"Bug에 개입하는 수정 조치",               url:"https://www.notion.so/Patch-329604b060a480d099a5c020cbe22409" },
  { cat:"OS 영역",     title:"Body OS",              desc:"몸의 가동성과 회복을 읽는 프레임",        url:"https://www.notion.so/Body-OS-329604b060a48005be9cc00ad34b32f7" },
  { cat:"OS 영역",     title:"Relation OS",          desc:"관계 안의 경계와 공명을 읽는 프레임",     url:"https://www.notion.so/Relation-OS-329604b060a480dabedce49cd532b625" },
  { cat:"심화 주제",   title:"회복과 감각 리셋의 원리", desc:"R4 회복의 구조와 실전 적용",           url:"https://www.notion.so/R4-v1-3-326604b060a480829a7eef09c9f885df" },
  { cat:"심화 주제",   title:"감정 경계의 필요성",   desc:"R2 조절과 경계 설정의 원리",             url:"https://www.notion.so/R2-v1-3-326604b060a4801bb755fa9585666a26" },
  { cat:"심화 주제",   title:"감정억제와 왜곡분출",   desc:"억압과 폭발의 구조적 분석",              url:"https://www.notion.so/v1-3-320604b060a48025a30cf1ff68024a6d" },
  { cat:"심화 주제",   title:"비교 중독과 자기비하",   desc:"Q6 비교형의 심층 메커니즘",             url:"https://www.notion.so/v1-3-320604b060a48090a854cb5d62a7daf1" },
  { cat:"심화 주제",   title:"관계피로와 경계 설정",   desc:"관계 안에서 경계가 무너지는 구조",      url:"https://www.notion.so/v1-3-320604b060a480d99d1ed16bcf05b560" },
  { cat:"심화 주제",   title:"한국형 번아웃의 구조",   desc:"한국 사회 특유의 소진 메커니즘",        url:"https://www.notion.so/v1-3-320604b060a48047a6fbd5ed8452de6a" },
  { cat:"실전 도구",   title:"리커버리 프로토콜",     desc:"회복을 위한 구조화된 운영 절차",         url:"https://www.notion.so/Recovery-Protocol-v1-4-327604b060a4808f9201d83d9a9c13bb" },
];
const LCATS = ["핵심 프레임","진단 체계","OS 영역","심화 주제","실전 도구"];

// ─── 노션 링크 ───
const NL = { bug:"https://www.notion.so/Bug-329604b060a4806e9af4e2720535a00e", patch:"https://www.notion.so/Patch-329604b060a480d099a5c020cbe22409", q:"https://www.notion.so/Q1-Q7-v1-3-325604b060a480b18e42f438fa5b7e43", r5:"https://www.notion.so/5R-v1-3-320604b060a480f9bbbcd74d09be6ec8", rec:"https://www.notion.so/Recovery-Protocol-v1-4-327604b060a4808f9201d83d9a9c13bb" };
const BLinks = {"MND-OVERCLOCK-01":"https://www.notion.so/326604b060a48067bd84e0dd1fdf9f07","MND-INPUTFLOOD-01":"https://www.notion.so/326604b060a48019be9bcac800bc768d","MND-EMOSUPPRESS-01":"https://www.notion.so/326604b060a480f0be69e58d38f61451","MND-OUTPUTHEAT-01":"https://www.notion.so/326604b060a480edb48be7ef7259bad4","BDY-BOOTFAIL-01":"https://www.notion.so/326604b060a480e49d80de69bb688bfa","BDY-LOWPOWERLOCK-01":"https://www.notion.so/326604b060a480c1bbedf33b4e3325f1","BDY-BEDLOCK-01":"https://www.notion.so/326604b060a4800f9195e1879f6adaba","MND-SELFDEVALUE-01":"https://www.notion.so/326604b060a4805bb3e4f39fe27642e7","MND-FALSEPATCH-01":"https://www.notion.so/326604b060a4809c9b66f76c9631835a","MND-OVERCONTROL-01":"https://www.notion.so/326604b060a4804da9e9d0927b1af375"};
const PLinks = {"Slow-Down Patch":"https://www.notion.so/Slow-Down-Patch-326604b060a480a29a93c43517f3560d","Sensory Reset":"https://www.notion.so/Sensory-Reset-Routine-327604b060a480bd967be841111490f6","Voice Activation":"https://www.notion.so/Voice-Activation-Patch-326604b060a480da82fee6cef256b41e","Stop Signal":"https://www.notion.so/Stop-Signal-Patch-326604b060a48049b883f43b729c4e4b","Baseline Reset":"https://www.notion.so/Baseline-Reset-Patch-327604b060a480a5987ae4ff4cd72deb","Permission Reset":"https://www.notion.so/Permission-Reset-Patch-327604b060a4803c9920e6e431e471e3","Benchmark Filter":"https://www.notion.so/Benchmark-Filter-Patch-326604b060a480e09cd3fb1dd87bea5f","Root Reset":"https://www.notion.so/Root-Reset-Patch-327604b060a480bda42ad01906938209"};

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
  const p = QS.filter(q => q.pq === r.pq);
  const s = QS.filter(q => q.pq === r.sq);
  const c = [...p];
  s.forEach(q => { if (!c.find(x => x.id === q.id)) c.push(q); });
  return c.slice(0, 5);
}

function calcRecheck(a, qs, prev) {
  const s = {}, m = {};
  Object.keys(prev.nm).forEach(k => { s[k] = 0; m[k] = 0; });
  qs.forEach((q,i) => { const r = a[i] ?? 0; s[q.pq] += r*0.7; s[q.sq] += r*0.3; m[q.pq] += 3*0.7; m[q.sq] += 3*0.3; });
  const n = {...prev.nm};
  Object.keys(s).forEach(k => { if (m[k] > 0) n[k] = Math.round(s[k]/m[k]*1000)/10; });
  const st = Object.entries(n).sort((a,b) => b[1]-a[1]);
  const hi = st[0][1], mn = Math.round(Object.values(n).reduce((a,b) => a+b, 0) / 7 * 10) / 10;
  let bd = "stable";
  if (hi >= 70) bd = "overload"; else if (hi >= 50) bd = "low"; else if (hi >= 30) bd = "caution";
  if (bd === "stable" && mn >= 25) bd = "caution";
  const av = Math.round(100 - hi);
  return { nm:n, pq:prev.pq, sq:prev.sq, hi, mean:mn, band:bd, avail:av, spread:Object.values(n).filter(v => v >= 30).length >= 5, leak:prev.leak, r1:prev.r1, bug:prev.bug, bugL:prev.bugL, patch:prev.patch, patchL:prev.patchL, mode:prev.mode, modeD:prev.modeD, ts:Date.now(), type:"recheck", delta:av - prev.avail, baselineType:prev.type === "recheck" ? "recheck" : "full" };
}

function getHotFixes(r) {
  if (!r) return [];
  const f = HOTFIX_DB.filter(h => {
    if (h.bandMatch && h.bandMatch.includes(r.band)) return true;
    if (h.qMatch && (h.qMatch.includes(r.pq) || h.qMatch.includes(r.sq))) return true;
    return false;
  }).sort((a,b) => a.priority - b.priority);
  if ((r.band === "overload" || r.band === "low") && !f.find(x => x.ref === "universal-reset")) f.unshift(HOTFIX_DB[0]);
  return f.slice(0, 3);
}

function isExecutableHotFix(ref) {
  const h = HOTFIX_DB.find(x => x.ref === ref);
  return h ? !!h.exec : false;
}

function getHotFixCtaLabel(ref, cta) {
  return isExecutableHotFix(ref) ? cta : "준비 중";
}

function deriveHS(fs, lr) {
  if (!fs && !lr) return { source:"empty" };
  const l = lr || fs, s = fs || l;
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
function saveState(fs, lr, hist) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fs, lr, hist, v:4 })); } catch(e) {}
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
    if (d && d.v >= 2) return d;
  } catch(e) {}
  return migrateState(STORAGE_KEY_V3) || migrateState(STORAGE_KEY_V2) || migrateState(STORAGE_KEY_V1) || null;
}

function clearState() {
  try { [STORAGE_KEY, STORAGE_KEY_V3, STORAGE_KEY_V2, STORAGE_KEY_V1].forEach(k => localStorage.removeItem(k)); } catch(e) {}
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
  try { const u = new URL(window.location.href); u.hash = ""; u.search = ""; return u.toString(); }
  catch(e) { return window.location.origin || window.location.href; }
}

function buildShareText(r) {
  const shareUrl = getShareUrl();
  const m = deriveLiveMetrics(r);
  const headline = deriveSummaryHeadline(r, m);
  const action = deriveActionMicrocopy(r);
  // 행동 권고 1문장 축약 (첫 문장만)
  const actionShort = action.split(".")[0] + ".";
  return [
    `📊 Emotion OS 진단 결과`, ``,
    headline, ``,
    `삶의 피로도: ${m.fatigueLabel}`,
    `몰입 생산성: ${m.productivityLabel}`,
    `감정 마찰도: ${m.frictionLabel}`, ``,
    `💡 오늘의 한 마디: ${actionShort}`, ``,
    `가동률: ${r.avail}% · ${QL[r.pq]} · ${r.leak}`,
    ``, `— Emotion OS by Haru-Tech Lab`, shareUrl,
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
      try { await navigator.share({ title:"Emotion OS 진단 결과", text, url:shareUrl }); return; }
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
      {copied ? "✓ 복사 완료" : "진단 결과 공유하기"}
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

// ═══ M6-c: NAVIGATION ════════════════════════════════════════════
// Bottom Navigation

const IH = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IS = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IA = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
const IL = ({a}) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.accent:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>);

function BNav({ tab, setTab }) {
  const ts = [{ id:"home", I:IH, l:"Home" }, { id:"scan", I:IS, l:"Scan" }, { id:"action", I:IA, l:"Action" }, { id:"library", I:IL, l:"Library" }];
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
  const cx = 75, cy = 75, rd = 55, as = 2*Math.PI/5, sa = -Math.PI/2;
  const pts = RK.map((k,i) => { const a = sa+i*as, r = rd * Math.max(Math.min(rL[k]/100, 1), 0.08); return { x:cx+r*Math.cos(a), y:cy+r*Math.sin(a), k }; });
  const lps = RK.map((k,i) => { const a = sa+i*as, r = rd+16; return { x:cx+r*Math.cos(a), y:cy+r*Math.sin(a), k }; });
  return (
    <div style={{ display:"flex", justifyContent:"center", margin:"12px 0 8px" }}>
      <svg width={150} height={150} viewBox="0 0 150 150">
        {[.33,.66,1].map(s => (<polygon key={s} points={RK.map((k,i) => { const a = sa+i*as, r = rd*s; return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`; }).join(" ")} fill="none" stroke={C.border} strokeWidth=".5" />))}
        {RK.map((k,i) => <line key={i} x1={cx} y1={cy} x2={cx+rd*Math.cos(sa+i*as)} y2={cy+rd*Math.sin(sa+i*as)} stroke={C.border} strokeWidth=".5" />)}
        <polygon points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill={`${C.accent}20`} stroke={C.accent} strokeWidth="1.5" />
        {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r={p.k===pr?4:2.5} fill={p.k===pr?C.accent:C.dim} />)}
        {lps.map((p,i) => <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:fs(9), fontWeight:p.k===pr?800:500, fill:p.k===pr?C.accent:C.dim, fontFamily:FF }}>{RS[p.k]}</text>)}
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

// ═══ M7-a: HOME ══════════════════════════════════════════════════
// Home Screen

function Home({ hs, hist, onScan, onRc, onCp, onClear, onTimer, actionLog }) {
  if (hs.source === "empty") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:"40px 20px", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:16, background:C.cardH, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <h2 style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginBottom:8 }}>아직 시스템 데이터가 없습니다</h2>
      <p style={{ fontSize:fs(13), color:C.dim, marginBottom:28, lineHeight:1.6 }}>먼저 2분 스캔으로 현재 감정 OS 상태를 확인하세요</p>
      <Btn primary onClick={onScan} style={{ maxWidth:280 }}>지금 스캔 시작하기</Btn>
    </div>
  );

  const b = BAND[hs.band];
  const fx = getHotFixes(hs.qpr);
  const execTop = fx.find(f => isExecutableHotFix(f.ref));
  const homeProto = PROTO_DB.find(p => p.qMatch.includes(hs.pq));
  const homePrac = PRAC_DB.find(p => p.qMatch.includes(hs.pq));
  const recentActions = getVisibleActions(actionLog, 3);
  const isHighStress = hs.band === "overload" || hs.band === "low";
  const justCompleted = !isHighStress && execTop && isRecentlyCompleted(actionLog, execTop.ref);
  const showExecTop = execTop && !justCompleted;

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <div style={{ fontSize:fs(10), letterSpacing:4, color:C.accent, textTransform:"uppercase", fontWeight:700 }}>Emotion OS</div>
          <div style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginTop:2 }}>Kernel Dashboard</div>
        </div>
        {hs.isRc && hs.delta != null && <DBadge delta={hs.delta} />}
      </div>

      {/* 체감 요약 미니 */}
      {(() => {
        const m = deriveLiveMetrics(hs);
        const headline = deriveSummaryHeadline(hs, m);
        const badges = [
          { l:m.fatigueLabel, t:toneByIndex(m.fatigueIdx), k:"피로" },
          { l:m.productivityLabel, t:toneByIndex(m.productivityIdx), k:"몰입" },
          { l:m.frictionLabel, t:toneByIndex(m.frictionIdx), k:"마찰" },
        ];
        return (
          <Card style={{ padding:"14px 16px" }}>
            <p style={{ fontSize:fs(13), fontWeight:700, color:C.text, lineHeight:1.5, marginBottom:10 }}>{headline}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {badges.map((b,i) => (
                <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"4px 8px", borderRadius:999, fontSize:fs(10), fontWeight:600, color:b.t.fg, background:b.t.bg, border:`1px solid ${b.t.border}` }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:b.t.fg }} />{b.k} {b.l}
                </span>
              ))}
            </div>
          </Card>
        );
      })()}

      {/* 가동률 카드 */}
      <Card accent={`${b.c}30`} style={{ background:b.bg }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:fs(12), color:C.dim }}>현재 가동률</span>
          <Badge text={b.l} color={b.c} />
        </div>
        <ANum value={hs.avail} color={b.c} size={28} suffix="%" />
        <MiniBar pct={hs.avail} color={b.c} h={6} />
        <p style={{ fontSize:fs(12), color:C.dim, marginTop:8, lineHeight:1.5 }}>{b.d}</p>
        {hs.spread && <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${C.amber}06`, border:`1px solid ${C.amber}20` }}><span style={{ fontSize:fs(11), fontWeight:600, color:C.amber }}>복수 영역 동시 부하 감지</span></div>}
        {hs.source === "recheck_overlay" && <p style={{ fontSize:fs(10), color:C.muted, marginTop:6 }}>가동률은 최근 재점검 기준이며, 핵심 패턴은 Full Scan 기준입니다</p>}
      </Card>

      <HistoryGraph history={hist} actionLog={actionLog} />

      {/* 활성 패턴 */}
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

      {/* 스마트 폴백: 실행 직후 완충 → Hot Fix → Protocol → Practice */}
      {justCompleted ? (
        <Card accent={`${C.green}30`} style={{ background:`${C.green}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>실행 완료</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.green, marginBottom:4 }}>잘했습니다</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.6 }}>방금 실행한 패치의 효과가 안착하려면 잠시 시간이 필요합니다. 지금은 아무것도 하지 않고 현재 리듬을 유지하세요.</p>
        </Card>
      ) : showExecTop ? (
        <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>Quick Patch</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.teal, marginBottom:4 }}>{execTop.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{execTop.desc}</p>
          <div style={{ marginTop:10 }}><Btn primary small style={{ maxWidth:200 }} onClick={() => onTimer && onTimer(execTop.ref)}>{execTop.cta}</Btn></div>
        </Card>
      ) : homeProto ? (
        <Card accent={`${C.blue}20`} style={{ background:`${C.blue}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>추천 Protocol</div>
          <div style={{ fontSize:fs(15), fontWeight:700, color:C.blue, marginBottom:4 }}>{homeProto.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{homeProto.desc}</p>
        </Card>
      ) : homePrac ? (
        <Card accent={`${C.teal}20`} style={{ background:`${C.teal}05` }}>
          <div style={{ fontSize:fs(11), color:C.muted, marginBottom:6 }}>추천 Practice</div>
          <div style={{ fontSize:fs(13), fontWeight:600, color:C.teal, marginBottom:4 }}>{homePrac.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{homePrac.desc}</p>
        </Card>
      ) : null}

      {/* 실행 이력 */}
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

      {/* 하단 버튼 */}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <Btn small onClick={onRc} style={{ flex:1 }}>가동률 재점검</Btn>
        <Btn small onClick={onCp} style={{ flex:1 }}>Couple Sync (Beta)</Btn>
      </div>
      <div style={{ marginTop:12, textAlign:"center" }}>
        <button onClick={onClear} style={{ background:"none", border:"none", fontSize:fs(10), color:C.muted, cursor:"pointer", fontFamily:FF, padding:4 }}>데이터 초기화</button>
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
          <p style={{ fontSize:fs(15), color:C.text, lineHeight:1.75, marginBottom:26, minHeight:54 }}>{q.p}</p>
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
          <span style={{ fontSize:fs(10), color:C.muted }}>최근 2주 기준</span>
        </div>
      </div>
    </div>
  );
}

// ═══ M7-c: SCAN TAB ══════════════════════════════════════════════
// Scan Tab

function ScanTab({ result, onScan, onRc, onCp }) {
  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h2 style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginBottom:16 }}>Scan</h2>
      <Card onClick={onScan} style={{ cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.accentD, display:"flex", alignItems:"center", justifyContent:"center" }}><IS a /></div>
          <div><div style={{ fontSize:fs(14), fontWeight:700, color:C.text }}>New Full Scan</div><div style={{ fontSize:fs(12), color:C.dim }}>21문항 · 약 2분</div></div>
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
    </div>
  );
}

// ═══ M7-d: ACTION TAB ════════════════════════════════════════════
// Action Tab

function ActionTab({ result, onTimer, actionLog }) {
  const fx = getHotFixes(result).slice(0, 3);
  const hi = result && (result.band === "overload" || result.band === "low");

  if (!result) return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h2 style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginBottom:8 }}>Action</h2>
      <p style={{ fontSize:fs(13), color:C.dim, lineHeight:1.6 }}>스캔 결과가 있어야 맞춤형 패치를 추천할 수 있습니다.</p>
    </div>
  );

  const proto = PROTO_DB.find(p => p.qMatch.includes(result.pq));
  const prac = PRAC_DB.find(p => p.qMatch.includes(result.pq)) || PRAC_DB.find(p => p.qMatch.includes(result.sq));
  const extra = PRAC_DB.filter(p => p !== prac && (p.qMatch.includes(result.pq) || p.qMatch.includes(result.sq))).slice(0, 2);
  const execFx = fx.filter(f => isExecutableHotFix(f.ref));
  const pendFx = fx.filter(f => !isExecutableHotFix(f.ref));
  const recentActs = getVisibleActions(actionLog, 3);
  const wasExecuted = (ref) => {
    const latest = getLatestActionByRef(actionLog, ref);
    return latest ? latest.status === "completed" && !!latest.completedAt : false;
  };

  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h2 style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginBottom:4 }}>Action</h2>
      <p style={{ fontSize:fs(12), color:C.dim, marginBottom:18 }}>현재 상태에 맞는 개입을 실행하세요</p>

      {/* 실행 가능 Hot Fix */}
      {execFx.length > 0 && <>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:fs(11), fontWeight:700, color:C.accent, letterSpacing:2, textTransform:"uppercase" }}>Hot Fix</span>
          <span style={{ fontSize:fs(10), color:C.muted }}>실행 가능 {execFx.length}개</span>
        </div>
        {execFx.map(f => (
          <Card key={f.ref} accent={`${C.accent}30`} style={{ background:`${C.accent}05` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:fs(14), fontWeight:700, color:C.accent }}>{f.label}</span>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {wasExecuted(f.ref) && <Badge text="✓ 실행됨" color={C.green} />}
                <Badge text="최우선" color={C.accent} />
              </div>
            </div>
            <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5, marginBottom:10 }}>{f.desc}</p>
            <Btn primary small onClick={() => onTimer && onTimer(f.ref)}>{f.cta}</Btn>
          </Card>
        ))}
      </>}

      {/* Protocol */}
      {!hi && proto && <>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:execFx.length>0?18:0, marginBottom:8 }}>
          <span style={{ fontSize:fs(11), fontWeight:700, color:C.blue, letterSpacing:2, textTransform:"uppercase" }}>Protocol</span>
          <span style={{ fontSize:fs(10), color:C.muted }}>자동 1개</span>
        </div>
        <Card accent={`${C.blue}20`}>
          <div style={{ fontSize:fs(14), fontWeight:700, color:C.text, marginBottom:4 }}>{proto.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.6 }}>{proto.desc}</p>
        </Card>
      </>}

      {/* Practice */}
      {!hi && prac && <>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:18, marginBottom:8 }}>
          <span style={{ fontSize:fs(11), fontWeight:700, color:C.teal, letterSpacing:2, textTransform:"uppercase" }}>Practice</span>
          <span style={{ fontSize:fs(10), color:C.muted }}>추천 {1+extra.length}개</span>
        </div>
        <Card accent={`${C.teal}20`}>
          <div style={{ fontSize:fs(13), fontWeight:600, color:C.text, marginBottom:4 }}>{prac.label}</div>
          <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{prac.desc}</p>
        </Card>
        {extra.map(e => (
          <Card key={e.ref}>
            <div style={{ fontSize:fs(13), fontWeight:600, color:C.text, marginBottom:4 }}>{e.label}</div>
            <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{e.desc}</p>
          </Card>
        ))}
      </>}

      {/* 준비 중 패치 (접이식) */}
      {pendFx.length > 0 && (
        <Accordion title={`추천 패치 ${pendFx.length}개 (준비 중)`}>
          {pendFx.map(f => (
            <div key={f.ref} style={{ marginBottom:10 }}>
              <div style={{ fontSize:fs(13), fontWeight:600, color:C.text, marginBottom:3 }}>{f.label}</div>
              <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5, marginBottom:4 }}>{f.desc}</p>
              <p style={{ fontSize:fs(10), color:C.muted }}>다음 버전에서 실행형으로 연결됩니다.</p>
            </div>
          ))}
        </Accordion>
      )}

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
          <Card style={{ textAlign:"center", cursor:"pointer" }}><span style={{ fontSize:fs(13), color:C.dim }}>전체 Patch 라이브러리 →</span></Card>
        </a>
      </div>
    </div>
  );
}

// ═══ M7-e: LIBRARY TAB ═══════════════════════════════════════════
// Library Tab

function LibTab() {
  const cc = { "핵심 프레임":C.accent, "진단 체계":C.blue, "OS 영역":C.teal, "심화 주제":C.purple, "실전 도구":C.amber };
  return (
    <div style={{ padding:"20px 16px 100px" }}>
      <h2 style={{ fontSize:fs(18), fontWeight:700, color:C.text, marginBottom:4 }}>Library</h2>
      <p style={{ fontSize:fs(12), color:C.dim, marginBottom:20 }}>감정공학 백과사전 · 탭하면 노션 문서로 이동합니다</p>
      {LCATS.map(cat => {
        const items = LIB.filter(i => i.cat === cat);
        if (!items.length) return null;
        return (
          <div key={cat} style={{ marginBottom:22 }}>
            <div style={{ fontSize:fs(11), fontWeight:700, color:cc[cat]||C.dim, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{cat}</div>
            {items.map(item => (
              <a key={item.title} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
                <Card style={{ cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:fs(14), fontWeight:700, color:C.text, marginBottom:3 }}>{item.title}</div>
                      <p style={{ fontSize:fs(12), color:C.dim, margin:0 }}>{item.desc}</p>
                    </div>
                    <span style={{ fontSize:fs(14), color:C.muted, marginLeft:8 }}>→</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        );
      })}
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
function Result({ result, onDone, isRc }) {
  const b = BAND[result.band];
  const hi = result.band === "low" || result.band === "overload";
  return (
    <div style={{ padding:"28px 16px 100px", maxWidth:500, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <div style={{ fontSize:fs(10), letterSpacing:4, color:C.accent, textTransform:"uppercase", fontWeight:700 }}>Emotion OS</div>
        <h1 style={{ fontSize:fs(20), fontWeight:800, color:C.text, marginTop:6 }}>{isRc ? "가동률 재점검 결과" : "진단 결과"}</h1>
        <p style={{ fontSize:fs(12), color:C.muted, marginTop:4 }}>최근 2주 기준 시스템 운영 상태</p>
        {isRc && result.delta != null && <div style={{ marginTop:10 }}><DBadge delta={result.delta} big /><p style={{ fontSize:fs(10), color:C.muted, marginTop:4 }}>{result.baselineType === "recheck" ? "직전 재점검 대비" : "풀 스캔 대비"}</p></div>}
      </div>

      {/* 1. 체감 요약 (사용자 언어 먼저) */}
      <LiveSummaryCard result={result} />

      {/* 2. 체감 척도 3종 */}
      <LiveMetricsCard result={result} />

      {/* 3. 기술 지표: 가동률 */}
      <Card accent={`${b.c}30`} style={{ background:b.bg }}>
        <div style={{ fontSize:fs(11), fontWeight:700, color:C.muted, marginBottom:8 }}>기술 지표</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontSize:fs(12), color:C.dim }}>현재 가동률</span>
          <Badge text={b.l} color={b.c} />
        </div>
        <ANum value={result.avail} color={b.c} size={26} suffix="%" />
        <MiniBar pct={result.avail} color={b.c} h={6} />
        <p style={{ fontSize:fs(12), color:C.dim, marginTop:8, lineHeight:1.5 }}>{b.d}</p>
        <p style={{ fontSize:fs(11), color:C.muted, marginTop:4, lineHeight:1.5 }}>{b.sub}</p>
        {result.spread && <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:`${C.amber}06`, border:`1px solid ${C.amber}20` }}><span style={{ fontSize:fs(11), fontWeight:600, color:C.amber }}>복수 영역 동시 부하 감지</span></div>}
      </Card>

      {/* 4. 핵심 패턴 */}
      <Card>
        <div style={{ fontSize:fs(12), color:C.muted, marginBottom:8 }}>핵심 패턴</div>
        <p style={{ fontSize:fs(14), color:C.text, lineHeight:1.6 }}>현재 시스템에는 <strong style={{ color:C.accent }}>{QL[result.pq]} 누수 패턴</strong>이 가장 강하게 활성화되어 있습니다.</p>
        <p style={{ fontSize:fs(13), color:C.dim, marginTop:4 }}>보조: {QL[result.sq]}</p>
        <p style={{ fontSize:fs(11), color:C.muted, marginTop:8 }}>성격 판정이 아니라, 현재 에너지가 어떤 방식으로 새고 있는지 보여 주는 운영 상태입니다.</p>
      </Card>

      {/* 5. Q점수 분포 */}
      <Accordion title="Q유형 점수 분포" defaultOpen={!hi}>
        {Object.entries(result.nm).sort((a,b) => b[1]-a[1]).map(([k,v]) => (
          <div key={k} style={{ marginBottom:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:fs(11), color:k===result.pq?C.accent:C.dim, marginBottom:2 }}><span>{QSH[k]}</span><span>{v}%</span></div>
            <MiniBar pct={v} color={k===result.pq?C.accent:k===result.sq?C.blue:C.borderL} h={4} />
          </div>
        ))}
      </Accordion>

      {/* 6. 병목 진단 */}
      <Card>
        <div style={{ fontSize:fs(12), color:C.muted, marginBottom:8 }}>병목 진단</div>
        <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap" }}><Badge text={`누수: ${result.leak}`} color={C.accent} /><Badge text={RL[result.r1]} color={C.purple} /></div>
        <R5Radar pr={result.r1} result={result} />
        <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{LD[result.leak]}</p>
        <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5, marginTop:4 }}>{RD[result.r1]}</p>
      </Card>

      {/* 7. 추천 운영 자세 */}
      <Card accent={`${C.teal}30`} style={{ background:`${C.teal}05` }}>
        <div style={{ fontSize:fs(12), color:C.muted, marginBottom:6 }}>추천 운영 자세</div>
        <div style={{ fontSize:fs(16), fontWeight:700, color:C.teal, marginBottom:4 }}>{result.mode}</div>
        <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.5 }}>{result.modeD}</p>
        <p style={{ fontSize:fs(10), color:C.muted, marginTop:8 }}>성격을 바꾸라는 뜻이 아니라, 지금 시스템을 덜 망가지게 운영하기 위한 임시 자세입니다.</p>
      </Card>

      {/* 8. Bug / Patch */}
      <Card>
        <div style={{ fontSize:fs(12), color:C.muted, marginBottom:8 }}>연결 Bug / Patch</div>
        <a href={BLinks[result.bug]||NL.bug} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}><div style={{ padding:"10px 14px", borderRadius:8, background:C.bg, marginBottom:6, fontSize:fs(12), color:C.text, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span><span style={{ color:C.accent, fontWeight:600, marginRight:6, fontSize:fs(11) }}>{result.bug}</span>{result.bugL}</span><span style={{ color:C.muted, fontSize:fs(11) }}>→</span></div></a>
        <a href={PLinks[result.patch]||NL.patch} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}><div style={{ padding:"10px 14px", borderRadius:8, background:C.bg, fontSize:fs(12), color:C.teal, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span>→ {result.patchL}</span><span style={{ color:C.muted, fontSize:fs(11) }}>→</span></div></a>
        <p style={{ fontSize:fs(10), color:C.muted, marginTop:8 }}>탭하면 해당 카드의 노션 페이지로 이동합니다</p>
      </Card>

      {/* 9. 안내 + 참고 링크 */}
      <Card>
        <p style={{ fontSize:fs(12), color:C.dim, lineHeight:1.7 }}>{hi ? b.act : "반복되는 패턴을 이해하면 다음 과열을 더 빨리 막을 수 있습니다."}</p>
        <p style={{ fontSize:fs(11), color:C.muted, marginTop:8 }}>이 결과는 의료적 진단이 아니라, 반복되는 감정 누수 패턴을 운영 언어로 읽기 위한 안내입니다.</p>
        <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap" }}>
          <a href={NL.q} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="Q유형 총론" color={C.blue} /></a>
          <a href={NL.r5} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="5R 구조" color={C.purple} /></a>
          {hi && <a href={NL.rec} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}><Badge text="리커버리 프로토콜" color={C.teal} /></a>}
        </div>
      </Card>

      {/* 10. 공유 */}
      <ShareBtn result={result} />

      {/* 11. 재점검 안내 */}
      {isRc && <Card style={{ background:`${C.teal}05`, border:`1px solid ${C.teal}15` }}><p style={{ fontSize:fs(11), color:C.dim, lineHeight:1.7, margin:0 }}>재점검은 핵심 패턴을 다시 분류하지 않습니다. 최근 Full Scan을 기준축으로 유지한 채, 현재 가동률 변화만 다시 확인합니다.</p></Card>}

      <Btn primary onClick={onDone}>Dashboard로 돌아가기</Btn>
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
      <div style={{ fontSize:fs(10), letterSpacing:4, color:C.blue, textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>Couple OS <span style={{ color:C.amber }}>(Beta)</span></div>
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
  const [remaining, setRemaining] = useState(timer.durationSec);
  const [done, setDone] = useState(false);
  const endAt = useRef(timer.startedAt + timer.durationSec * 1000);

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
  const pct = timer.durationSec > 0 ? ((timer.durationSec - remaining) / timer.durationSec) * 100 : 0;
  const circR = 80, circC = 2 * Math.PI * circR;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 20px", textAlign:"center" }}>
      <div style={{ fontSize:fs(10), letterSpacing:4, color:C.accent, textTransform:"uppercase", fontWeight:700, marginBottom:24 }}>Emotion OS</div>
      <h2 style={{ fontSize:fs(22), fontWeight:800, color:C.text, marginBottom:8 }}>{timer.label}</h2>
      <p style={{ fontSize:fs(13), color:C.dim, marginBottom:32, lineHeight:1.6, maxWidth:300 }}>아무것도 해결하려 하지 말고,<br/>호흡만 느끼세요.</p>
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
      {done && <Btn primary onClick={onComplete} style={{ maxWidth:260 }}>완료 · 돌아가기</Btn>}
    </div>
  );
}

// ═══ M8: APP ═════════════════════════════════════════════════════
// M8: APP — 메인 앱 (상태 관리 + 라우팅)
// EMOTION OS v4.4

function EmotionOSApp() {
  const [tab, setTab] = useState("home");
  const [scr, setScr] = useState("tabs");
  const [fs, setFs] = useState(null);
  const [lr, setLr] = useState(null);
  const [rcQs, setRcQs] = useState([]);
  const [hist, setHist] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [actionLog, setActionLog] = useState(() => loadActionLog());
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Global keyframes (App 루트에서 1회 주입)
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

  // 폰트 로드 (standalone 런타임 fallback)
  useEffect(() => {
    if (!document.querySelector('link[href*="pretendard"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = FONT_CDN;
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    const d = loadState();
    if (d) { setFs(d.fs); setLr(d.lr); setHist(d.hist || []); }
  }, []);

  useEffect(() => {
    if (fs || lr) saveState(fs, lr, hist);
  }, [fs, lr, hist]);

  const hs = deriveHS(fs, lr);
  const cr = lr || fs;

  const addToHist = (r) => {
    const entry = { avail:r.avail, band:r.band, pq:r.pq, type:r.type, ts:r.ts };
    setHist(h => [...h.slice(-19), entry]);
  };

  const openHotFixTimer = (ref, result) => {
    const hf = HOTFIX_DB.find(h => h.ref === ref);
    if (!hf || !hf.exec) return;
    setActiveTimer({ ref, label:hf.label, durationSec:hf.durationSec, startedAt:Date.now(), availAtStart:result?.avail ?? null, resultType:result?.type ?? null });
    setScr("timer");
  };

  const completeTimer = () => {
    if (!activeTimer) return;
    const entry = {
      id:`act_${Date.now()}`, ref:activeTimer.ref, label:activeTimer.label,
      startedAt:activeTimer.startedAt, completedAt:Date.now(),
      durationSec:activeTimer.durationSec, resultType:activeTimer.resultType,
      availAtStart:activeTimer.availAtStart, status:"completed",
    };
    const next = [entry, ...actionLog].slice(0, 30);
    setActionLog(next);
    saveActionLog(next);
    setActiveTimer(null);
    setScr("tabs");
  };

  const cancelTimer = () => {
    if (activeTimer) {
      const entry = {
        id:`act_${Date.now()}`, ref:activeTimer.ref, label:activeTimer.label,
        startedAt:activeTimer.startedAt, cancelledAt:Date.now(),
        durationSec:activeTimer.durationSec, resultType:activeTimer.resultType,
        availAtStart:activeTimer.availAtStart, status:"cancelled",
      };
      const next = [entry, ...actionLog].slice(0, 30);
      setActionLog(next);
      saveActionLog(next);
    }
    setActiveTimer(null);
    setScr("tabs");
  };

  const executeClear = () => {
    clearState(); clearActionLog();
    setFs(null); setLr(null); setHist([]); setActionLog([]); setActiveTimer(null); setScr("tabs");
    setConfirmOpen(false);
  };
  const handleClear = () => setConfirmOpen(true);

  return (
    <div style={{ fontFamily:FF, background:C.bg, color:C.text, minHeight:"100vh", WebkitFontSmoothing:"antialiased" }}>

      {scr === "tabs" && <>
        {tab === "home" && <Home hs={hs} hist={hist} onScan={() => setScr("scan")} onRc={() => { const b = lr || fs; if (!b) return; setRcQs(getRecheckQs(b)); setScr("rc"); }} onCp={() => setScr("cp")} onClear={handleClear} onTimer={(ref) => openHotFixTimer(ref, cr)} actionLog={actionLog} />}
        {tab === "scan" && <ScanTab result={cr} onScan={() => setScr("scan")} onRc={() => { const b = lr || fs; if (!b) return; setRcQs(getRecheckQs(b)); setScr("rc"); }} onCp={() => setScr("cp")} />}
        {tab === "action" && <ActionTab result={cr} onTimer={(ref) => openHotFixTimer(ref, cr)} actionLog={actionLog} />}
        {tab === "library" && <LibTab />}
        <BNav tab={tab} setTab={setTab} />
      </>}

      {scr === "scan" && <ScanFlow onComplete={a => { setScr("ld"); setTimeout(() => { const r = calcFull(a); setFs(r); setLr(r); addToHist(r); setScr("res"); }, 1800); }} />}
      {scr === "rc" && <ScanFlow onComplete={(a,q) => { setScr("ld"); const b = lr || fs; setTimeout(() => { const r = calcRecheck(a, q, b); setLr(r); addToHist(r); setScr("rcRes"); }, 1500); }} isRc rcQs={rcQs} />}
      {scr === "ld" && <Loading msg="시스템 패턴 분석 중" />}
      {scr === "res" && cr && <Result result={cr} onDone={() => { setScr("tabs"); setTab("home"); }} />}
      {scr === "rcRes" && cr && <Result result={cr} onDone={() => { setScr("tabs"); setTab("home"); }} isRc />}
      {scr === "cp" && <Couple onBack={() => { setScr("tabs"); setTab("home"); }} />}
      {scr === "timer" && activeTimer && <TimerScreen timer={activeTimer} onComplete={completeTimer} onCancel={cancelTimer} />}

      <ConfirmModal
        open={confirmOpen}
        message={"모든 진단 이력과 실행 기록이 영구 삭제됩니다.\n계속하시겠습니까?"}
        onConfirm={executeClear}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
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
