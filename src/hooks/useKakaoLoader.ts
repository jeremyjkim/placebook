import { useEffect, useState } from 'react'
import { safeEnv } from '../utils/env'

type LoaderState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  error?: string
}

const KAKAO_SDK_URL = 'https://dapi.kakao.com/v2/maps/sdk.js'

export function useKakaoLoader() {
  const [state, setState] = useState<LoaderState>({ status: 'idle' })
  const { kakaoKey } = safeEnv()

  useEffect(() => {
    if (!kakaoKey) {
      setState({ status: 'error', error: 'Missing Kakao map key. Set VITE_KAKAO_MAP_KEY.' })
      return
    }

    if (typeof window === 'undefined') return

    if (window.kakao && window.kakao.maps) {
      setState({ status: 'ready' })
      return
    }

    const existingScript = document.querySelector(`script[src*="${KAKAO_SDK_URL}"]`) as HTMLScriptElement | null
    if (existingScript) {
      existingScript.addEventListener('load', () => setState({ status: 'ready' }))
      existingScript.addEventListener('error', () => setState({ status: 'error', error: 'Failed loading Kakao SDK' }))
      return
    }

    const script = document.createElement('script')
    script.src = `${KAKAO_SDK_URL}?appkey=${kakaoKey}&autoload=false&libraries=services` 
    script.async = true
    script.addEventListener('load', () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => setState({ status: 'ready' }))
      } else {
        setState({ status: 'error', error: 'Kakao SDK loaded but maps not available' })
      }
    })
    script.addEventListener('error', () => setState({ status: 'error', error: 'Failed loading Kakao SDK' }))
    document.head.appendChild(script)

    setState({ status: 'loading' })

    return () => {
      script.removeEventListener('load', () => {})
      script.removeEventListener('error', () => {})
    }
  }, [kakaoKey])

  return state
}
