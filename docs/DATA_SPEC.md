# Stato 데이터 사양서 v1.3.2

기준 코드: **v4.9.2** (GitHub `main` · commit `cf218f7`)
작성일: 2026-04-24 (v1.3.2 개정)
작성: 하루테크랩

---

## 이 문서가 하는 일

Stato가 사용자 기기(localStorage)에 저장하는 모든 데이터의 표준 정의를 한 곳에 모은다. 코드와 사양 표기가 어긋날 때 **이 문서가 진실이다**. 새 항목이 합의되면 끝의 변경 이력에 한 줄을 추가한다.

**이 문서와 충돌하는 과거 구현 사양 문구·코멘트·메모는 모두 폐기된 것으로 간주한다.** 예를 들어 과거 문서에 남은 `improved` 같은 옛 result 값, patchMeta를 `ref` / `label`로 짧게 쓰던 이전 명칭, `feedback: null` 같은 옛 SKIP 표기 등은 모두 현행 정의로 치환한다.

문서는 두 층으로 나뉜다.

- **Part A. 현재 구현된 것 (v4.9.2)** — 현재 GitHub main에 배포된 코드에서 직접 검증된 사실만 기록한다.
- **Part B. 향후 구현 예정 (v5.0.0)** — 설계 의도로 확정된 것들을 기획으로 기록한다. 실제 구현이 끝나면 해당 항목을 Part A로 승격시키고 이 문서의 버전을 올린다.

각 항목은 같은 형식으로 적는다.

- **정의**: 그 데이터가 무엇이고 언제 갱신되는지
- **형식**: 실제 저장되는 JSON 형태
- **코드 참조**: 현재 구현이 위치한 함수 또는 코드 영역

---

# Part A. 현재 구현된 것 (v4.9.2)

## A1. localStorage 키 매핑

| 키 | 도메인 | 비고 |
|---|---|---|
| `emotion-os-v4` | state | 현재 정식 키 |
| `emotion-os-v3`, `v2`, `v1` | state (마이그레이션) | 읽기 전용. 발견 시 v4로 승격 후 폐기 |
| `emotion-os-v4-actionlog` | actionLog | 현재 정식 키 |
| `emotion-os-v3-actionlog`, `emotion-os-actionlog` | actionLog (마이그레이션) | 읽기 전용. 발견 시 v4로 승격 후 폐기 |
| `stato-personal-v1` | personalState | D3-alpha 개인화 데이터 |
| `stato-onboard-done` | 온보딩 완료 플래그 | 데이터 초기화 시 보존 |

**코드 참조**: `App.js` 33~41행 (CONFIG 섹션)

---

## A2. 앱 상태 (메모리 상)

앱 실행 중 메모리에 유지되는 상태 전체. `INIT_APP`에서 초기값이 정의되고, 리듀서(`appReducer`)가 모든 전환을 관리한다.

```json
{
  "tab": "home",
  "scr": "tabs",
  "fullScan": null,
  "lastResult": null,
  "rcQs": [],
  "hist": [],
  "activeTimer": null,
  "actionLog": [],
  "confirmOpen": false,
  "drillPq": null
}
```

**주의 사항**

- `fullScan`과 `lastResult`는 스캔 결과 객체(`{ avail, band, pq, type, nm, ts, ... }`) 또는 `null`.
- `hist`는 최대 `MAX_HIST = 20`개까지 보관. 초과 시 앞에서부터 잘린다.
- `actionLog`는 최대 `MAX_ALOG = 30`개까지 보관. 최신이 앞.
- `activeTimer`는 타이머 실행 중에만 객체, 평시에는 `null`.

**코드 참조**: `App.js`의 `INIT_APP` (2823~2834행), `appReducer` (2841행~)

---

## A3. state 저장소 — `emotion-os-v4`

메모리 상태 중 **영구 보관 대상만** JSON으로 직렬화돼 `STORAGE_KEY`에 저장된다. `actionLog`는 여기 들어가지 않고 별도 저장소(A4)를 쓴다는 점 중요.

