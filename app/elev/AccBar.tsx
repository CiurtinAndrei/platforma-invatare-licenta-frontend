"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Elev.module.css";

export default function AccBar() {
    const [user, setUser] = useState<{ nume: string; prenume: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/auth/user", { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                router.replace("/login"); // Redirect to home page silently
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [router]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
            router.push("/login"); // Redirect to home page after logout
        } catch (error) {
            console.error("Eroare la delogare:", error);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.accBar}>
            {user ? (
                <>
                    <h1>Bun venit, {user.nume} {user.prenume}!</h1>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </>
            ) : null}
        </div>
    );
}
