import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { Place } from '../../core/model/Place';
import { usePlaceStore } from '../../store/placeStore';
import { Header } from '../../components/Header';

declare global {
  interface Window {
    kakao: any;
  }
}

export function PlaceDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlace } = usePlaceStore();
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerId = 'detail-map';

  const { map, isLoaded } = useKakaoMap(
    mapContainerId,
    place ? { lat: place.latitude, lng: place.longitude } : { lat: 37.5665, lng: 126.978 },
    4
  );

  useEffect(() => {
    const loadPlace = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const placeId = parseInt(id, 10);
        const foundPlace = await getPlace(placeId);
        setPlace(foundPlace);
      } catch (error) {
        console.error('Error loading place:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlace();
  }, [id, getPlace]);

  // Add marker to map
  useEffect(() => {
    if (!map || !isLoaded || !place || !window.kakao) return;

    const markerPosition = new window.kakao.maps.LatLng(
      place.latitude,
      place.longitude
    );
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: map,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${place.emoji} ${place.note}</div>`,
    });
    infowindow.open(map, marker);

    return () => {
      marker.setMap(null);
    };
  }, [map, isLoaded, place]);

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          불러오는 중...
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9fafb',
        }}
      >
        <Header title="장소 상세" showBack onBack={() => navigate('/places')} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              fontSize: '1rem',
              color: '#6b7280',
            }}
          >
            장소를 찾을 수 없습니다
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(place.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(place.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <Header title="장소 상세" showBack onBack={() => navigate('/places')} />

      <div
        id={mapContainerId}
        style={{
          height: '280px',
          width: '100%',
          flexShrink: 0,
        }}
      ></div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <div
            style={{
              fontSize: '4rem',
              lineHeight: 1,
            }}
          >
            {place.emoji}
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '0.5rem',
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {place.note}
            </h2>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
              }}
            >
              {formattedDate} {formattedTime}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              위치
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'monospace',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #f3f4f6',
              }}
            >
              {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              저장 정보
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #f3f4f6',
              }}
            >
              이 장소는 브라우저의 IndexedDB에 로컬로 저장되었습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}