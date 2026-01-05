import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Check for Kakao API key
if (!import.meta.env.VITE_KAKAO_APP_KEY) {
  console.error(
    'VITE_KAKAO_APP_KEY is missing. Please create a .env file with VITE_KAKAO_APP_KEY=YOUR_KAKAO_JAVASCRIPT_KEY'
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);