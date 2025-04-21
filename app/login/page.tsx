'use client';

import { useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Login() {
  const router = useRouter();  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/check', { withCredentials: true });

        if (response.data.role === 'profesor') {
          router.push('/profesor');
        } else if (response.data.role === 'elev') {
          router.push('/elev');
        }
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.warn("User is not authenticated or token expired:", err.message);
        } else {
          console.warn("Unexpected error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', { email, password }, { withCredentials: true });

      console.log(response.data.message);
      const { role } = response.data;

      if (role === 'profesor') {
        router.push('/profesor');
      } else if (role === 'elev') {
        router.push('/elev');
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "A apărut o eroare la login.");
      } else {
        setError("A apărut o eroare necunoscută.");
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.page_container}>
          <div className={styles.login_window}>
            <h2>Login</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.input_group}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.input_group}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              {error && <div className={styles.error_message}>{error}</div>}
              
              <div className={styles.button_container}>
                <button type="submit" className={styles.login_button}>Login</button>
                <button type="button" className={styles.back_button} onClick={() => router.push('/')}>Înapoi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
