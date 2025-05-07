import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './Profesor.module.css';
import {
  IconButton,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AxiosError } from 'axios';

export type Test = {
  idtest: number;
  tip: string;
  datacreatie: string;
  document: string;
  barem: string;
  titlu?: string;
};

export type MyElev = {
  idelev: number;
  fullName: string;
};

type Props = {
  setError: (msg: string | null) => void;
  setSnack: (msg: string | null) => void;
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

export default function Teste({ setError, setSnack }: Props) {
  // === state for listing/generating/deleting tests ===
  const [tests, setTests] = useState<Test[]>([]);
  const [openGen, setOpenGen] = useState(false);
  const [title, setTitle] = useState('');
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchTests = async () => {
    try {
      const res = await fetch(
        'http://localhost:8000/api/teste/all',
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Eroare la obținerea testelor');
      setTests(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Eroare necunoscută.');
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleOpenGen = () => {
    setOpenGen(true);
    setTitle('');
    setGenError(null);
  };
  const handleCloseGen = () => {
    setOpenGen(false);
    setTitle('');
    setGenError(null);
  };

  const handleGenerateTest = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 20) {
      setGenError('Titlul trebuie să aibă între 1 și 20 de caractere.');
      return;
    }
    setIsGenerating(true);
    try {
      await axios.post(
        'http://localhost:8000/api/teste/generate',
        { titlu: trimmed },
        { withCredentials: true }
      );
      handleCloseGen();
      fetchTests();
      setSnack('Test generat cu succes!');
    } catch (err: unknown) {
      const msg = (err as AxiosError).response?.data?.error
        || 'Eroare la generarea testului';
      setGenError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteTest = async (idtest: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest test?')) return;
    try {
      await axios.post(
        `http://localhost:8000/api/teste/delete/${idtest}`,
        {},
        { withCredentials: true }
      );
      fetchTests();
      setSnack('Test șters cu succes!');
    } catch (err: unknown) {
      const msg = (err as AxiosError).response?.data?.error
        || 'Eroare la ștergerea testului';
      setError(msg);
    }
  };

  // === state & handlers for "assign to elev" modal ===
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [myElevi, setMyElevi] = useState<MyElev[]>([]);

  const handleOpenAssign = async (idtest: number) => {
    setError(null);
    setSelectedTestId(idtest);
    setOpenAssign(true);
    try {
      const res = await axios.get<MyElev[]>(
        'http://localhost:8000/api/elevi/my',
        { withCredentials: true }
      );
      setMyElevi(res.data.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      ));
    } catch {
      setError('Eroare la încărcarea elevilor mei.');
    }
  };
  const handleCloseAssign = () => {
    setOpenAssign(false);
    setMyElevi([]);
    setSelectedTestId(null);
  };
  const handleAssign = async (idelev: number) => {
    if (!selectedTestId) return;
    try {
      await axios.post(
        `http://localhost:8000/api/profesori/assign/${selectedTestId}/${idelev}`,
        {},
        { withCredentials: true }
      );
      setSnack('Temă trimisă cu succes!');
      setMyElevi(prev => prev.filter(e => e.idelev !== idelev));
    } catch {
      setError('Eroare la trimiterea temei.');
    }
  };

  return (
    <>
      {tests.length === 0 ? (
        <div className={styles.noTests}>
          <p>Niciun test</p>
          <button
            className={styles.generateButton}
            onClick={handleOpenGen}
          >
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
                    <td>{new Date(t.datacreatie)
                      .toLocaleDateString()}</td>
                    <td>{t.titlu || '-'}</td>
                    <td>
                      <IconButton
                        component="a"
                        href={t.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        size="small"
                        aria-label="Vezi document"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </td>
                    <td>
                      <IconButton
                        component="a"
                        href={t.barem}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        size="small"
                        aria-label="Vezi barem"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </td>
                    <td>
                      <IconButton
                        onClick={() => handleOpenAssign(t.idtest)}
                        className={styles.assignButton}
                      >
                        ➡️
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteTest(t.idtest)}
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
          <div className={styles.buttonWrapper}>
            <button
              className={styles.generateButton}
              onClick={handleOpenGen}
            >
              Generează
            </button>
          </div>
        </>
      )}

      {/* Generate Test Modal */}
      <Modal open={openGen} onClose={handleCloseGen}>
        <Box sx={modalStyle}>
          <Typography variant="h6">
            Introdu titlul testului
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Titlu (max 20 caractere)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
          {genError && (
            <Typography color="error">{genError}</Typography>
          )}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1
            }}
          >
            <Button
              onClick={handleCloseGen}
              disabled={isGenerating}
            >
              Anulează
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateTest}
              disabled={isGenerating}
            >
              Confirmă
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Assign to Elev Modal */}
      <Modal open={openAssign} onClose={handleCloseAssign}>
        <Box sx={modalStyle}>
          <Typography variant="h6">
            Atribuie assignment-uri
          </Typography>
          {myElevi.map(elev => (
            <Box
              key={elev.idelev}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1
              }}
            >
              <Button onClick={() => handleAssign(elev.idelev)}>
                {elev.fullName}
              </Button>
            </Box>
          ))}
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={handleCloseAssign}>
              Închide
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