**실제 저장되는 형태**

```json
{
  "fs":   "<fullScan 객체 또는 null>",
  "lr":   "<lastResult 객체 또는 null>",
  "hist": "<entry 배열>",
  "v":    4
}
```

- JSON 키 `fs`, `lr`은 기존 저장 포맷 호환을 위해 축약형 그대로 유지. 앱 내부에서는 `fullScan`, `lastResult`로 풀어 쓴다.
- `v`는 스키마 버전. 2 이상이면 로드 시도, 2 미만이면 마이그레이션 체인으로 폴백.

**hist entry의 형태 (SCAN_DONE, RECHECK_DONE 공통)**

```json
{
  "avail": 62,
  "band":  "caution",
  "pq":    "Q3",
  "type":  "full",
  "ts":    1714000000000
}
```

| 필드 | 타입 | 의미 |
|---|---|---|
| `avail` | number | Availability 점수 |
| `band` | string (enum) | 상태 대역 라벨 — 허용값은 A7 참조 |
| `pq` | string | 주 Q축 식별자 (예: `Q3`) |
| `type` | string | 상태 타입 코드 |
| `ts` | number | Unix ms 타임스탬프 |

현재 hist entry에는 **`feedback` 필드가 없다**. (v5.0.0에서 추가 예정. Part B 참조.)

**코드 참조**: `App.js`의 `saveState`, `loadState`, `migrateState`, `clearState` (552~589행), SCAN_DONE/RECHECK_DONE entry 생성부 (3108행, 3118행)

---

## A4. actionLog 저장소 — `emotion-os-v4-actionlog`

타이머 완료 또는 취소 시 한 행이 append되는 실행 기록. state 저장소와 **완전히 분리**돼 있다.

**한 행(entry)의 형태**

완료 시:
```json
{
  "id":           "act_1714000000000",
  "ref":          "universal-reset",
  "label":        "3분 리셋",
  "startedAt":    1714000000000,
  "completedAt":  1714000180000,
  "durationSec":  180,
  "resultType":   "full",
  "availAtStart": 55,
  "status":       "completed"
}
```

취소 시에는 `completedAt` 자리에 `cancelledAt`이 들어가고 `status`가 `"cancelled"`가 된다.

| 필드 | 타입 | 의미 |
|---|---|---|
| `id` | string | `act_<Unix ms>` 형식의 고유 ID |
| `ref` | string | 패치 식별자 (예: `universal-reset`) |
| `label` | string | 사용자 표시용 패치 이름 |
| `startedAt` | number | 타이머 시작 시각 (Unix ms) |
| `completedAt` | number | 정상 완료 시각 (Unix ms). 취소 시 미존재 |
| `cancelledAt` | number | 취소 시각 (Unix ms). 완료 시 미존재 |
| `durationSec` | number | 계획된 타이머 길이 (초) |
| `resultType` | string | 시작 시점 상태 타입 스냅샷 |
| `availAtStart` | number | 시작 시점 가동률 스냅샷 |
| `status` | string (enum) | 허용값은 A7 참조 |

**정규화 규칙**

`loadActionLog`가 호출될 때 `normalizeActionLog()`가 각 entry를 점검한다. 다음 경우 `status`를 `"unknown"`으로 보정한다.

- `status`가 비어 있거나 유효하지 않은 값일 때
- `status === "completed"`인데 `completedAt`이 없을 때
- `status === "cancelled"`인데 `cancelledAt`이 없을 때

`unknown` 레코드는 저장소에 남지만 사용자 화면에서는 필터링되어 "기록 불완전" 뱃지와 함께만 일부 노출된다.

**코드 참조**: `App.js`의 `saveActionLog`, `loadActionLog`, `normalizeActionLog`, `clearActionLog` (674~714행), entry 생성부 `completeTimer`/`cancelTimer` (3046~3075행), JSDoc 타입 선언 (268행)

