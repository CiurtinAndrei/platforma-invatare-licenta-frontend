'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Exercitiu.module.css";

type CapitoleType = {
  [idcapitol: number]: {
    name: string;
    subcapitole: { [idsubcapitol: number]: string };
  };
};

const capitole: CapitoleType = {
  1: { name: "Numere naturale si numere intregi", subcapitole: { 1: "Operatii", 2: "Sume Gauss si sume speciale", 3: "Teorema impartirii cu rest", 4: "Divizibilitate si ultima cifra", 5: "Exercitii in baza 10 si de numeratie", 6: "Probleme aplicative" } },
  2: { name: "Numere rationale", subcapitole: { 7: "Operatii", 8: "Procente", 9: "Probabilitati", 10: "Rapoarte si proportii" } },
  3: { name: "Numere reale", subcapitole: { 11: "Operatii", 12: "Intervale" } },
  4: { name: "Ecuatii, inecuatii si sisteme", subcapitole: { 13: "Ecuatii", 14: "Inecuatii", 15: "Sisteme", 16: "Modul" } },
  5: { name: "Functii", subcapitole: { 17: "Produsul cartezian", 18: "Probleme cu functii" } },
  6: { name: "Calcul algebric", subcapitole: { 19: "Operatii", 20: "Descompuneri" } },
  7: { name: "Segmente si unghiuri", subcapitole: { 21: "Calcule cu segmente", 22: "Calcule cu unghiuri" } },
  8: { name: "Triunghiul", subcapitole: { 23: "Linii importante", 24: "Cazuri de congruenta", 25: "Triunghiul echilateral", 26: "Triunghiul dreptunghic", 27: "Arii si perimetre" } },
  9: { name: "Cercul", subcapitole: { 28: "Cercul" } },
  10: { name: "Patrulatere", subcapitole: { 29: "Paralelogram, Dreptunghi, Patrat, Romb", 30: "Arii si perimetre", 31: "Poligoane regulate", 32: "Trapezul", 33: "Asemanarea" } },
  11: { name: "Geometrie in spatiu", subcapitole: { 34: "Piramida", 35: "Prisma", 36: "Conul si trunchiul de con", 37: "Cilindrul", 38: "Paralelism in spatiu", 39: "Perpendicularitate in spatiu", 40: "Unghiul a 2 drepte", 41: "Unghiul dintre dreapta si plan", 42: "Unghiul dintre 2 plane", 43: "Calcul de distante" } }
};

export default function Exercitiu() {
  const router = useRouter();
  const [capitol, setCapitol] = useState<number | "">("");
  const [subcapitol, setSubcapitol] = useState<number | "">("");
  const [cerinta, setCerinta] = useState<string>("");
  const [rezolvare, setRezolvare] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { capitol, subcapitol, cerinta, rezolvare };
    try {
      const response = await axios.post("http://localhost:8000/api/teste/add", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        alert("Exercițiul a fost adăugat cu succes!");
        router.push("/admin");
      } else {
        alert(response.data.error || "Eroare la adăugare.");
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error("Eroare la trimiterea cererii:", axiosError);
      alert(axiosError.response?.data?.error || "Eroare la conectarea cu serverul.");
    }
  };

  return (
    <div className={styles.page_container}>
      <h2 className={styles.title}>Adaugă un exercițiu</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mb_4}>
          <label className={styles.label}>Capitol</label>
          <select
            className={styles.select}
            value={capitol}
            onChange={(e) => { setCapitol(Number(e.target.value)); setSubcapitol(""); }}
          >
            <option value="">Selectează capitolul</option>
            {Object.entries(capitole).map(([id, { name }]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <div className={styles.mb_4}>
          <label className={styles.label}>Subcapitol</label>
          <select
            className={styles.select}
            value={subcapitol}
            onChange={(e) => setSubcapitol(Number(e.target.value))}
            disabled={!capitol}
          >
            <option value="">Selectează subcapitolul</option>
            {capitol && Object.entries(capitole[capitol]?.subcapitole || {}).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <div className={styles.mb_4}>
          <label className={styles.label}>Cerinta</label>
          <textarea
            className={styles.textarea}
            rows={6}
            value={cerinta}
            onChange={(e) => setCerinta(e.target.value)}
            placeholder="Introduceți cerința în LaTeX"
          />
        </div>
        <div className={styles.mb_4}>
          <label className={styles.label}>Rezolvare</label>
          <textarea
            className={styles.textarea}
            rows={6}
            value={rezolvare}
            onChange={(e) => setRezolvare(e.target.value)}
            placeholder="Introduceți rezolvarea în LaTeX"
          />
        </div>
        <button type="submit" className={styles.buttonSubmit}>Adaugă</button>
        <button type="button" className={styles.buttonCancel} onClick={() => router.push("/admin")}>Anulează</button>
      </form>
    </div>
  );
}
