import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaceStore } from '../../store/placeStore';

export function PlacesListScreen() {
  const navigate = useNavigate();
  const { places, isLoading, refreshPlaces } = usePlaceStore();

  useEffect(() => {
    refreshPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          저장된 장소
        </h1>
        <button
          onClick={() => navigate('/')}
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
          맵
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {places.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            아직 저장된 장소가 없습니다.
            <br />
            맵에서 우클릭하여 장소를 추가하세요.
          </div>
        ) : (
          <div>
            {places.map((place) => (
              <div
                key={place.id}
                onClick={() => navigate(`/places/${place.id}`)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span style={{ fontSize: '2rem' }}>{place.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {place.note}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                    }}
                  >
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}