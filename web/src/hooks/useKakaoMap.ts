import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

// 전역 스크립트 로딩 상태 관리
let scriptPromise: Promise<void> | null = null;

function loadKakaoMapsScript(): Promise<void> {
  if (scriptPromise) {
    return scriptPromise;
  }

  // 이미 로드되어 있으면 즉시 resolve
  if (window.kakao && window.kakao.maps) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }

  const apiKey = import.meta.env.VITE_KAKAO_APP_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('Kakao Maps API key is missing'));
  }

  // 스크립트가 이미 DOM에 있는지 확인
  const existingScript = document.querySelector(
    `script[src*="dapi.kakao.com/v2/maps/sdk.js"]`
  ) as HTMLScriptElement;

  if (existingScript) {
    // 스크립트가 이미 있으면 로드될 때까지 기다림
    scriptPromise = new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        // 이미 로드 중인 스크립트 기다리기
        const checkLoaded = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);

        // 타임아웃 설정 (10초)
        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error('Timeout waiting for Kakao Maps script to load'));
        }, 10000);
      }
    });
    return scriptPromise;
  }

  // 새 스크립트 생성 및 로드
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // HTTPS 프로토콜 명시
    const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.src = scriptUrl;
    script.async = true;

    const cleanup = () => {
      script.onload = null;
      script.onerror = null;
    };

    script.onload = () => {
      cleanup();
      // 약간의 지연을 두고 kakao 객체 확인
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          scriptPromise = null;
          reject(new Error('Kakao Maps SDK failed to initialize. Please check your API key is a valid JavaScript key.'));
        }
      }, 100);
    };

    script.onerror = (event) => {
      cleanup();
      scriptPromise = null;
      console.error('Failed to load Kakao Maps script from:', scriptUrl);
      console.error('Error event:', event);
      reject(new Error(`Failed to load Kakao Maps script. Please check:
1. Your API key (${apiKey.substring(0, 10)}...) is a valid JavaScript key from Kakao Developers
2. The key is registered for your domain (localhost is allowed in development)
3. Your network connection is working`));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useKakaoMap(
  containerId: string,
  center: { lat: number; lng: number },
  level: number = 4
) {
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadKakaoMapsScript()
      .then(() => {
        if (!isMounted) return;

        window.kakao.maps.load(() => {
          if (!isMounted) return;

          const container = document.getElementById(containerId);
          if (!container) {
            setError(`Container with id "${containerId}" not found`);
            return;
          }

          try {
            const options = {
              center: new window.kakao.maps.LatLng(center.lat, center.lng),
              level: level,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapRef.current = map;
            setIsLoaded(true);
            setError(null);
          } catch (err) {
            console.error('Error initializing map:', err);
            setError('Failed to initialize map');
          }
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error loading Kakao Maps:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Kakao Maps');
      });

    return () => {
      isMounted = false;
    };
  }, [containerId]);

  useEffect(() => {
    if (mapRef.current && isLoaded && window.kakao) {
      try {
        const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
        mapRef.current.setCenter(moveLatLon);
        mapRef.current.setLevel(level);
      } catch (err) {
        console.error('Error updating map center:', err);
      }
    }
  }, [center.lat, center.lng, level, isLoaded]);

  return { map: mapRef.current, isLoaded, error };
}