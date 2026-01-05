declare namespace kakao {
  const maps: typeof import('./kakao.maps').maps
}

declare module './kakao.maps' {
  export const maps: typeof window.kakao.maps
}

declare const kakao: typeof window.kakao
