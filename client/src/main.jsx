import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SeasonProvider } from './contexts/SeasonContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SeasonProvider>
          <App />
          <Toaster position="top-center" toastOptions={{
            style: { background: '#faf6f0', color: '#3d3d3d', fontFamily: '"Noto Sans SC", sans-serif' }
          }} />
        </SeasonProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
