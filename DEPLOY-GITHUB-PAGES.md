# GitHub Pages 반영 방법

대상 저장소: https://github.com/storykim1980-crypto/bam

## 중요한 변경

이전 워크플로는 `v28-light-menu`와 옛 루트 HTML을 게시했습니다. 이번 파일의 `.github/workflows/deploy.yml`은 현재 소스로 `npm run build:pages`를 실행하고 `dist/`만 게시합니다. 디자인 소스만 업로드하고 워크플로를 바꾸지 않으면 옛 화면이 유지될 수 있습니다.

## 권장: 인증된 PC에서 소스 반영

1. GitHub 저장소를 PC로 clone합니다.
2. 제공된 ZIP의 `bam-night/` 안에 있는 소스 파일을 해당 저장소 폴더에 덮어씁니다. 숨김 폴더 `.github`도 포함합니다.
3. 변경 내용을 검토합니다. 이 패키지의 `static-site/`는 참고용 정적 산출물이며 자동 배포에는 필요하지 않습니다.
4. 터미널에서 실행합니다.

```bash
npm ci
npm run research:validate
npm run bundle
npm run build:pages
git status
git add .
git commit -m "Connect reference design to canonical venue catalog"
git push
```

5. 저장소 Settings → Pages → Build and deployment → Source에서 **GitHub Actions**를 선택합니다.
6. Actions에서 **Build and deploy current source to GitHub Pages**의 성공 여부를 확인합니다. 수동 실행도 가능합니다.
7. https://storykim1980-crypto.github.io/bam/ko/ 에서 확인합니다.

이 문서는 실행 절차입니다. 여기서 push·배포가 실제 완료되었다는 뜻이 아닙니다. 계정 인증은 사용자 PC의 GitHub 로그인/credential manager로 진행하며 비밀번호·토큰을 채팅에 보내지 마세요.

## 배포 전 주의

- 호스팅 환경의 Pages/Actions 사용 권한과 저장소 설정은 소유자가 확인해야 합니다.
- 시안 이미지의 외부 공개·상업 이용 권한을 권리자에게 확인해야 합니다.
- 등록22곳은 현재 영업·허가를 직접 확인한22곳이 아닙니다. 자료 확인일과 불확실성을 그대로 표시합니다.

## 404 수정 확인 사항

Settings → Pages → Source에서 GitHub Actions를 선택하고 저장한 뒤 Actions → Build and deploy current source to GitHub Pages → Run workflow를 실행하세요. `configure-pages`가 성공하고 deploy 단계까지 성공해야 실제 사이트가 바뀝니다. Actions의 build 성공만으로 배포 완료는 아닙니다.

현재 저장소 이름 bam에 맞춰 빌드 기본 경로를 /bam으로 고쳤습니다. GitHub Actions에서는 저장소 이름을 자동 감지합니다. 정적 산출물을 사용할 경우 static-site 폴더 자체가 아니라 그 안의 index.html, ja/, ko/, en/, images/ 등이 게시 루트에 있어야 합니다.
