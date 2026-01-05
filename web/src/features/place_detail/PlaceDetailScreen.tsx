import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { Place } from '../../core/model/Place';
import { usePlaceStore } from '../../store/placeStore';

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
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>장소를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const formattedDate = new Date(place.createdAt).toLocaleString('ko-KR');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '1rem',
          backgroundColor: '#14b8a6',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
          장소 상세
        </h1>
        <button
          onClick={() => navigate('/places')}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          목록
        </button>
      </header>

      <div id={mapContainerId} style={{ height: '320px', width: '100%' }}></div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {place.emoji}
        </div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          {place.note}
        </h2>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
          }}
        >
          저장일: {formattedDate}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1rem',
          }}
        >
          위치: {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          IndexedDB에 로컬로 저장되었습니다.
        </div>
      </div>
    </div>
  );
}