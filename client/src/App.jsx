import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminTeas from './pages/Admin/AdminTeas';
import AdminUsers from './pages/Admin/AdminUsers';

export default function App() {
  return (
    <div className="min-h-screen bg-paper paper-texture">
      <Navbar />
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="teas" element={<AdminTeas />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
