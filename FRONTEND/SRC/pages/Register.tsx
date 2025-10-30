import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import styles from './Register.module.css'; // ✅ CSS Module
import Layout from '../components/layout/Layout'; // ✅ Import shared layout

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword:'',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmpassword } = form;
    if (!name || !email || !password || confirmpassword ) {
      alert('All fields are required');
      return;
    }

    try {
      await axios.post('/api/auth/register', form);
      alert('Registered successfully');
      navigate('/login'); // ✅ Redirect to login after success
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';

      if (message.toLowerCase().includes('already')) {
        alert('Email already registered. Redirecting to login...');
        navigate('/login'); // ✅ Redirect if already registered
      } else {
        alert(message);
      }
    }
  };

  const handleCancel = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      confirmpassword:'',
    });
  };
  const handleGoogleSignup = () => {
    alert('Google Signup Clicked (Auth Later)');
  };

  return (
    <Layout>
      <div className={styles.registerWrapper}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h2 className={styles.formTitle}>Register</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label htmlFor="email">Email</label>
          
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          placeholder="Enter a valid email address"
/>


          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <div className="form-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <input
    id="confirmPassword"
    type="password"
    name="confirmPassword"
    placeholder="Re-enter your password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
  />
</div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>Submit</button>
            <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
          </div>
        
          <div className={styles.divider}>OR</div>
          <button type="button" className={styles.googleBtn} onClick={handleGoogleSignup}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Sign Up with Google"
            />
          </button>
          <p className={styles.loginLink}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
      </Layout>
    
  );
}







