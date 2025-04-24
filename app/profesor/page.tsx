'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Profesor.module.css';
import AccBar from './AccBar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AxiosError } from 'axios';

type Test = {
  idtest: number;
  tip: string;
  datacreatie: string;
  document: string;
  barem: string;
  titlu?: string;
};

type MyElev = { idelev: number; fullName: string };

type Assignment = {
  idtema: number;
  fullName: string;
  datatrimitere: string;
  status: string;
  document: string;
  barem: string;
  rezolvare: string | null;
  numetest: string;
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Profesor() {

  const [tab, setTab] = useState(0);
  const handleTabChange = (_:unknown, v: number) => setTab(v);


  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);


  const [tests, setTests] = useState<Test[]>([]);
  const [openGen, setOpenGen] = useState(false);
  const [title, setTitle] = useState('');
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenGen = () => { setOpenGen(true); setTitle(''); setGenError(null); };
  const handleCloseGen = () => { setOpenGen(false); setTitle(''); setGenError(null); };

  const fetchTests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teste/all', { credentials: 'include' });
      if (!res.ok) throw new Error('Eroare la obținerea testelor');
      setTests(await res.json());
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Eroare necunoscută.');
      }
    }
  };
  

  useEffect(() => {
    fetchTests();
  }, []);

  const handleGenerateTest = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 20) {
      setGenError('Titlul trebuie să aibă între 1 și 20 de caractere.');
      return;
    }
  
    setIsGenerating(true);
    try {
      await axios.post('http://localhost:8000/api/teste/generate', { titlu: trimmed }, { withCredentials: true });
      handleCloseGen();
      fetchTests();
      setSnack('Test generat cu succes!');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setGenError(err.response?.data?.error || 'Eroare la generarea testului');
      } else {
        setGenError('Eroare necunoscută.');
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDeleteTest = async (idtest: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest test?')) return;
    try {
      await axios.post(`http://localhost:8000/api/teste/delete/${idtest}`, {}, { withCredentials: true });
      fetchTests();
      setSnack('Test șters cu succes!');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Eroare la ștergerea testului');
      } else {
        setError('Eroare necunoscută.');
      }
    }
  };
  


  const [openAssign, setOpenAssign] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [myElevi, setMyElevi] = useState<MyElev[]>([]);

  const handleOpenAssign = async (idtest: number) => {
    setError(null);
    setSelectedTestId(idtest);
    setOpenAssign(true);
    try {
      const res = await axios.get<MyElev[]>('http://localhost:8000/api/elevi/my', { withCredentials: true });
      setMyElevi(res.data.sort((a,b)=>a.fullName.localeCompare(b.fullName)));
    } catch {
      setError('Eroare la încărcarea elevilor mei.');
    }
  };
  const handleCloseAssign = () => {
    setOpenAssign(false);
    setSelectedTestId(null);
    setMyElevi([]);
  };
  const handleAssign = async (idelev: number) => {
    if (!selectedTestId) return;
    try {
      await axios.post(`http://localhost:8000/api/profesori/assign/${selectedTestId}/${idelev}`, {}, { withCredentials: true });
      setSnack('Temă trimisă cu succes!');
      setMyElevi(prev => prev.filter(e => e.idelev !== idelev));
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Eroare la trimiterea temei.');
      } else {
        setError('Eroare necunoscută.');
      }
    }
  };

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  useEffect(() => {
    if (tab === 1) {
      axios.get<Assignment[]>('http://localhost:8000/api/profesori/assignments', { withCredentials: true })
        .then(res => setAssignments(res.data))
        .catch(() => setError('Eroare la încărcarea assignment-urilor.'));
    }
  }, [tab]);

 