---

## A5. personalState 저장소 — `stato-personal-v1` (D3-alpha)

**초기 형태**

```json
{
  "patchStats":            {},
  "lastCompletedPatchRef": null
}
```

**patchStats의 한 항목 (ref별)**

```json
{
  "tries":         0,
  "completes":     0,
  "skips":         0,
  "recentEffects": [],
  "lastUsedAt":    null
}
```

| 필드 | 타입 | 의미 |
|---|---|---|
| `tries` | number | 시도 횟수 |
| `completes` | number | 완료 횟수 |
| `skips` | number | 스킵(취소) 횟수 |
| `recentEffects` | array | 최근 효과(가동률 변화량) 이력 |
| `lastUsedAt` | number\|null | 마지막 사용 시각 (Unix ms) |

**코드 참조**: `App.js`의 `INIT_PERSONAL`, `loadPersonalState`, `savePersonalState`, `clearPersonalState`, `updatePatchStat`, `attachPatchEffect` (591~615행)

---

## A6. 데이터 초기화 정책

"데이터 초기화" 버튼은 다음 키를 모두 삭제한다.

- **state 도메인** (`emotion-os-v4`와 모든 마이그레이션 키)
- **actionLog 도메인** (`emotion-os-v4-actionlog`와 모든 마이그레이션 키)
- **personalState 도메인** (`stato-personal-v1`)

다음 키는 **보존한다**.

- **온보딩 플래그** (`stato-onboard-done`) — 초기화 후 사용자에게 온보딩이 다시 뜨지 않도록 의도된 보존

**정상 경로와 폴백 경로의 정합성**

정상 경로(앱 내 "데이터 초기화" 버튼)와 응급 경로(앱 크래시 시 ErrorBoundary 폴백 버튼)는 동일한 키 집합을 삭제해야 한다. 한쪽만 PERSONAL_KEY를 지우는 비대칭은 신뢰도 버그이므로 금지.

**코드 참조**: `App.js`의 `executeClear` 함수 (3079행), `ErrorBoundary` 폴백 버튼의 직접 키 리스트 (3162행)

---

## A7. 허용값 enum (v4.9.2 확정분)

| 필드 | 위치 | 허용값 | 비고 |
|---|---|---|---|
| `band` | hist entry, 스캔 결과 객체 | `"stable"`, `"caution"`, `"low"`, `"overload"` | 임계값: `hi≥70→overload`, `hi≥50→low`, `hi≥30→caution`, else `stable`. 추가 보정: `stable && mean≥25 → caution` |
| `type` | hist entry, 스캔 결과 객체 | `"full"`, `"recheck"` | `calcFull()` 반환 → `full`, `calcRecheck()` 반환 → `recheck` |
| `status` | actionLog entry | `"completed"`, `"cancelled"`, `"unknown"` | `unknown`은 `normalizeActionLog()`가 비정상/불완전 레코드 정규화 시에만 생성 |

**동명 필드 주의**: 패치 카탈로그 정의(예: `{ ref:"leak-note", type:"기록형", ... }`)에도 `type` 필드가 있으나, 이는 **hist entry의 `type`과 완전히 다른 문맥**이다. 카탈로그 분류 라벨은 한국어(`"기록형"`, `"움직임형"` 등)로, hist entry의 type은 영어 소문자(`"full"`, `"recheck"`)로 구분된다. 분석 스크립트는 필드 값의 언어로 문맥을 판별할 수 있으나, 혼동을 피하려면 읽는 시점의 객체가 hist entry인지 카탈로그인지 먼저 확인해야 한다.

다른 enum(`feedback.result`, `feedback.feeling`, `gainLevel` 등)은 v4.9.2에 아직 존재하지 않음. Part B 참조.

**코드 참조**: `band` 분기 로직은 `App.js` 285~287행, 353~355행. `type`은 294·296행(`calcFull`)과 382행(`calcRecheck`). `status` JSDoc은 268행, 보정 로직은 678~689행.

