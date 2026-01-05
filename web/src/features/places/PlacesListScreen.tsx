import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaceStore } from '../../store/placeStore';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';

export function PlacesListScreen() {
  const navigate = useNavigate();
  const { places, isLoading, refreshPlaces } = usePlaceStore();

  useEffect(() => {
    refreshPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#f9fafb',
      }}
    >
      <Header title="저장된 장소" />
      
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          paddingBottom: 'calc(80px + 1rem)',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4rem 2rem',
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
        ) : places.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
              }}
            >
              📍
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: '#374151',
              }}
            >
              아직 저장된 장소가 없습니다
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
              }}
            >
              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                ? '지도를 길게 눌러 장소를 추가해보세요'
                : '지도에서 우클릭하여 장소를 추가해보세요'}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {places.map((place) => {
              const formattedDate = new Date(place.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <div
                  key={place.id}
                  onClick={() => navigate(`/places/${place.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2.5rem',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {place.emoji}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '0.5rem',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        {place.note}
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: '#9ca3af',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {formattedDate}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#d1d5db',
                          fontFamily: 'monospace',
                        }}
                      >
                        {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        marginTop: '0.25rem',
                      }}
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}