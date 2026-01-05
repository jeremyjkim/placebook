import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: '0.5rem',
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem 1.5rem',
          color: isActive('/') ? '#6366f1' : '#6b7280',
          transition: 'color 0.2s',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive('/') ? '#6366f1' : '#6b7280'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: isActive('/') ? 600 : 400,
          }}
        >
          지도
        </span>
      </button>

      <button
        onClick={() => navigate('/places')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem 1.5rem',
          color: isActive('/places') ? '#6366f1' : '#6b7280',
          transition: 'color 0.2s',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive('/places') ? '#6366f1' : '#6b7280'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: isActive('/places') ? 600 : 400,
          }}
        >
          목록
        </span>
      </button>
    </nav>
  );
}