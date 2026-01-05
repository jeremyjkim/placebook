# Placebook Web

지도에 개인 장소를 저장하는 간단한 웹 애플리케이션입니다.

## 기술 스택

- React 18 + TypeScript
- Vite (빌드 도구)
- React Router (라우팅)
- Zustand (상태 관리)
- Kakao Maps JavaScript API (지도)
- IndexedDB (로컬 저장소)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Kakao JavaScript 키를 추가하세요:

```
VITE_KAKAO_APP_KEY=your_kakao_javascript_key_here
```

Kakao Developers 콘솔에서 JavaScript 키를 생성하세요:
1. https://developers.kakao.com/ 접속
2. 내 애플리케이션 선택
3. 앱 키 > JavaScript 키 복사

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 (또는 표시된 포트)로 접속하세요.

### 4. 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 사용 방법

1. **장소 추가**: 지도에서 우클릭하여 장소를 추가할 수 있습니다.
2. **장소 목록**: 상단의 "목록" 버튼을 클릭하여 저장된 모든 장소를 확인할 수 있습니다.
3. **장소 상세**: 목록에서 장소를 클릭하면 상세 정보와 지도 위치를 확인할 수 있습니다.

## 프로젝트 구조

```
src/
  core/
    model/Place.ts           # Place 모델
    repo/placeRepository.ts  # IndexedDB 저장소
  features/
    map/MapScreen.tsx        # 메인 지도 화면
    places/PlacesListScreen.tsx  # 장소 목록 화면
    place_detail/PlaceDetailScreen.tsx  # 장소 상세 화면
  store/
    placeStore.ts            # Zustand 상태 관리
  hooks/
    useKakaoMap.ts           # Kakao Maps 훅
  App.tsx                    # 라우팅 설정
  main.tsx                   # 엔트리 포인트
```

## 주요 기능

- ✅ 지도에서 장소 추가 (우클릭)
- ✅ 이모지와 메모로 장소 저장
- ✅ 저장된 장소 목록 보기
- ✅ 장소 상세 정보 보기
- ✅ 현재 위치 자동 감지
- ✅ IndexedDB를 사용한 로컬 저장

## 참고사항

- 데이터는 브라우저의 IndexedDB에 저장되므로 브라우저를 변경하거나 데이터를 삭제하면 저장된 장소가 사라집니다.
- 위치 권한이 필요합니다. 브라우저에서 위치 권한을 허용해주세요.