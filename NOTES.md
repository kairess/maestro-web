# 구조 분석 노트

- 핸드 트래킹 플러그인은 `JJ_HandTracking`, `JJ_HMD`, OpenXR이다.

## 2. 오디오
- FMOD와 Wwise는 쓰지 않는다. UE 네이티브 `SoundCue`/`SoundWave`를 쓴다.
- **파트별 스템이 없다.** 곡마다 스테레오 믹스 1개가 있고, 포맷은 Ogg Vorbis 44.1/48kHz다. SoundWave의 uexp 안에 인라인으로 들어 있다.
- 곡 SoundCue는 `SoundNodeParamCrossFade`(`Fade` 파라미터)로 입력 2개를 섞는다.
  - Verdi만 실제로 `<곡>_Fail`이라는 망가진 연주 음원이 따로 있다. 판정이 나쁘면 이쪽으로 섞인다.
- `charts/*.json`의 `audio` 필드에 각 채보가 쓰는 음원 경로가 들어 있다. 채보 시각은 음원 0초 기준이다.
- 싱크를 검증했다(Verdi Hard, 음원의 어택 강도와 채보 시점을 교차상관으로 비교).
  - 최적 지연은 악센트 0ms, 전체 제스처와 비트 그리드 +5ms다. 따라서 **오프셋 없이 음원에 바로 맞는다**.
  - 악센트 시점의 어택 강도는 평균의 1.67배로, 강타 음에 정확히 찍혀 있다.
- 섹션별 반응(연주자 애니메이션)은 오디오가 아니라 **커브 데이터**로 연출한다(4절).

## 4. 채보 포맷: `ScoreAsset`
| 필드 | 타입 | 의미 |
|---|---|---|
| `Sound` | SoundCue | 정상/Fail 크로스페이드 큐 |
| `Beats` | float[] | **박마다의 절대 시각(초)**. 템포 맵 역할 |
| `ScoreBeats` | ScoreBeat[] | 지휘 제스처 노트 |
| `ScoreCues` | {BeatIndex, Instrument} | 왼손 큐(입장 지시) |
| `ScoreDynamics` | {DynamicsType, Instrument, BeatIndexBegin/End} | 크레셴도 등 구간 |
| `ScoreFermatas` | {Instrument, BeatIndexBegin/End} | 페르마타 구간 |
| `ScoreInstruments` | {BeatIndexBegin, Instrument} | 포커스 섹션 전환(시선·조명 대상으로 추정) |
| `ApplauseTime` | float | 박수가 시작되는 시각 |
| `NumInitialBeatsToSkip` | int | 앞부분에서 판정하지 않는 박 수 |
| `Info` | ScoreInfo | 제목 등(StringTable) |
| `HashSignature` | string | 채보 해시(리더보드나 무결성 검사용으로 추정) |

**타이밍 단위**: 이벤트는 초가 아니라 **BeatIndex**(정수)로 적는다. 초는 `Beats[BeatIndex]`로 얻는다.
- `Beats` 간격을 보면 박마다 BPM이 흔들린다. Dies Irae는 144~164bpm이다. 실제 녹음에서 박을 따서(탭 또는 비트트래킹) 만든 **루바토 그리드**다.

### ScoreBeat
```
{ BeatIndex:int, Tokens:EScoreToken[], TokenType:EScoreTokenType }
EScoreToken     = Up(0) Down(1) Left(2) Right(3) DownLeft(4) DownRight(5)
EScoreTokenType = Normal(0) Low(1) Accent(2)
EDynamicsType   = Crescendo Decrescendo Fermata Sustain Contain
```
- `Tokens` 길이 1: 한 손(지휘봉) 방향 스트로크
- `Tokens` 길이 2: **양손 제스처**. 예: `Down/Down`(양손 내리기), `DownLeft/DownRight`(양손 벌리기). `IsTwoHandsScoreBeat`, `IsTwoHandsOrAccentScoreBeat` 가 있어 이 해석을 뒷받침한다.
- `Tokens` 길이 3(`DownRight×3`, `Down×3` 등): 의미를 아직 확정하지 못했다. 모두 Accent 타입에만 나오고, Transcription 초안에 특히 많다.
- `Low`는 Hard 계열에만 나온다. 여린 구간의 작은 제스처로 추정한다(아직 추정).

## 5. 난이도 설계 (Verdi Dies Irae)
| | Easy | Concert(MC) | Hard | Transcription |
|---|---|---|---|---|
| 제스처 수 / 비트 대비 | 198 / 36% | 194 / 35% | 404 / 73% | 516 / 93% |
| Normal / Low / Accent | 160/0/38 | 146/0/48 | 240/120/44 | 80/156/280 |
| Cue 수 | 43 | 40 | 70 | 75 |
| 다이내믹스 | 20 | 20 | 26 | 21 |

- Hard는 **정통 지휘 도형**을 그대로 쓴다. 4박은 `Down→Left→Right→Up`, 2박은 `Down→Up`이다.
- Easy는 같은 구간을 `Down↔Up`으로 줄이거나 비운다. 페르마타 중에는 제스처가 없다.
- **게임화된 부분**(리뷰어가 지적한 점): 도입부 `Down/Down`, `DnL/DnR` 악센트가 박자 도형이 아니라 **오케스트라 강타 타이밍(0, 2, 4, 6, 8박)**에만 찍혀 있다. 박자를 젓는 대신 악센트 음을 치게 만든 설계다.
- Transcription은 거의 모든 박에 제스처를 둔다. 이것을 줄여서 Easy와 Hard를 만든 것으로 보인다.

