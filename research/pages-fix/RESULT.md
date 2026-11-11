# /bam/ GitHub Pages 404 진단·수정

## 공개 서버에서 확인한 사실
- https://storykim1980-crypto.github.io/bam/ 및 /bam/ko/ 요청은404입니다.
- 현재 공개 저장소는 https://github.com/storykim1980-crypto/bam 이며 기본 브랜치는 main입니다.
- 사용자 정의 배포 실행 https://github.com/storykim1980-crypto/bam/actions/runs/43006346803 은 빌드·데이터·디자인 검증에는 성공했지만 actions/configure-pages 단계에서 실패했습니다. artifact 업로드와 deploy는 실행되지 않았습니다.
- 실패 주석은 Pages site Not Found 및 Pages를 GitHub Actions로 설정했는지 확인하라는 내용입니다.
- 이후 별도 pages build and deployment 실행은 성공으로 표시되지만, 저장소 루트에는 index.html이 없고 정적 결과는 static-site 하위에 있습니다. 루트를 그대로 게시하는 방식은 새 소스의 dist 결과 게시와 다릅니다.
- 기존 package.json은 /bam-night로 하드코딩되어 현재 저장소 /bam과 다릅니다.

## 로컬 수정
1. tools/build-pages.mjs를 추가했습니다. GitHub Actions에서는 GITHUB_REPOSITORY의 저장소 이름을 자동 감지하고, 로컬에서는 /bam을 기본 경로로 사용합니다.
2. npm run build:pages가 위 래퍼를 실행하도록 수정했습니다.
3. 워크플로는 Pages 설정을 먼저 확인한 뒤 현재 소스를 빌드하고 dist만 게시합니다.
4. 새 정적 결과의 루트 index.html, /bam/ja/ 이동,3언어, 이미지·메뉴·폼 경로를 확인했습니다.
5. 관련 배포 설명서와 기본 QA 경로를 /bam에 맞췄습니다.

## 검증
- 새 빌드175페이지+404, 실패0.
- 실제 HTML 내부 참조10,058개 확인: 누락0, /bam-night로 남은 내부 링크0.
- dist/data/catalog.json의 매장22곳 확인.
- 원격 push, 저장소 설정 변경, 실제 GitHub 배포는 수행하지 않았습니다. 따라서 원격404가 이미 해결되었다고 주장하지 않습니다.

## 소유자가 해야 하는 설정
1. https://github.com/storykim1980-crypto/bam/settings/pages → Source를 GitHub Actions로 선택합니다.
2. 수정된 package.json, tools/build-pages.mjs, .github/workflows/deploy.yml 등을 저장소에 반영합니다.
3. https://github.com/storykim1980-crypto/bam/actions 에서 Build and deploy current source to GitHub Pages → Run workflow를 실행합니다.
4. build와 deploy 둘 다 성공한 뒤 https://storykim1980-crypto.github.io/bam/ko/ 를 확인합니다.

GitHub Pages 루트 URL은 dist/index.html이 게시되어야 열립니다. static-site 폴더를 그대로 루트 아래에 올리는 것과 다릅니다. 외부 정적 산출물을 직접 게시하는 경우 static-site 안의 파일들이 게시 루트가 되어야 합니다.
