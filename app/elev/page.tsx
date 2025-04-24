'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Elev.module.css';
import AccBar from './AccBar';
import { Button } from '@mui/material';

export default function Elev() {


  interface Tema {
    idtema: number;
    datatrimitere: string;
    status: string;
    document: string;
    rezolvare: string | null;
    feedback: string | null;
  }

  const [teme, setTeme] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeme = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/elevi/teme/', {
          withCredentials: true,
        });
        setTeme(response.data);
      } catch (err) {
        console.error('Eroare la preluarea temelor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeme();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AccBar />
      <h1 className={styles.pageTitle}>Panoul elevului</h1> {/* Added title here */}
      <h2 className={styles.tableTitle}>Teme primite</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nr. crt.</th>
            <th>Data trimitere</th>
            <th>Status</th>
            <th>Document</th>
            <th>Rezolvare</th>
            <th>Feedback</th>
            <th>Opțiuni</th>
          </tr>
        </thead>
        <tbody>
          {teme.map((tema, index) => (
            <tr key={tema.idtema}>
              <td>{index + 1}</td>
              <td>{new Date(tema.datatrimitere).toLocaleDateString()}</td>
              <td>{tema.status}</td>
              <td>
                <a href={`${tema.document}`} target="_blank" rel="noopener noreferrer">
                  Vizualizează
                </a>
              </td>
              <td>
                {tema.rezolvare ? (
                  <a href={`${tema.rezolvare}`} target="_blank" rel="noopener noreferrer">
                    Vizualizează
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>{tema.feedback || '-'}</td>
              <td>
                <Button variant="outlined" size="small" disabled>Încarcă</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
