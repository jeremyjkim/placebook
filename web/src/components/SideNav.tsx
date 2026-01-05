import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaceStore } from '../store/placeStore';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
  const navigate = useNavigate();
  const { places, deletePlace } = usePlaceStore();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    // 모든 폴더 목록 추출 (중복 제거)
    const folderSet = new Set<string>();
    places.forEach((place) => {
      if (place.folderName) {
        folderSet.add(place.folderName);
      }
    });
    setFolders(Array.from(folderSet).sort());
  }, [places]);

  const handleDelete = async (id: number) => {
    if (confirm('이 장소를 삭제하시겠습니까?')) {
      try {
        await deletePlace(id);
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const placesInFolder = selectedFolder
    ? places.filter((p) => p.folderName === selectedFolder)
    : places.filter((p) => !p.folderName);

  const placesToShow = selectedFolder === null ? places : placesInFolder;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1500,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Side Navigation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-320px',
          bottom: 0,
          width: '320px',
          maxWidth: '85vw',
          backgroundColor: '#ffffff',
          zIndex: 1501,
          transition: 'left 0.3s ease',
          boxShadow: isOpen ? '2px 0 8px rgba(0, 0, 0, 0.15)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            장소 관리
          </h2>
          <button
            onClick={onClose}
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

        {/* Folder List */}
        <div
          style={{
            padding: '1rem',
            borderBottom: '1px solid #f3f4f6',
            overflowY: 'auto',
            maxHeight: '200px',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            폴더
          </div>
          <button
            onClick={() => setSelectedFolder(null)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              textAlign: 'left',
              background: selectedFolder === null ? '#f0f0ff' : 'transparent',
              border: `1px solid ${selectedFolder === null ? '#6366f1' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: selectedFolder === null ? '#6366f1' : '#374151',
              fontWeight: selectedFolder === null ? 600 : 400,
            }}
          >
            전체 ({places.length})
          </button>
          {folders.map((folder) => {
            const count = places.filter((p) => p.folderName === folder).length;
            return (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  textAlign: 'left',
                  background: selectedFolder === folder ? '#f0f0ff' : 'transparent',
                  border: `1px solid ${selectedFolder === folder ? '#6366f1' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: selectedFolder === folder ? '#6366f1' : '#374151',
                  fontWeight: selectedFolder === folder ? 600 : 400,
                }}
              >
                📁 {folder} ({count})
              </button>
            );
          })}
        </div>

        {/* Places List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {selectedFolder ? `폴더: ${selectedFolder}` : '전체 장소'} (
            {placesToShow.length})
          </div>
          {placesToShow.length === 0 ? (
            <div
              style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem',
              }}
            >
              장소가 없습니다
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {placesToShow.map((place) => (
                <div
                  key={place.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{place.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#111827',
                          marginBottom: '0.25rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {place.note}
                      </div>
                      {place.folderName && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                          }}
                        >
                          📁 {place.folderName}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(place.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      삭제
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/places/${place.id}`);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    상세보기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}