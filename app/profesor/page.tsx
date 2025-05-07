'use client';
import React, { useState } from 'react';
import AccBar from './AccBar';
import { Tabs, Tab, Snackbar, Typography } from '@mui/material';
import styles from './Profesor.module.css';
import Teste from './Teste';
import Assign from './Assign';

export default function Page() {
  const [tab, setTab] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  return (
    <div className={styles.container} style={{ fontSize: '0.9rem' }}>
      <AccBar />
      <h1 className={styles.title}>Panoul profesorului</h1>

      {error && (
        <div className={styles.error}>
          <Typography color="error">{error}</Typography>
        </div>
      )}

      <Tabs
        value={tab}
        onChange={(_, v) => {
          setError(null);
          setTab(v);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label="Teste" />
        <Tab label="Assignment-uri" />
      </Tabs>

      {tab === 0 ? (
        <Teste setError={setError} setSnack={setSnack} />
      ) : (
        <Assign setError={setError} setSnack={setSnack} />
      )}

      {snack && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setSnack(null)}
          message={snack}
        />
      )}
    </div>
  );
}