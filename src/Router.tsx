import { useState, useEffect } from 'react';
import App from './App';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route matching - admin routes
  if (currentPath === '/admin') {
    return <AdminLogin />;
  }

  if (currentPath === '/admin-dashboard') {
    return <AdminDashboard />;
  }

  // Default route - valentine app
  return <App />;
}