const handleDeleteTema = async (idtema: number) => {
  if (!confirm('Ești sigur că vrei să ștergi acest assignment?')) return;
  try {
    await axios.delete(`http://localhost:8000/api/profesori/stergeretema/${idtema}`, { withCredentials: true });
    setAssignments(prev => prev.filter(a => a.idtema !== idtema));
    setSnack('Assignment șters cu succes!');
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      setError(err.response?.data?.error || 'Eroare la ștergerea assignment-ului');
    } else {
      setError('Eroare necunoscută.');
    }
  }
};

  return (
    <div className={styles.container} style={{ fontSize: '0.9rem' }}>
      <AccBar />
      <h1 className={styles.title}>Panoul profesorului</h1>
      {(error || genError) && <div className={styles.error}>{error || genError}</div>}

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Teste" />
        <Tab label="Assignment-uri" />
      </Tabs>

      {tab === 0 && (
        <>
          {tests.length === 0 ? (
            <div className={styles.noTests}>
              <p>Niciun test</p>
              <button className={styles.generateButton} onClick={handleOpenGen}>
                Generează primul test
              </button>
            </div>
          ) : (
            <>
              <div
                className={styles.scrollableTableContainer}
                style={{ maxHeight: 246, overflowY: 'auto' }}
              >
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
                    {tests.map((t, i) => (
                      <tr key={t.idtest}>
                        <td>{i + 1}</td>
                        <td>{new Date(t.datacreatie).toLocaleDateString()}</td>
                        <td>{t.titlu || '-'}</td>
                        <td><a href={t.document} target="_blank" rel="noreferrer">Vizualizează</a></td>
                        <td><a href={t.barem} target="_blank" rel="noreferrer">Vizualizează</a></td>
                        <td>
                          <IconButton onClick={() => handleOpenAssign(t.idtest)} className={styles.assignButton}>
                            ➡️
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteTest(t.idtest)}
                            sx={{
                              p: 0,
                              m: 0,
                              color: '#fff',
                            }}
                          >
                            ❌
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.buttonWrapper}>
                <button className={styles.generateButton} onClick={handleOpenGen}>
                  Generează
                </button>
              </div>
            </>
          )}
        </>
      )}

      {tab === 1 && (
        <div
          className={styles.scrollableTableContainer}
          style={{ maxHeight: 265, overflowY: 'auto' }}
        >
          <table className={styles.testsTable}>
            <thead>
              <tr>
                <th>Nr.crt.</th>
                <th>Nume elev</th>
                <th>Data trimitere</th>
                <th>Status</th>
                <th>Nume test</th>
                <th>Document</th>
                <th>Barem</th>
                <th>Rezolvare</th>
                <th>Opțiuni</th>
              </tr>
            </thead>
            <tbody>
            {assignments.map((a, idx) => (
                <tr key={a.idtema}>
                  <td>{idx + 1}</td>
                  <td>{a.fullName}</td>
                  <td>{new Date(a.datatrimitere).toLocaleDateString()}</td>
                  <td>{a.status}</td>
                  <td>{a.numetest || '-'}</td>
                  <td>
                    {a.document
                      ? <a href={a.document} target="_blank" rel="noreferrer">Vizualizează</a>
                      : '-'}</td>
                  <td>
                    {a.barem
                      ? <a href={a.barem} target="_blank" rel="noreferrer">Vizualizează</a>
                      : '-'}</td>
                  <td>
                    {a.rezolvare
                      ? <a href={a.rezolvare} target="_blank" rel="noreferrer">Vizualizează</a>
                      : '-'}</td>
                  <td>
                    <IconButton
                      onClick={() => handleDeleteTema(a.idtema)}
                      sx={{ p: 0, m: 0, color: '#fff' }}
                    >
                      ❌
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Test Modal */}
      <Modal open={openGen} onClose={handleCloseGen}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Introdu titlul testului</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Titlu (max 20 caractere)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
          {genError && <Typography color="error">{genError}</Typography>}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseGen} disabled={isGenerating}>Anulează</Button>
            <Button variant="contained" onClick={handleGenerateTest} disabled={isGenerating}>Confirmă</Button>
          </Box>
        </Box>
      </Modal>

      {/* Assign Test Modal */}
      <Modal open={openAssign} onClose={handleCloseAssign}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Atribuie assignment-uri</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <div>
            {myElevi.map((elev) => (
              <Box key={elev.idelev} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button onClick={() => handleAssign(elev.idelev)}>{elev.fullName}</Button>
              </Box>
            ))}
          </div>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseAssign}>Închide</Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
      {snack && (
        <Snackbar
          open={true}
          autoHideDuration={6000} // Automatically hides after 6 seconds
          onClose={() => setSnack(null)} // Closes the snackbar when the timer ends
          message={snack}
        />
      )}
    </div>
  );
}
