# BAM-NIGHT — Reference design / connected catalog

첨부 디자인을 기준으로 차콜·골드 UI와 실제 카탈로그 연결을 구현한 버전입니다.

## 실행

Node.js20 이상:

```bash
npm ci
npm start
```

브라우저에서 `http://localhost:3000/ko/`를 엽니다.

## 데이터 기준

- 단일 편집 원본: `research/venues.json` —22곳(스낙크8/걸즈바7/비성적 릴랙세이션7).
- 컴파일: `npm run research:compile`
- 공통 읽기 모델: `src/data/catalog.mjs`
- Node 읽기 API: `/api/catalog`, `/data/catalog.json`
- 정적 읽기 파일: 빌드된 `dist/data/catalog.json`
- 기존 CSV의 미검토 레코드를 자동 병합하지 않습니다.
- MySQL 등 외부 DB 연결이나 계정 서버를 설치한 것이 아닙니다. GitHub Pages에서도 작동하도록 JSON 카탈로그를 사용합니다.

## 기능

매장명·업종·지역 검색, 중복 없는 홈 매장 목록,3언어, 관심 매장 저장·해제, 최대3곳 비교, 상세 링크 복사, 지도·공식 채널 링크, 출처 노트, 첫 방문 가이드, 모바일 메뉴.

저장·비교는 이 브라우저 localStorage만 사용합니다. 서버 저장·기기 간 동기화는 없습니다. 실제 예약·결제·후기 제출·24시간 상담은 제공하지 않습니다.

이미지는 시안 참고 이미지와 AI 공통 일러스트이며 실제 매장 사진이 아닙니다. 원본 이미지의 제3자 공개·상업 이용 권리는 게시 전 별도 확인해야 합니다.

## 빌드·검사

```bash
npm run research:validate
npm run bundle
npm run build:pages
# 산출물: dist/, 프로젝트 경로 /bam-night 대응
```

브라우저 검사:

```bash
npx playwright install chromium
# npm start를 별도 터미널에서 실행한 뒤
npm run qa:design
```

검사 결과: `research/redesign2/RESULT.md`, `qa-result.json`, `static-links.json`.

## GitHub Pages

수정된 소스와 `.github/workflows/deploy.yml`을 함께 반영해야 합니다. 저장소 Settings → Pages → Source는 **GitHub Actions**로 선택합니다. 새 워크플로는 옛 루트 HTML을 복사하지 않고 매번 소스에서 빌드한 `dist/`만 게시합니다.

이 작업에서는 원격 push나 배포를 실행하지 않았습니다. 상세 절차: `DEPLOY-GITHUB-PAGES.md`.
