'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Profesor.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

type UnassignedElev = { idelev: number; fullName: string };
type MyElev = { idelev: number; fullName: string; clasa: number };

export default function AccBar() {
  const [user, setUser] = useState<{ nume: string; prenume: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);        
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);


  const [allElevi, setAllElevi] = useState<UnassignedElev[]>([]);
  const [results, setResults] = useState<UnassignedElev[]>([]);


  const [myElevi, setMyElevi] = useState<MyElev[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/user", { withCredentials: true });
        setUser(res.data);
        if (res.data.role === "elev") router.replace("/elev");
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleLogout = async () => {
    await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
    router.push("/login");
  };

  const openModal = () => {
    setError(null);
    setSearch("");
    setResults([]);
    setTab(0);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Introduceți un termen de căutare.");
      return;
    }
    try {
      if (allElevi.length === 0) {
        const res = await axios.get<UnassignedElev[]>(
          "http://localhost:8000/api/elevi/unassigned",
          { withCredentials: true }
        );
        setAllElevi(res.data);
        setResults(res.data.filter((e: UnassignedElev) =>
          e.fullName.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setResults(allElevi.filter((e: UnassignedElev) =>
          e.fullName.toLowerCase().includes(search.toLowerCase())
        ));
      }
    } catch {
      setError("Eroare la încărcarea elevilor.");
    }
  };
  

  const handleEnroll = async (idelev: number) => {
    try {
      await axios.post(
        `http://localhost:8000/api/elevi/enroll/${idelev}`,
        {},
        { withCredentials: true }
      );
      setResults(prev => prev.filter(e => e.idelev !== idelev));
      setAllElevi(prev => prev.filter(e => e.idelev !== idelev));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Eroare la înrolare.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Eroare la înrolare.");
      }
    }
  };


  const loadMyElevi = async () => {
    try {
      const res = await axios.get<MyElev[]>(
        "http://localhost:8000/api/elevi/my",
        { withCredentials: true }
      );
      const sorted = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setMyElevi(sorted);
    } catch {
      setError("Eroare la încărcarea elevilor mei.");
    }
  };
  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
    setError(null);
    if (newTab === 1) {
      loadMyElevi();
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}><div className={styles.spinner}></div></div>;
  }
  if (!user) return null;

  return (
    <>
      <header className={styles.accBar}>
        <div><strong>Bun venit,</strong> {user.nume} {user.prenume}</div>
        <div>
          <Button onClick={openModal}>Gestionare elevi</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <Modal open={open} onClose={closeModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 450, p: 3,
          bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2
        }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Înrolează" />
            <Tab label="Elevii mei" />
          </Tabs>

          {tab === 0 && (
            <>
              <Typography variant="h6" mt={2}>Caută și înrolează elevi</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  fullWidth label="Nume elev"
                  value={search} onChange={e => setSearch(e.target.value)}
                />
                <Button variant="contained" onClick={handleSearch}>Caută</Button>
              </Box>
              <Box sx={{
                maxHeight: 250, overflowY: 'auto',
                mt: 2, border: '1px solid #ddd', borderRadius: 1, p: 1
              }}>
                {results.length > 0 ? results.map(e => (
                  <Box key={e.idelev}
                       sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>{e.fullName}</span>
                    <Button size="small" onClick={() => handleEnroll(e.idelev)}>Înrolează</Button>
                  </Box>
                )) : (
                  <Typography variant="body2" color="text.secondary">
                    {allElevi.length === 0
                      ? "Nu ați căutat încă."
                      : `Niciun elev găsit pentru „${search}”.`}
                  </Typography>
                )}
              </Box>
            </>
          )}

          {tab === 1 && (
            <>
              <Typography variant="h6" mt={2}>Elevii mei</Typography>
              <Box sx={{
              maxHeight: 300, overflowY: 'auto',
              mt: 1, border: '1px solid #ddd', borderRadius: 1, p: 1
            }} className={styles.eleviiContainer}>
              {myElevi.length > 0 ? myElevi.map(e => (
                <Box key={e.idelev}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <span className={styles.elevName}>{e.fullName}</span>
                  <Typography variant="body2" className={styles.clasa}>Clasa: {e.clasa}</Typography>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">
                  Nu ați înrolat niciun elev.
                </Typography>
              )}
            </Box>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeModal}>Închide</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        message={error}
      />
    </>
  );
}
