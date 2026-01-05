export function safeEnv() {
  const kakaoKey = import.meta.env.VITE_KAKAO_MAP_KEY
  return { kakaoKey }
}
