import { Navigate, Route, Routes } from 'react-router-dom';
import AdminGuard from './components/Admin/AdminGuard';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="h-screen overflow-hidden ink-app">
      <main className="h-full">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </main>
    </div>
  );
}
