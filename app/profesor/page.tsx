'use client'
import { useState, useEffect } from 'react';
import styles from './Profesor.module.css';
import AccBar from './AccBar';

export default function Profesor() {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch tests for the professor.
  const fetchTests = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teste/all', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Eroare la obținerea testelor');
      }
      const data = await res.json();
      setTests(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Call fetchTests on component mount.
  useEffect(() => {
    fetchTests();
  }, []);

  // Function to trigger test generation.
  const handleGenerateTest = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/teste/generate', {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Eroare la generarea testului');
      }
      // Refresh tests after successful creation.
      fetchTests();
    } catch (err) {
      console.error("Error: ", err);
      setError(err.message);
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
          <button className={styles.generateButton} onClick={handleGenerateTest}>
            Genereaza primul test
          </button>
        </div>
      ) : (
        <div className={styles.testsSection}>
          <div className={styles.buttonWrapper}>
            <button className={styles.generateButton} onClick={handleGenerateTest}>
              Genereaza
            </button>
          </div>
          <table className={styles.testsTable}>
            <thead>
              <tr>
                <th>ID Test</th>
                <th>Tip</th>
                <th>Data</th>
                <th>Document</th>
                <th>Barem</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test.idtest}>
                  <td>{test.idtest}</td>
                  <td>{test.tip}</td>
                  <td>{new Date(test.datacreatie).toLocaleDateString()}</td>
                  <td>{test.document}</td>
                  <td>{test.barem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
