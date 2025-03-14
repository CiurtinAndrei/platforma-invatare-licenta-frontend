'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Register.module.css";

interface FormData {
  nume: string;
  prenume: string;
  adresa: string;
  email: string;
  telefon: string;
  scoala?: string;
  parola: string;
  repeatParola: string;
}

export default function RegProfesor() {
  const [formData, setFormData] = useState<FormData>({
    nume: "",
    prenume: "",
    adresa: "",
    email: "",
    telefon: "",
    scoala: "",
    parola: "",
    repeatParola: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { nume, prenume, adresa, email, telefon, scoala, parola, repeatParola } = formData;

    if (!nume || !prenume || !adresa || !email || !telefon || !parola || !repeatParola) {
      setError("Toate câmpurile obligatorii trebuie completate!");
      return;
    }

    if (parola !== repeatParola) {
      setError("Parolele nu coincid!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/profesori/inregistrare", {
        nume,
        prenume,
        adresa,
        email,
        telefon,
        scoala: scoala || null,
        parola,
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Eroare la înregistrare!");
    }
  };

  return (
    <div className={styles.center_screen}>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.register_form}>
        <input
          type="text"
          name="nume"
          placeholder="Nume"
          value={formData.nume}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="prenume"
          placeholder="Prenume"
          value={formData.prenume}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="adresa"
          placeholder="Adresa"
          value={formData.adresa}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="telefon"
          placeholder="Nr. de telefon"
          value={formData.telefon}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="scoala"
          placeholder="Unitate învățământ (opțional)"
          value={formData.scoala}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="parola"
          placeholder="Parolă"
          value={formData.parola}
          onChange={handleChange}
          required
          className={`${styles.input} ${styles.password_field}`}
        />
        <input
          type="password"
          name="repeatParola"
          placeholder="Repetă Parola"
          value={formData.repeatParola}
          onChange={handleChange}
          required
          className={`${styles.input} ${styles.password_field}`}
        />

        {/* Wrap the buttons inside a container */}
        <div className={styles.buttons_wrapper}>
          <button type="submit" className={`${styles.register_button} ${styles.green_button}`}>
            Înregistrare
          </button>
          <button
            type="button"
            className={`${styles.back_button} ${styles.green_button}`}
            onClick={() => router.push('/')}
          >
            Înapoi
          </button>
        </div>
      </form>
    </div>
  );
}
