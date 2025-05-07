'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './Elev.module.css';
import AccBar from './AccBar';
import { Button, Modal, Box, Typography, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Tema {
  idtema: number;
  datatrimitere: string;
  status: string;
  document: string;
  rezolvare: string | null;
  feedback: string | null;
  nota: number | null;
  titlu:string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
};

export default function Elev() {
  const [teme, setTeme] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const [openFeedback, setOpenFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:8000/api/elevi/teme',
          { withCredentials: true }
        );
        setTeme(data);
      } catch (err) {
        console.error('Eroare la preluarea temelor:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUploadClick = (idtema: number) => {
    fileInputs.current[idtema]?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    idtema: number
  ) => {
    const fileInput = e.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const ok = window.confirm(
      'Ești sigur că vrei să încarci rezolvarea? Aceasta va ajunge la profesor.'
    );
    if (!ok) {
      fileInput.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/elevi/teme/${idtema}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      setTeme(prev =>
        prev.map(t =>
          t.idtema === idtema
            ? {
                ...t,
                rezolvare: res.data.rezolvare,
                status: 'În curs de corectare',
              }
            : t
        )
      );
    } catch (err) {
      console.error('Eroare la încărcarea fișierului:', err);
      alert('Eroare la încărcarea fișierului.');
    } finally {
      fileInput.value = '';
    }
  };

  const handleViewFeedback = (fb: string) => {
    setCurrentFeedback(fb);
    setOpenFeedback(true);
  };
  const handleCloseFeedback = () => setOpenFeedback(false);

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
      <h1 className={styles.pageTitle}>Panoul elevului</h1>
      <h2 className={styles.tableTitle}>Teme primite</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nr. crt.</th>
            <th>Titlul testului</th>
            <th>Data trimitere</th>
            <th>Status</th>
            <th>Document</th>
            <th>Rezolvare</th>
            <th>Nota</th>
            <th>Feedback (EN)</th>
            <th>Opțiuni</th>
          </tr>
        </thead>
        <tbody>
          {teme.map((tema, idx) => (
            <tr key={tema.idtema}>
              <td>{idx + 1}</td>
              <td>{tema.titlu}</td>
              <td>{new Date(tema.datatrimitere).toLocaleDateString()}</td>
              <td>{tema.status}</td>
              <td>
                <a
                  href={tema.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Vezi document"
                >
                  <VisibilityIcon fontSize="small" color="primary" />
                </a>
              </td>
              <td>
                {tema.rezolvare ? (
                  <a
                    href={tema.rezolvare}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Vezi rezolvare"
                  >
                    <VisibilityIcon fontSize="small" color="primary" />
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>{tema.nota ?? '-'}</td>
              <td>
                {tema.feedback ? (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewFeedback(tema.feedback!)}
                    aria-label="Vezi feedback"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleUploadClick(tema.idtema)}
                  disabled={tema.status === 'Corectat'}
                >
                  {tema.rezolvare ? 'Reîncarcă' : 'Încarcă'}
                </Button>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  ref={el => {fileInputs.current[tema.idtema] = el;}}
                  onChange={e => handleFileChange(e, tema.idtema)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Feedback Modal */}
      <Modal open={openFeedback} onClose={handleCloseFeedback}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Feedback generat de MagicTeacher AI</Typography>
          <Box sx={{ whiteSpace: 'pre-line', mt: 2, overflowY: 'auto', maxHeight: '50vh' }}>
            {currentFeedback}
          </Box>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={handleCloseFeedback}>Închide</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

