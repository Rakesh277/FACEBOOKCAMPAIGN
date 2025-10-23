import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import './ProtectedRoute.css'; // ✅ External CSS for error banner

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ Optional loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    } else {
      console.warn('🔒 No token found in ProtectedRoute');
      setShowError(true);
    }

    setCheckingAuth(false); // ✅ Done checking
  }, []);

  // ✅ Show loading spinner or fallback while checking auth
  if (checkingAuth) {
    return (
      <div className="auth-loading">
        Checking authentication...
      </div>
    );
  }

  // ✅ Redirect if no token
  if (!token) {
    return (
      <>
        {showError && (
          <div className="error-banner">
            ⚠️ Session expired or unauthorized access. Please log in again.
          </div>
        )}
        <Navigate to="/login" replace />
      </>
    );
  }

  // ✅ Authenticated: render protected content
  return <>{children}</>;
};

export default ProtectedRoute;