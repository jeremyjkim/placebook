import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { usePlaceStore } from '../../store/placeStore';

declare global {
  interface Window {
    kakao: any;
  }
}

const EMOJI_OPTIONS = ['📍', '🌟', '🏞️', '🍴', '🎯'];

export function MapScreen() {
  const navigate = useNavigate();
  const { map, isLoaded, error: mapError } = useKakaoMap('map', { lat: 37.5665, lng: 126.978 });
  const { places, addPlace, refreshPlaces } = usePlaceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [note, setNote] = useState('');
  const markersRef = useRef<any[]>([]);
  const tempMarkerRef = useRef<any>(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (map && window.kakao) {
            const moveLatLon = new window.kakao.maps.LatLng(pos.lat, pos.lng);
            map.setCenter(moveLatLon);
            map.setLevel(4);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Seoul if location fails (already set in useKakaoMap)
        }
      );
    }
  }, [map]);

  // Add markers for saved places
  useEffect(() => {
    if (!map || !isLoaded || !window.kakao) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each place
    places.forEach((place) => {
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

      window.kakao.maps.event.addListener(marker, 'click', () => {
        navigate(`/places/${place.id}`);
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      markersRef.current.push(marker);
    });
  }, [map, isLoaded, places, navigate]);

  // 장소 추가 핸들러 (공통 함수)
  const handleAddPlaceAtPosition = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    setIsDialogOpen(true);
    setNote('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);

    // Show temporary marker
    if (tempMarkerRef.current && map) {
      tempMarkerRef.current.setMap(null);
    }
    if (map && window.kakao) {
      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      tempMarkerRef.current = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
        zIndex: 1000,
      });
    }
  };

  // Handle map right click / long press (데스크톱: 우클릭, 모바일: 롱프레스)
  useEffect(() => {
    if (!map || !isLoaded || !window.kakao) return;

    let touchTimer: ReturnType<typeof setTimeout> | null = null;
    let touchStartLatLng: { lat: number; lng: number } | null = null;

    const handleContextMenu = (e: any) => {
      const latlng = e.latLng;
      if (latlng) {
        const lat = latlng.getLat();
        const lng = latlng.getLng();
        handleAddPlaceAtPosition(lat, lng);
      }
    };

    // 데스크톱: 우클릭
    window.kakao.maps.event.addListener(map, 'rightclick', handleContextMenu);

    // 모바일: 롱프레스 처리
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      const handleTouchStart = () => {
        touchTimer = setTimeout(() => {
          // 롱프레스 감지 (500ms 이상)
          if (touchStartLatLng) {
            handleAddPlaceAtPosition(touchStartLatLng.lat, touchStartLatLng.lng);
            touchStartLatLng = null;
          }
        }, 500);
      };

      const handleTouchEnd = () => {
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }
        touchStartLatLng = null;
      };

      const handleTouchMove = () => {
        // 터치 이동 시 롱프레스 취소
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
        }
        touchStartLatLng = null;
      };

      // 클릭 이벤트로 터치 위치 저장 (Kakao Maps API 사용)
      const handleClick = (e: any) => {
        const latlng = e.latLng;
        if (latlng) {
          touchStartLatLng = { lat: latlng.getLat(), lng: latlng.getLng() };
        }
      };

      window.kakao.maps.event.addListener(map, 'click', handleClick);
      mapContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      mapContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
      mapContainer.addEventListener('touchmove', handleTouchMove, { passive: true });

      return () => {
        window.kakao.maps.event.removeListener(map, 'rightclick', handleContextMenu);
        window.kakao.maps.event.removeListener(map, 'click', handleClick);
        mapContainer.removeEventListener('touchstart', handleTouchStart);
        mapContainer.removeEventListener('touchend', handleTouchEnd);
        mapContainer.removeEventListener('touchmove', handleTouchMove);
        if (touchTimer) {
          clearTimeout(touchTimer);
        }
      };
    }

    return () => {
      window.kakao.maps.event.removeListener(map, 'rightclick', handleContextMenu);
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
    };
  }, [map, isLoaded]);

  const handleSavePlace = async () => {
    if (!selectedPosition || !note.trim() || note.length > 80) {
      alert('Note must be 1-80 characters.');
      return;
    }

    try {
      await addPlace(
        selectedPosition.lat,
        selectedPosition.lng,
        selectedEmoji,
        note.trim()
      );
      setIsDialogOpen(false);
      setSelectedPosition(null);
      if (tempMarkerRef.current) {
        tempMarkerRef.current.setMap(null);
        tempMarkerRef.current = null;
      }
      await refreshPlaces();
    } catch (error) {
      alert('Failed to save place: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPosition(null);
    if (tempMarkerRef.current) {
      tempMarkerRef.current.setMap(null);
      tempMarkerRef.current = null;
    }
  };

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
          Placebook
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

      {mapError ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            color: '#ef4444',
          }}
        >
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
            지도를 불러올 수 없습니다
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{mapError}</p>
        </div>
      ) : (
        <div id="map" style={{ flex: 1, width: '100%', minHeight: 0 }}></div>
      )}

      {isDialogOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            padding: '1.5rem',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              새 장소
            </h2>
            <button
              onClick={handleCloseDialog}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    fontSize: '1.5rem',
                    padding: '0.5rem',
                    border: `2px solid ${
                      selectedEmoji === emoji ? '#14b8a6' : '#e5e7eb'
                    }`,
                    borderRadius: '0.5rem',
                    background: selectedEmoji === emoji ? '#f0fdfa' : 'white',
                    cursor: 'pointer',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="note"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              메모
            </label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
              placeholder="한 문장으로 작성"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {note.length}/80
            </div>
          </div>

          <button
            onClick={handleSavePlace}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#14b8a6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            저장
          </button>

          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
              ? '맵을 길게 눌러(롱프레스) 핀 위치를 변경할 수 있습니다.'
              : '맵에서 우클릭하여 핀 위치를 변경할 수 있습니다.'}
          </div>
        </div>
      )}
    </div>
  );
}