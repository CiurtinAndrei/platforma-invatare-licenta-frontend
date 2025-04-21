'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Profesor.module.css';
import AccBar from './AccBar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


type Test = {
  idtest: number;
  tip: string;
  datacreatie: string;
  document: string;
  barem: string;
  titlu?: string;
};


const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Profesor() {
  const [tests, setTests] = useState<Test[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal control and title input
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setError(null);
  };


  const fetchTests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teste/all', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Eroare la obținerea testelor');
      const data: Test[] = await res.json();
      setTests(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error('Unexpected error', err);
        setError('Eroare necunoscută la obținerea testelor');
      }
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);


  const handleGenerateTest = async () => {
    const trimmed = title.trim();
    if (trimmed.length === 0 || trimmed.length > 20) {
      setError('Titlul trebuie să aibă între 1 și 20 de caractere.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8000/api/teste/generate',
        { titlu: trimmed },
        { withCredentials: true }
      );
      handleClose();
      fetchTests();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Eroare la generarea testului');
      } else {
        console.error('Unexpected error', err);
        setError('Eroare necunoscută la generarea testului');
      }
    }
  };

  const handleDeleteTest = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest test?')) return;
    try {
      await axios.post(
        `http://localhost:8000/api/teste/delete/${id}`,
        {},
        { withCredentials: true }
      );
      fetchTests();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Eroare la ștergerea testului');
      } else {
        console.error('Unexpected error', err);
        setError('Eroare necunoscută la ștergerea testului');
      }
    }
  };

  return (
    <div className={styles.container}>
      <AccBar />
      <h1 className={styles.title}>Panoul profesorului</h1>
      {error && <div className={styles.error}>{error}</div>}

      {tests.length === 0 ? (
        <div className={styles.noTests}>
          <p>Niciun test</p>
          <button className={styles.generateButton} onClick={handleOpen}>
            Generează primul test
          </button>
        </div>
      ) : (
        <>
          <div className={styles.testsSection}>
            <div className={styles.buttonWrapper}>
              <button className={styles.generateButton} onClick={handleOpen}>
                Generează
              </button>
            </div>
            <div className={styles.scrollableTableContainer}>
              <table className={styles.testsTable}>
                <thead>
                  <tr>
                    <th>Nr.crt.</th>
                    <th>Data</th>
                    <th>Nume Test</th>
                    <th>Document</th>
                    <th>Barem</th>
                    <th>Opțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr key={test.idtest}>
                      <td>{index + 1}</td>
                      <td>{new Date(test.datacreatie).toLocaleDateString()}</td>
                      <td>{test.titlu || '-'}</td>
                      <td>
                        <a href={test.document} target="_blank" rel="noopener noreferrer">
                          Vizualizează
                        </a>
                      </td>
                      <td>
                        <a href={test.barem} target="_blank" rel="noopener noreferrer">
                          Vizualizează
                        </a>
                      </td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteTest(test.idtest)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Title input modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Introdu titlul testului
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Titlu (max 20 caractere)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              input: {
                inputProps: {
                  maxLength: 20
                }
              }
            }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleClose}>Anulează</Button>
            <Button variant="contained" onClick={handleGenerateTest}>
              Confirmă
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
