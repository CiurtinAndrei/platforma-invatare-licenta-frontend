'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Admin.module.css';

interface Exercise {
    id: number;
    capitol: string;
    subcapitol: string;
    cerinta: string;
    rezolvare: string;
}

export default function Exercitii() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios.get('http://localhost:8000/api/teste/exercitii')
            .then(response => {
                setExercises(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Eroare la preluarea exercițiilor:', error);
                setLoading(false);
            });
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleRedirect = () => {
        router.push('/admin/exercitiu');
    };

    if (loading) return <p className={styles.loadingMessage}>Se încarcă exercițiile...</p>;

    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Lista Exercițiilor</h1>
            <button className={styles.redirectButton} onClick={handleRedirect}>Adaugă un nou exercițiu</button>
            <table className={styles.exerciseTable}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.tableCell}>Capitol</th>
                        <th className={styles.tableCell}>Subcapitol</th>
                        <th className={styles.tableCell}>Cerinta</th>
                        <th className={styles.tableCell}>Rezolvare</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map(ex => (
                        <tr key={ex.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{ex.capitol}</td>
                            <td className={styles.tableCell}>{ex.subcapitol}</td>
                            <td className={styles.tableCell}>
                                <button className={styles.copyButton} onClick={() => copyToClipboard(ex.cerinta)}>Copiază</button>
                            </td>
                            <td className={styles.tableCell}>
                                <button className={styles.copyButton} onClick={() => copyToClipboard(ex.rezolvare)}>Copiază</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
