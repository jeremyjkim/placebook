import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import { usePlaceStore } from '../../store/placeStore';
import { BottomNav } from '../../components/BottomNav';

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
      alert('메모는 1-80자 사이여야 합니다.');
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
      alert('장소 저장에 실패했습니다: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
        <>
          {/* Backdrop */}
          <div
            onClick={handleCloseDialog}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1000,
            }}
          />
          {/* Dialog */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '1.5rem',
              borderTopRightRadius: '1.5rem',
              padding: '1.5rem',
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
              boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 1001,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                새 장소 추가
              </h2>
              <button
                onClick={handleCloseDialog}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '0.875rem',
                }}
              >
                이모지
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    style={{
                      fontSize: '2rem',
                      padding: '0.75rem',
                      border: `2px solid ${selectedEmoji === emoji ? '#6366f1' : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      background: selectedEmoji === emoji ? '#f0f0ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="note"
                style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontWeight: 500,
                  color: '#374151',
                  fontSize: '0.875rem',
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
                placeholder="이 장소에 대한 짧은 메모를 입력하세요"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
              />
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginTop: '0.5rem',
                  textAlign: 'right',
                }}
              >
                {note.length}/80
              </div>
            </div>

            <button
              onClick={handleSavePlace}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6366f1';
              }}
            >
              저장하기
            </button>

            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
                textAlign: 'center',
              }}
            >
              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                ? '맵을 길게 눌러 위치를 변경할 수 있습니다'
                : '맵에서 우클릭하여 위치를 변경할 수 있습니다'}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}