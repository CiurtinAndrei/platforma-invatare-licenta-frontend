"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define types for the structure
type CapitoleType = {
    [category: string]: {
        [chapter: string]: string[];
    };
};

const capitole: CapitoleType = {
    Algebra: {
        "Numere naturale si numere intregi": [
            "Operatii",
            "Sume Gauss si sume diferite",
            "Teorema impartirii cu rest",
            "Divizibilitate si ultima cifra",
            "Exercitii in baza 10 si de numeratie",
            "Probleme aplicative",
        ],
        "Numere rationale": ["Operatii", "Procente", "Probabilitati", "Rapoarte si proportii"],
        "Numere reale": ["Operatii", "Intervale"],
        "Ecuatii inecuatii si sisteme": ["Ecuatii", "Inecuatii", "Sisteme"],
        Functii: ["Produsul cartezian", "Probleme cu functii"],
        "Calcul algebric": ["Operatii", "Descompuneri"],
    },
    Geometrie: {
        "Segmente si unghiuri": ["Calcule cu segmente", "Calcule cu unghiuri"],
        Triunghiul: ["Linii importante", "Cazuri de congruenta", "Triunghiul echilateral", "Triunghiul dreptunghic", "Arii + Perimetre"],
        Cercul: ["Cercul"], // ✅ Added "Cercul" as a subcapitol inside "Cercul"
        Patrulatere: ["Paralelogram, Dreptunghi, Patrat, Romb", "Arii si perimetre", "Poligoane regulate", "Trapezul", "Asemanarea"],
        "Geometrie in spatiu": [
            "Piramida",
            "Prisma",
            "Conul si trunchiul de con",
            "Cilindrul",
            "Paralelism in spatiu",
            "Perpendicularitate in spatiu",
            "Unghiul a 2 drepte",
            "Unghiul dintre dreapta si plan",
            "Unghiul dintre 2 plane",
            "Calcul de distante",
        ],
    },
};

// Map for display names
const displayNames: Record<string, string> = {
    Algebra: "Algebră",
    "Numere naturale si numere intregi": "Numere naturale și numere întregi",
    "Numere rationale": "Numere raționale",
    "Numere reale": "Numere reale",
    "Ecuatii inecuatii si sisteme": "Ecuatii, inecuatii și sisteme",
    Functii: "Funcții",
    "Calcul algebric": "Calcul algebric",
    Geometrie: "Geometrie",
    "Segmente si unghiuri": "Segmente și unghiuri",
    Triunghiul: "Triunghiul",
    Patrulatere: "Patrulatere",
    "Geometrie in spatiu": "Geometrie în spațiu",
    "Paralelogram, Dreptunghi, Patrat, Romb": "Paralelogram, Dreptunghi, Pătrat, Romb",
};

export default function Exercitiu() {
    const router = useRouter();

    // State types
    const [clasa, setClasa] = useState<string>("");
    const [capitol, setCapitol] = useState<string>("");
    const [subcapitol, setSubcapitol] = useState<string>("");
    const [cerinta, setCerinta] = useState<string>("");
    const [rezolvare, setRezolvare] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { clasa, capitol, subcapitol, cerinta, rezolvare };

        try {
            // Corrected API call to match backend
            const response = await axios.post("http://localhost:8000/api/teste/add", data, {
                withCredentials: true, // Needed if using cookies/auth
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                alert("Exercițiul a fost adăugat cu succes!");
                router.push("/admin");
            } else {
                alert(response.data.error || "Eroare la adăugare.");
            }
        } catch (error: any) {
            console.error("Eroare la trimiterea cererii:", error);
            alert(error?.response?.data?.error || "Eroare la conectarea cu serverul.");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Adaugă un exercițiu</h2>
            <form onSubmit={handleSubmit}>
                {/* Select Clasa */}
                <div className="mb-4">
                    <label className="block mb-2">Clasa</label>
                    <select className="w-full border p-2" value={clasa} onChange={(e) => setClasa(e.target.value)}>
                        <option value="">Selectează clasa</option>
                        {[5, 6, 7, 8].map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Capitol */}
                <div className="mb-4">
                    <label className="block mb-2">Capitol</label>
                    <select
                        className="w-full border p-2"
                        value={capitol}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setCapitol(e.target.value);
                            setSubcapitol(""); // Reset subcapitol when capitol changes
                        }}
                    >
                        <option value="">Selectează capitolul</option>
                        {Object.keys(capitole).map((cat) =>
                            Object.keys(capitole[cat]).map((cap) => (
                                <option key={cap} value={cap}>
                                    {displayNames[cap] || cap}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Select Subcapitol */}
                <div className="mb-4">
                    <label className="block mb-2">Subcapitol</label>
                    <select
                        className="w-full border p-2"
                        value={subcapitol}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubcapitol(e.target.value)}
                        disabled={!capitol}
                    >
                        <option value="">Selectează subcapitolul</option>
                        {capitol &&
                            Object.keys(capitole).map((cat) =>
                                capitole[cat][capitol]?.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {displayNames[sub] || sub}
                                    </option>
                                ))
                            )}
                    </select>
                </div>

                {/* Textarea Cerinta */}
                <div className="mb-4">
                    <label className="block mb-2">Cerinta</label>
                    <textarea className="w-full border p-2" rows={4} value={cerinta} onChange={(e) => setCerinta(e.target.value)} placeholder="Introduceți cerința în LaTeX" />
                </div>

                {/* Textarea Rezolvare */}
                <div className="mb-4">
                    <label className="block mb-2">Rezolvare</label>
                    <textarea className="w-full border p-2" rows={4} value={rezolvare} onChange={(e) => setRezolvare(e.target.value)} placeholder="Introduceți rezolvarea în LaTeX" />
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Adaugă
                    </button>
                    <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => router.push("/admin")}>
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}