---

# Part B. 향후 구현 예정 (v5.0.0)

아래 항목들은 v4.9.2에 구현돼 있지 **않다**. 대표의 설계 의도로 확정된 기획이며, v5.0.0 개발 시 이 정의를 기준 삼아 구현한다. 구현이 완료되면 해당 항목을 Part A로 승격시키고, 구현 파일의 정확한 함수·줄 번호를 코드 참조에 기입한다.

## B1. RC 피드백 2단계 체계

### B1.1 구조 개요

현재 v4.9.2의 재점검은 `RECHECK_DONE` 한 단계로 끝난다. v5.0.0에서는 재점검 완료 직후 사용자로부터 **결과 방향(result)**과 **체감(feeling)** 두 가지 응답을 받는 2단계 피드백으로 확장된다.

- 재점검 계산이 끝나면 `pendingRcEntry`가 먼저 만들어진다.
- 사용자가 결과/체감을 입력하면 `RC_FEEDBACK_DONE` 액션으로 `feedback` 필드가 채워진 상태로 `state.hist`에 append된다.
- 사용자가 체감 입력을 생략하면 `RC_FEEDBACK_SKIP` 액션으로 **부분 스킵 형태의 feedback이 채워진 상태로** `state.hist`에 append된다.

### B1.2 feedback의 소속 (★ 중요)

`feedback`은 **`state.hist`의 recheck entry에 붙는다.** `actionLog`에는 붙지 않는다. `actionLog`는 타이머 실행 기록 전용이며 v5.0.0에서도 이 역할은 유지된다.

### B1.3 recheck entry 형태 (v5.0.0)

```json
{
  "avail":     72,
  "band":      "stable",
  "pq":        "Q3",
  "type":      "recheck",
  "ts":        1714000000000,
  "feedback":  { "result": "better", "feeling": "lighter" },
  "patchMeta": { "...": "..." }
}
```

기존 hist entry 5개 필드(`avail`, `band`, `pq`, `type`, `ts`)에 두 필드가 추가된다.

- `feedback` — 사용자 응답 (아래 B1.4 참조)
- `patchMeta` — 해당 재점검 직전에 실행된 패치의 메타데이터 snapshot (B3 참조)

### B1.4 SKIP의 정의 (★ 핵심)

> SKIP은 완전 무응답 저장이 아니라, 결과 방향(`result`)은 남기고 체감(`feeling`)만 생략하는 **부분 스킵**이다. 따라서 SKIP 레코드의 `feedback.result`는 null이 아닐 수 있으며, `feedback.feeling`은 항상 null이다.

**예시 — 정상 완료 케이스**

```json
"feedback": { "result": "better", "feeling": "lighter" }
```

**예시 — SKIP 케이스**

```json
"feedback": { "result": "better", "feeling": null }
```

**분석자 주의사항**

"SKIP인데 왜 result가 살아 있지?"라는 의문이 생길 수 있으나, 위 정의에 따라 **이는 정상 동작이다.** 옛 표기인 `feedback: null`은 더 이상 유효한 SKIP 표현이 아니다. 문서·코드 어디에서든 `feedback: null` 흔적을 발견하면 옛 표기로 간주하고 교체한다.

### B1.5 feedback 허용값 (잠정)

| 필드 | 허용값 (잠정) | 의미 |
|---|---|---|
| `feedback.result` | `"better"` / `"nochange"` / `"worse"` | 재점검 결과 방향 |
| `feedback.feeling` | `"lighter"` / `"justright"` / `"heavier"` / `null` | 체감. null은 SKIP을 의미 |

**중요**: 위 문자열 리터럴은 설계 의도 수준이며, 실제 v5.0.0 구현 시 **반드시 이 문서와 정합되게** 코드에 박아야 한다. `improved`/`better`, `same`/`nochange` 같은 드리프트 발생 시 이 문서를 기준으로 교정한다.

---

## B2. GainTag — 패치 강도/길이 인디케이터

