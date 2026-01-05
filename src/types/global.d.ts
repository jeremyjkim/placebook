/// <reference types="vite/client" />

declare const kakao: any

interface Window {
  kakao: any
}

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
