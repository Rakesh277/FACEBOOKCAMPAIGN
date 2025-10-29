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
    phone: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, phone } = form;
    if (!name || !email || !password || !phone) {
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
      phone: '',
    });
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
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>Submit</button>
            <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}