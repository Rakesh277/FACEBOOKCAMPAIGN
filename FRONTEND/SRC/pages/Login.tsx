import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth'; // centralized API call
import './Login.css';
import Layout from '../components/layout/Layout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({
        email: email.trim(),

        password: password.trim(),
      });

      console.log('✅ Login successful:', response);

      const { token, user } = response;

      if (!token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err: any) {
      const fallback = 'Login failed. Please try again.';
      const message =
        err?.message ||
        err?.response?.data?.message ||
        err?.data?.message ||
        fallback;

      console.warn('❌ Login error:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
  <div className="login-page">
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="forgot-password">
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>

        <div className="social-login">
          <button type="button" className="google-login">Continue with Google</button>
          <button type="button" className="facebook-login">Continue with Facebook</button>
        </div>
      </form>
    </div>
  </div>
</Layout>
  );
};

export default Login;