재점검 시 "지금 막 끝낸 패치가 얼마나 강했나"를 세 단계로 태깅한다. UI에서는 배지나 라벨로 표시되며, 분석 단계에서 패치 강도별 효과를 측정하는 축이 된다.

### B2.1 gainLevel 허용값 (잠정)

| 값 | 의미 |
|---|---|
| `"light"` | 가벼운 패치. 짧은 시간, 낮은 개입 강도 |
| `"standard"` | 표준 패치. 기본 설정 |
| `"deep"` | 깊은 패치. 긴 시간, 높은 개입 강도 |

### B2.2 임계값 상수

분류 경계는 `durationSec` 기준으로 상수화한다.

- `GAIN_LIGHT_MAX_SEC` — 이 값 이하면 `light`
- `GAIN_STANDARD_MAX_SEC` — 이 값 이하면 `standard`, 초과하면 `deep`

**현재 실험값 (정식 확정 전)**

| 상수 | 실험값 | 분류 결과 |
|---|---|---|
| `GAIN_LIGHT_MAX_SEC` | `180` (3분) | 180초 이하 → `light` |
| `GAIN_STANDARD_MAX_SEC` | `300` (5분) | 180초 초과 ~ 300초 이하 → `standard` / 300초 초과 → `deep` |

위 수치는 현재 v5 구현 사양·프로토타입에서 사용 중인 실험값이다. 사용자 데이터 축적 후 재검토하여 v5.0.0 정식 배포 시점에 확정하고, 이 문서의 "실험값" 표기를 제거한다.

---

## B3. patchMeta snapshot

재점검 직전에 **완료된 패치**의 메타데이터를 재점검 entry에 함께 저장하여, 재점검 결과가 "어떤 패치를 완료한 후의 결과인지" 그 자체로 읽을 수 있게 한다. 취소된 패치는 대상에서 제외된다 — `lastCompletedPatchRef`가 완료 시점에만 갱신되기 때문이다.

**필드 (확정)**

| 필드 | 타입 | 의미 |
|---|---|---|
| `patchRef` | string | 직전에 완료된 패치 식별자 |
| `patchLabel` | string | 사용자 표시용 이름 |
| `gainLevel` | string (enum) | 패치 강도. 허용값은 B2.1 참조 |
| `durationSec` | number | 실제 완료된 타이머 길이 (초) |

**명칭 정책 (★ 드리프트 방지)**

patchMeta 내부에서는 **반드시 `patchRef` / `patchLabel`을 사용**한다. `ref` / `label`로 축약하지 않는다. 이유는 두 가지다.

첫째, hist entry가 flat 구조로 분석될 때 actionLog entry의 동명 필드(`ref`, `label`)와 섞이면 분석 스크립트가 혼동한다. 접두사 `patch-`가 그 섞임을 원천 차단한다.

둘째, 현재 v5 구현 사양서와 v5 코드 계열이 이미 `patchRef` / `patchLabel`을 사용하고 있으므로, 사양서가 코드를 따라가는 것이 맞다.

**생성 시점**

patchMeta는 재점검 완료 직후 `pendingRcEntry`에 실리며, `getLastCompletedPatchMeta()` 계열 함수가 이를 생성한다. `savePersonalState()`가 실시간으로 갱신하는 `lastCompletedPatchRef`를 키로 참조해 직전 패치를 조회하는 것이 현재의 설계 방향이다.

---

## B4. 허용값 enum (v5.0.0 추가 예정)

| 필드 | 위치 | 허용값 (잠정) |
|---|---|---|
| `feedback.result` | state.hist recheck entry | `"better"` / `"nochange"` / `"worse"` |
| `feedback.feeling` | state.hist recheck entry | `"lighter"` / `"justright"` / `"heavier"` / `null` |
| `gainLevel` | patchMeta | `"light"` / `"standard"` / `"deep"` |