## 6. 판정 파라미터: `GameLogic/Settings/ScoringSettings`
(단위는 cm이므로 속도는 cm/s로 추정)
```
GestureSettings
  TimeTolerancy              0.2 s     ← 제스처 타이밍 허용치(±로 추정)
  GestureCenterInterpSpeed   3.0       ← 지휘 중심점이 손 위치를 천천히 따라감
  NumSubSamples              35
  GestureTolerancy           Speed ≥ 75,  Angle ±35°   (Normal)
  AccentGestureTolerancy     Speed ≥ 150, Angle ±35°   (Accent: 2배 빠르게)
  FirstTokenGestureTolerancy Speed ≥ 250, Angle ±25°   (첫 박: 가장 엄격)
  FirstTokenValidationTimeBuffer 0.5 s
  CueingGestureTolerancy
    HMDToHandDistance 26, Angle ±45°, Planar ±35°, TimeTolerancy 0.3 s
    DisplayAnticipation 1.5 s   ← 큐를 1.5초 먼저 표시("미리 주는 큐")
    PseudoIndexLocation (11,0,-3) ← 손 → 가상 검지 끝 오프셋
DynamicsSettings
  DisplayAnticipation 2.5 s
  CrescendoValidationAngle -160°, FermataValidationAngle -160°  ← 손바닥 방향(롤) 조건
  In/OutHandAngleTolerance 25° / 50°
  VerticalSpeedToScore_Crescendo   [2.0, 7.5]   ← 손을 올리는 속도를 점수로 매핑
  VerticalSpeedToScore_Decrescendo [-2.0, -7.5]
  SpeedComputeTimeWindow 0.5 s
FermataSettings.DisplayAnticipation 1.5 s
Left/RightTipRelativeLocation (30,±20,-18) ← 컨트롤러 → 지휘봉 끝 오프셋
```
없는 파라미터가 있다: `EvaluationWindow`, `FailedBeatTolerance`, `LastBeatTolerance`, `AutoValidatedBeatFromEnd`, `FermataEndValidationAngle`.

**설계 요약**: 제스처 하나는 "방향(±35° 원뿔) + 최소 속도 + 시간창(±0.2s)"으로 판정한다. 악센트는 속도 문턱값만 2배로 올린다. 다이내믹스는 손바닥 방향이 게이트 역할을 하고, 수직 속도를 연속 점수로 매핑한다.

## 7. 정식 출시판 채보 (2026-10 교체)
데모 채보(`charts/<이름>.json`)를 정식 출시판(`charts/<곡>/<이름>.json`)으로 교체했다. 분석 결과는 다음과 같다.

- **구성**: 곡마다 `Easy / Medium / Hard / Expert` 와 그 `Flat_` 변형, `MC_` 채보가 있다. `_index.json` 은 21곡의 목록이지만 지금 로컬에는 Verdi 만 있다.
  - `Flat_` 은 원작 플랫 스크린(비 VR) 모드용이다. 노트·큐는 VR 판과 같고(Easy 끝부분 2개만 다름), 다이내믹스·포커스가 가리키는 무대 앵커만 다르다. 웹캠 게임도 플랫 스크린이라 기본값으로 쓴다(`?variant=vr` 로 VR 판).
  - `MC_` 는 노트·큐·다이내믹스가 Easy 와 완전히 같아서 따로 쓰지 않는다.
- **새 필드**: `song_dir`, `flat_screen`, `hash`, `camera_anchor_overrides`, `map`. `fermatas` 목록은 없어졌다.
- **다이내믹스 종류**: `Crescendo`, `Decrescendo` 에 `Sustain`, `Cut`, `Contain` 이 추가됐다.
  - 데모의 페르마타는 `Sustain`(유지) 뒤에 1박짜리 `Cut`(끊기)이 붙는 형태로 바뀌었다.
  - `Contain` 은 오케스트라를 눌러 두는 표현으로 해석했다(손을 차분히, 올리지 않기).
- **무대 앵커**: 다이내믹스·포커스의 `instrument` 는 `Score_400_65`, `Score_Flat_75` 같은 앵커다. 숫자는 지휘대 기준 각도로, 90 이 정면, 작을수록 왼쪽(40 = 왼쪽 합창단), 클수록 오른쪽이다. 실제 연주자는 `musicians` 에 따로 있다.
- **3토큰 제스처**(`Down/Down/Down` 등, 전부 Accent): 원작 영상에서 오른쪽 박자선에 금색 악센트 노트 하나로 나온다. 그래서 오른손 악센트 하나로 판정한다.
- **오디오**: 새 `Verdi_DiesIrae.ogg` 는 데모와 길이·타이밍이 같다(교차상관 지연 0). 80~200초 구간의 믹스만 다르다. 그래서 데모의 `_Fail.ogg` 를 그대로 써도 맞는다. 박 그리드는 같은 연주를 다시 찍은 것이라 200번째 박 부근부터 7박이 늘었다. 새 채보의 노트는 새 음원의 강세 박에 정확히 맞는다.
