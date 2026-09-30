# Maestro Web 쇼릴

Maestro Web을 처음 보는 사람에게 소개하는 30초 한국어 모션그래픽 영상입니다.
HTML·Canvas로 만든 장면을 헤드리스 Chrome으로 한 프레임씩 렌더링하고, 실제 게임 플레이 화면과 게임 음원(베르디 *Dies Irae*)을 합칩니다.

- 결과물
  - `maestro-web-showreel.mp4`: 마스터 (1920×1080 · 60fps · 30초 · 55MB). 용량이 커서 `.gitignore`에 넣었습니다.
  - `maestro-web-showreel-web.mp4`: 저장소용 (1080p60 · 9MB, GitHub 무료 계정의 동영상 업로드 한도 10MB 이하)
  - `highlights.webp`: 프로젝트 README 맨 위의 하이라이트 루프 (장면마다 1초 안팎 · 3.5MB)
  - `poster.jpg`: 썸네일
- 모든 컷은 Hard 채보의 비트 그리드에 맞췄습니다. 영상 시간 `v`와 곡 시간 `s`의 관계는 `s = v − 0.5`입니다. 맨 앞의 0.5초는 지휘자가 첫 박 전에 지휘봉을 드는 예비박입니다.

## 구성

| 영상 시간 | 장면 | 내용 |
|---|---|---|
| 0.0–0.5 | 예비박 | 양손(금빛 점)이 올라감 |
| 0.5–3.5 | 콜드 오픈 | 곡의 강타 5번(채보상 양손 악센트)에 맞춰 금빛 지휘 궤적이 화면을 가르고 "웹캠 앞에서 / 두 손으로 / 오케스트라를 / 지휘하라"가 들어옴 |
| 3.5–6.6 | 타이틀 | MAESTRO 로고, 트롬본·트럼펫 큐 링 |
| 6.6–12.9 | 플레이 방법 | 음악에 동기화한 실제 게임 화면, 4/4 지휘 도형, 웹캠 스켈레톤. 오른손 = 지휘봉, 왼손 = 큐·셈여림·페르마타 |
| 12.9–15.9 | 트래킹 | 손 관절 21개, 어깨 기준 좌표계, One Euro 필터(프로젝트의 필터 알고리즘 그대로) |
| 15.9–18.6 | 판정 | 방향 ±35° · 속도 · 타이밍 ±0.2s → PERFECT |
| 18.6–22.0 | 실패 연출 | 게임의 실패 연주 음원으로 실제 크로스페이드, 글리치 → PERFECT로 회복 |
| 22.0–25.1 | 기술 스택 | 게임 화면 위로 기술 칩 |
| 25.1–30.0 | 엔드 카드 | 입자가 로고로 모임, URL |

## 파일

```
index.html, reel.js    장면 전체. 모든 움직임이 곡 시간 s의 순수 함수라서 프레임을 어떤 순서로든, 병렬로 렌더링할 수 있음
data.js                비트·제스처·큐·페르마타, 프레임별 음량, 파형 (scripts/make-data.mjs로 생성)
scripts/
  fetch-fonts.mjs      Pretendard, Noto Serif KR, Playfair Display, JetBrains Mono 받기 → fonts/
  make-data.mjs        채보·레이아웃·음원으로 data.js 생성 (ffmpeg 필요)
  prepare-game.sh      게임 사본을 build/game에 만들고 캡처용 봇 패치를 적용해 빌드 (저장소 src/는 건드리지 않음)
  capture-gameplay.mjs 가상 시간으로 게임을 돌려 프레임 i = 곡 시간 i/60 으로 캡처 → gameplay/
  render.mjs           preview(정지 화면) / mb(모션 블러 렌더) → out/chunks
  audio.fg, mix-audio.sh  음원 믹스 → out/mix.wav
  assemble.sh          청크 + 음원 → maestro-web-showreel.mp4, poster.jpg
  web.sh               마스터 → maestro-web-showreel-web.mp4, highlights.webp
patches/bot-landmarks.patch  캡처용 봇: 21개 관절 손(오른손은 깃펜을 쥔 모양), ?botfail=<초>
```

`fonts/`, `gameplay/`, `build/`, `out/`, `preview/`는 모두 생성물이라 커밋하지 않습니다.

GitHub README는 저장소 안의 mp4를 인라인 플레이어로 보여 주지 않습니다. 그래서 README에는 움직이는 WebP를 넣고, 누르면 영상 파일로 가게 했습니다. README 안에서 바로 재생되게 하려면 GitHub 웹에서 README를 편집할 때 `maestro-web-showreel-web.mp4`를 끌어다 놓으세요. 그러면 `user-attachments` 주소가 만들어지고 그 자리에 플레이어가 나옵니다.

## 다시 만들기

필요한 것: macOS의 Google Chrome(다른 경로는 `CHROME` 환경 변수로 지정), ffmpeg, Node. 게임 빌드(`npm run game`)에는 Vite 8 때문에 **Node 20.19+ 또는 22.12+**가 필요합니다.

```bash
cd showreel
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run fonts                 # 폰트 받기 (약 20MB)
npm run game                  # 캡처용 게임 빌드 (Node 22.12+)
npm run capture               # 게임 화면 캡처: perfect 1801장 + fail 571장, 약 1.1GB
npm run preview -- 1.6,8.5,19 # 곡 시간 기준 정지 화면 → preview/
npm run build                 # 음원 믹스 → 모션 블러 렌더(M2 기준 약 16분) → mp4 → 웹용 mp4·webp
```

문구나 타이밍만 바꿀 때는 `reel.js`를 고치고 `npm run preview`로 확인한 다음 `npm run build`를 실행하면 됩니다. `data.js`는 채보나 음원이 바뀔 때만 `npm run data`로 다시 만듭니다.

### 렌더링 방식

- **모션 블러**: 출력 프레임마다 서브프레임 4장(180° 셔터, ±0.19프레임)을 찍고 ffmpeg `tmix`로 평균합니다.
- **색**: 청크는 ffmpeg 기본값인 BT.601 행렬로 변환되므로 `assemble.sh`에서 BT.709로 바꾸고 태그를 붙입니다.
- **게임 캡처**: `performance.now`, `requestAnimationFrame`, 타이머, `AudioContext.currentTime`을 가상 시간으로 바꿔 1/60초씩 진행시키므로, 렌더링 속도와 상관없이 음악과 정확히 맞습니다.
- **음원**: -12.6 LUFS, 트루 피크 -0.9 dBTP.

## 주의

음원은 원작 게임 에셋에서 가져온 녹음입니다. 베르디의 곡 자체는 퍼블릭 도메인이지만 녹음의 권리는 따로 있을 수 있으니, 영상을 공개하기 전에 확인하세요.