`gainLevel`의 저장 위치는 현 설계안에서 **`patchMeta` 내부로만 확정**한다. 향후 `actionLog entry`에도 확장할 가능성은 열려 있으나, 현 사양서 기준으로는 patchMeta 단일 위치다. 확장이 결정되면 이 표에 추가한다.

Part A의 A7과 합쳐서 v5.0.0 배포 시점에는 하나의 통합 enum 표로 합친다.

---

## 변경 이력

- **2026-04-24 v1.3.2** — 마감 미세 조정 (표현·enum 보강, 구조 변경 없음).
  - A7 enum 표에 `type` 필드 추가 (`"full"` / `"recheck"`). 코드 참조 행 번호(294·296·382) 명기
  - A7에 "동명 필드 주의" 안내 추가 — 패치 카탈로그의 `type`(한국어 분류 라벨)과 hist entry의 `type`을 혼동하지 않도록 분석자용 지침 기재
  - B3 첫 문장 톤 정리: "어떤 패치를 실행해서 끝낸 후의 결과인지" → "어떤 패치를 완료한 후의 결과인지". 아래 "완료된 패치" 정의와 톤 일치

- **2026-04-24 v1.3.1** — 마감 정밀화 (표현 정확도 향상, 구조·정의 변경 없음).
  - 서문의 자기참조 표현 정리: "버전을 올린다(v1.3 이상)" → "버전을 올린다"
  - B2.2 GAIN 실험값 출처 정밀화: "v5 구현에서 사용 중" → "v5 구현 사양·프로토타입에서 사용 중" (프로덕션 배포 오해 방지)
  - B3 patchMeta 대상 정밀화: "실행된 패치" → "완료된 패치"로 교정. `lastCompletedPatchRef` 동작 근거 명시, 취소된 패치가 대상에서 제외됨을 본문에 박음

- **2026-04-24 v1.3** — 문서 간 드리프트 차단.
  - 서문에 구문서 폐기 원칙 한 문장 추가 — 과거 구현 사양과 충돌 시 본 문서가 우선
  - B3 patchMeta 필드명을 `patchRef` / `patchLabel`로 통일 (기존 `ref` / `label`에서 변경). v5 코드·구현 사양과 정합. 명칭 정책 섹션 추가로 향후 드리프트 원천 차단
  - B2.2 GAIN 상수의 TBD 해소 — 현재 v5 실험값 `GAIN_LIGHT_MAX_SEC = 180`, `GAIN_STANDARD_MAX_SEC = 300` 기재 (정식 확정 전 명시)

- **2026-04-24 v1.2** — band/status enum 정합성 및 gainLevel 위치 정리.
  - A3 hist entry 예시에서 `band: "moderate"`(부정확) → `band: "caution"`으로 교체
  - A7에 `band` enum 추가 (`stable`/`caution`/`low`/`overload`, 임계값 규칙 포함)
  - A7에 `status: "unknown"` 값 추가 및 `normalizeActionLog()` 정규화 규칙 기재
  - A4에 정규화 규칙 섹션 추가 (unknown 보정 조건 명시)
  - B4에서 `gainLevel` 저장 위치를 `patchMeta` 단일로 축소 (actionLog entry 제거, 향후 확장 여지만 문장으로 남김)
  - 문서 제목 아래에 "기준 코드: v4.9.2 (cf218f7)" 부제 추가 — 문서가 어느 코드 버전을 설명하는지 선명화

- **2026-04-24 v1.1** — 2층 구조 도입.
  - 문서를 Part A(현재 구현)와 Part B(향후 구현)로 분리
  - feedback 소속 정정: `actionLog`가 아니라 `state.hist`의 recheck entry (B1.2)
  - state(A2), state 저장소(A3), actionLog(A4) 최소 JSON 스키마 확정 — TBD 탈출

- **2026-04-24 v1.0** — 초안.
  - SKIP 정의 확정 (당시 feedback 소속 오기재, v1.1에서 수정)
  - personalState 구조 확정
  - 데이터 초기화 정책 확정
