'use client';

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
  Backdrop,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export type Assignment = {
  idtema: number;
  fullName: string;
  datatrimitere: string;
  status: string;
  document: string;
  barem: string;
  rezolvare: string | null;
  numetest: string;
  raport: string | null;
};

export interface ReportExercise {
  number: number;
  chapter: string;
  subchapter: string;
  punctaj: number;
}

export interface ReportData {
  student_name: string;
  total_score: number;
  exercises: ReportExercise[];
}

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

const reportModalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh',
  overflow: 'hidden',
};

export default function Assign({ setError, setSnack }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [openCorrect, setOpenCorrect] = useState(false);
  const [currentTema, setCurrentTema] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>(Array(18).fill(0));
  const [openViewReport, setOpenViewReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get<Assignment[]>(
        'http://localhost:8000/api/profesori/assignments',
        { withCredentials: true }
      );
      setAssignments(res.data);
    } catch {
      setError('Eroare la încărcarea assignment-urilor.');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDeleteTema = async (idtema: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest assignment?')) return;
    try {
      await axios.delete(
        `http://localhost:8000/api/profesori/stergeretema/${idtema}`,
        { withCredentials: true }
      );
      setAssignments(prev => prev.filter(a => a.idtema !== idtema));
      setSnack('Assignment șters cu succes!');
    } catch {
      setError('Eroare la ștergerea assignment-ului');
    }
  };

  // --- Correction modal ---
  const handleOpenCorrect = (temaId: number) => {
    setCurrentTema(temaId);
    setScores(Array(18).fill(0));
    setOpenCorrect(true);
  };
  const handleCloseCorrect = () => setOpenCorrect(false);
  const handleScoreChange = (idx: number, val: number) => {
    const arr = [...scores];
    arr[idx] = val;
    setScores(arr);
  };
  const handleConfirmCorrect = async () => {
    if (!currentTema) return;
    if (!window.confirm('Ești sigur că este totul corect?')) return;
    setIsLoading(true);
    try {
      await axios.post(
        `http://localhost:8000/api/profesori/corectare/${currentTema}`,
        { scores },
        { withCredentials: true }
      );
      await fetchAssignments();
      setSnack('Corectare procesată cu succes.');
      handleCloseCorrect();
    } catch {
      setError('Eroare la procesarea corectării.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- View report modal ---
  const handleViewReport = (raw: string) => {
    try {
      setReportData(JSON.parse(raw) as ReportData);
    } catch {
      setReportData(null);
    }
    setOpenViewReport(true);
  };
  const handleCloseView = () => setOpenViewReport(false);

  return (
    <>
      <div className={styles.scrollableTableContainer} style={{ maxHeight: 265, overflowY: 'auto' }}>
        <table className={styles.testsTable}>
          <thead>
            <tr>
              <th>Nr.crt.</th><th>Nume elev</th><th>Data trimitere</th><th>Status</th>
              <th>Nume test</th><th>Document</th><th>Barem</th><th>Rezolvare</th><th>Raport</th><th>Opțiuni</th>
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
                  {a.document ? (
                    <IconButton
                      component="a"
                      href={a.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="primary"
                      aria-label="Vezi document"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : ('-')}
                </td>
                <td>
                  {a.barem ? (
                    <IconButton
                      component="a"
                      href={a.barem}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="primary"
                      aria-label="Vezi barem"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : ('-')}
                </td>
                <td>
                  {a.rezolvare ? (
                    <IconButton
                      component="a"
                      href={a.rezolvare}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      color="primary"
                      aria-label="Vezi rezolvare"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : ('-')}
                </td>
                <td>
                  {a.raport ? (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewReport(a.raport!)}
                      aria-label="Vezi raport"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  ) : ('-')}
                </td>
                <td>
                  <IconButton
                    disabled={!a.rezolvare || a.status === 'Corectat'}
                    onClick={() => handleOpenCorrect(a.idtema)}
                    sx={{ p: 0, m: 0 }}
                  >
                    ✏️
                  </IconButton>
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

      {/* Correction Modal */}
      <Modal open={openCorrect} onClose={handleCloseCorrect}>
        <Box sx={{ ...modalStyle, width: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 2, px: 2, pt: 2 }}>
            Introduceți punctajele exercițiilor
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: 2,
              overflowY: 'auto',
              overflowX: 'hidden',
              pt: 1,
              px: 2,
              maxHeight: '350px',
            }}
          >
            {scores.map((val, i) => (
              <TextField
                key={i}
                label={`Ex ${i + 1}`}
                type="number"
                value={val}
                onChange={e =>
                  handleScoreChange(
                    i,
                    Math.min(Math.max(Math.floor(Number(e.target.value) || 0), 0), 5)
                  )
                }
                inputProps={{ min: 0, max: 5, step: 1 }}
                fullWidth
              />
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
            <Button onClick={handleCloseCorrect}>Anulează</Button>
            <Button variant="contained" onClick={handleConfirmCorrect}>
              Confirmă
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* View Report Modal */}
      <Modal open={openViewReport} onClose={handleCloseView}>
        <Box sx={reportModalStyle}>
          <Typography variant="h6" gutterBottom>
            Raportul de corectare
          </Typography>
          <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 2 }}>
            {reportData ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Elev:</strong> {reportData.student_name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Scor total:</strong> {reportData.total_score}
                </Typography>
                {reportData.exercises.map((ex: ReportExercise) => (
                  <Box key={ex.number} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Ex {ex.number}:</strong> {ex.chapter}, {ex.subchapter}
                    </Typography>
                    <Typography variant="body2">Punctaj: {ex.punctaj}</Typography>
                  </Box>
                ))}
              </>
            ) : (
              <Typography>Raport invalid.</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.modal + 1 }} open={isLoading}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Se încarcă feedback-ul personalizat pentru student…</Typography>
      </Backdrop>
    </>
  );
}
