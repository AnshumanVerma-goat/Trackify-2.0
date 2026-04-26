import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../api';
import AppLayout from '../components/AppLayout';

export default function MainLayout() {
  const [user, setUser] = useState<any>(null);
  const [pref, setPref] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const userRes = await api.get('/user/me?t=' + Date.now());
        setUser(userRes.data);
        const prefRes = await api.get('/user/preferences?t=' + Date.now());
        setPref(prefRes.data);
      } catch (e) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    loadData();
  }, [navigate]);

  if (!user) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <AppLayout user={user}>
      <Outlet context={{ user, pref, setUser, setPref }} />
    </AppLayout>
  );
}
