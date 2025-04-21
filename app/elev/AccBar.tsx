'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Elev.module.css';

export default function AccBar() {
  const [user, setUser] = useState<{ nume: string; prenume: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/user', {
          withCredentials: true,
        });
        setUser(response.data);

        if (response.data.role === 'profesor') {
          router.replace('/profesor');
        }
      } catch (err: unknown) {
        const axiosError = err as { message?: string };
        console.error('Eroare la obținerea informațiilor despre utilizator:', axiosError?.message || err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
      router.push('/login');
    } catch (err: unknown) {
      const axiosError = err as { message?: string };
      console.error('Eroare la delogare:', axiosError?.message || err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.accBar}>
      <h1>
        Bun venit, {user.nume} {user.prenume}!
      </h1>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}
