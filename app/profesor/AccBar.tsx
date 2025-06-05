import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./Profesor.module.css";
import {
  Modal,
  Box,
  Typography,
  Slider,
  Button,
  Snackbar,
  Tabs,
  Tab,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardHeader,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  CardContent,
  Chip
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API = "http://localhost:8000";

type UnassignedElev = { idelev: number; fullName: string };
type MyElev = { idelev: number; fullName: string; clasa: number };

type SubjectDatum = {
  chapter: number;
  subchapter: number;
  avg_score: number;
  teacher_diff: "easy" | "medium" | "hard";
  student_diff: "easy" | "medium" | "hard";
  calc_err_freq: number;
  conc_err_freq: number;
  time_taken: number;
};

type ClusteredSubject = {
  chapter: number;
  subchapter: number;
  cluster: number;
};

// All 43 subchapters
const ALL_SUBCHAPTERS: {
  chapter: number;
  subchapter: number;
  subchapter_name: string;
  chapter_name: string;
}[] = [
  { chapter: 1, subchapter: 1, subchapter_name: "Operatii", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 1, subchapter: 2, subchapter_name: "Sume Gauss si sume speciale", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 1, subchapter: 3, subchapter_name: "Teorema impartirii cu rest", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 1, subchapter: 4, subchapter_name: "Divizibilitate si ultima cifra", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 1, subchapter: 5, subchapter_name: "Exercitii in baza 10 si de numeratie", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 1, subchapter: 6, subchapter_name: "Probleme aplicative", chapter_name: "Numere naturale si numere intregi" },
  { chapter: 2, subchapter: 7, subchapter_name: "Operatii", chapter_name: "Numere rationale" },
  { chapter: 2, subchapter: 8, subchapter_name: "Procente", chapter_name: "Numere rationale" },
  { chapter: 2, subchapter: 9, subchapter_name: "Probabilitati", chapter_name: "Numere rationale" },
  { chapter: 2, subchapter: 10, subchapter_name: "Rapoarte si proportii", chapter_name: "Numere rationale" },
  { chapter: 3, subchapter: 11, subchapter_name: "Operatii", chapter_name: "Numere reale" },
  { chapter: 3, subchapter: 12, subchapter_name: "Intervale", chapter_name: "Numere reale" },
  { chapter: 4, subchapter: 13, subchapter_name: "Ecuatii", chapter_name: "Ecuatii, inecuatii si sisteme" },
  { chapter: 4, subchapter: 14, subchapter_name: "Inecuatii", chapter_name: "Ecuatii, inecuatii si sisteme" },
  { chapter: 4, subchapter: 15, subchapter_name: "Sisteme", chapter_name: "Ecuatii, inecuatii si sisteme" },
  { chapter: 4, subchapter: 16, subchapter_name: "Modul", chapter_name: "Ecuatii, inecuatii si sisteme" },
  { chapter: 5, subchapter: 17, subchapter_name: "Produsul cartezian", chapter_name: "Functii" },
  { chapter: 5, subchapter: 18, subchapter_name: "Probleme cu functii", chapter_name: "Functii" },
  { chapter: 6, subchapter: 19, subchapter_name: "Operatii", chapter_name: "Calcul algebric" },
  { chapter: 6, subchapter: 20, subchapter_name: "Descompuneri", chapter_name: "Calcul algebric" },
  { chapter: 7, subchapter: 21, subchapter_name: "Calcule cu segmente", chapter_name: "Segmente si unghiuri" },
  { chapter: 7, subchapter: 22, subchapter_name: "Calcule cu unghiuri", chapter_name: "Segmente si unghiuri" },
  { chapter: 8, subchapter: 23, subchapter_name: "Linii importante", chapter_name: "Triunghiul" },
  { chapter: 8, subchapter: 24, subchapter_name: "Cazuri de congruenta", chapter_name: "Triunghiul" },
  { chapter: 8, subchapter: 25, subchapter_name: "Triunghiul echilateral", chapter_name: "Triunghiul" },
  { chapter: 8, subchapter: 26, subchapter_name: "Triunghiul dreptunghic", chapter_name: "Triunghiul" },
  { chapter: 8, subchapter: 27, subchapter_name: "Arii si perimetre", chapter_name: "Triunghiul" },
  { chapter: 9, subchapter: 28, subchapter_name: "Probleme cu cercul", chapter_name: "Cercul" },
  { chapter: 10, subchapter: 29, subchapter_name: "Paralelogram, Dreptunghi, Patrat, Romb", chapter_name: "Patrulatere" },
  { chapter: 10, subchapter: 30, subchapter_name: "Arii si perimetre", chapter_name: "Patrulatere" },
  { chapter: 10, subchapter: 31, subchapter_name: "Poligoane regulate", chapter_name: "Patrulatere" },
  { chapter: 10, subchapter: 32, subchapter_name: "Trapezul", chapter_name: "Patrulatere" },
  { chapter: 10, subchapter: 33, subchapter_name: "Asemanarea", chapter_name: "Patrulatere" },
  { chapter: 11, subchapter: 34, subchapter_name: "Piramida", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 35, subchapter_name: "Prisma", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 36, subchapter_name: "Conul si trunchiul de con", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 37, subchapter_name: "Cilindrul", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 38, subchapter_name: "Paralelism in spatiu", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 39, subchapter_name: "Perpendicularitate in spatiu", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 40, subchapter_name: "Unghiul a 2 drepte", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 41, subchapter_name: "Unghiul dintre dreapta si plan", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 42, subchapter_name: "Unghiul dintre 2 plane", chapter_name: "Geometrie in spatiu" },
  { chapter: 11, subchapter: 43, subchapter_name: "Calcul de distante", chapter_name: "Geometrie in spatiu" },
];

const NAME_LOOKUP = ALL_SUBCHAPTERS.reduce((acc, s) => ({
  ...acc,
  [`${s.chapter}-${s.subchapter}`]: {
    chapterName: s.chapter_name,
    subchapterName: s.subchapter_name
  }
}), {});

export default function AccBar() {
  const [user, setUser] = useState<{ nume: string; prenume: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // — Enroll/Elevi modal state
  const [openEnroll, setOpenEnroll] = useState(false);
  const [tabEnroll, setTabEnroll] = useState(0);
  const [search, setSearch] = useState("");
  const [allElevi, setAllElevi] = useState<UnassignedElev[]>([]);
  const [results, setResults] = useState<UnassignedElev[]>([]);
  const [myElevi, setMyElevi] = useState<MyElev[]>([]);

  // — Statistics modal state
  const [openStats, setOpenStats] = useState(false);
  const [tabStats, setTabStats] = useState(0);
  const [dateHist, setDateHist] = useState<{ subject_data: SubjectDatum[]; n_clusters: number }>({
    subject_data: [],
    n_clusters: 2,
  });
  const [clusters, setClusters] = useState<ClusteredSubject[]>([]);
  const [saving, setSaving] = useState(false);
  const [classifying, setClassifying] = useState(false);

  // — Global error for Snackbar
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load user & redirect if not profesor
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/auth/user`, { withCredentials: true });
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
    await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    router.push("/login");
  };

  // — Enroll/Elevi handlers
  const openEnrollModal = () => {
    setErrorMsg(null);
    setSearch("");
    setResults([]);
    setTabEnroll(0);
    setOpenEnroll(true);
  };
  const closeEnrollModal = () => setOpenEnroll(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      setErrorMsg("Introduceți un termen de căutare.");
      return;
    }
    try {
      if (allElevi.length === 0) {
        const res = await axios.get<UnassignedElev[]>(
          `${API}/api/elevi/unassigned`,
          { withCredentials: true }
        );
        setAllElevi(res.data);
        setResults(res.data.filter(e =>
          e.fullName.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setResults(allElevi.filter(e =>
          e.fullName.toLowerCase().includes(search.toLowerCase())
        ));
      }
    } catch {
      setErrorMsg("Eroare la încărcarea elevilor.");
    }
  };

  const handleEnroll = async (idelev: number) => {
    try {
      await axios.post(
        `${API}/api/elevi/enroll/${idelev}`,
        {},
        { withCredentials: true }
      );
      setResults(prev => prev.filter(e => e.idelev !== idelev));
      setAllElevi(prev => prev.filter(e => e.idelev !== idelev));
    } catch (err: unknown) {
      setErrorMsg(
        axios.isAxiosError(err)
          ? err.response?.data?.error || "Eroare la înrolare."
          : err instanceof Error
            ? err.message
            : "Eroare la înrolare."
      );
    }
  };

  const loadMyElevi = async () => {
    try {
      const res = await axios.get<MyElev[]>(
        `${API}/api/elevi/my`,
        { withCredentials: true }
      );
      setMyElevi(res.data.sort((a, b) => a.fullName.localeCompare(b.fullName)));
    } catch {
      setErrorMsg("Eroare la încărcarea elevilor mei.");
    }
  };

  const handleEnrollTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTabEnroll(newTab);
    setErrorMsg(null);
    if (newTab === 1) loadMyElevi();
  };

  // — Statistics handlers
  const openStatsModal = async () => {
    setErrorMsg(null);
    setOpenStats(true);
    try {
      const res = await axios.get<{ subject_data: SubjectDatum[]; n_clusters: number }>(
        `${API}/api/profesori/getdatehist`,
        { withCredentials: true }
      );
      if (res.data.subject_data.length === ALL_SUBCHAPTERS.length) {
        setDateHist(res.data);
      } else {
        setDateHist({
          n_clusters: res.data.n_clusters ?? 2,
          subject_data: ALL_SUBCHAPTERS.map(s => ({
            chapter: s.chapter,
            subchapter: s.subchapter,
            avg_score: 0,
            teacher_diff: "easy",
            student_diff: "easy",
            calc_err_freq: 0,
            conc_err_freq: 0,
            time_taken: 0,
          }))
        });
      }
    } catch {
      setDateHist({
        n_clusters: 2,
        subject_data: ALL_SUBCHAPTERS.map(s => ({
          chapter: s.chapter,
          subchapter: s.subchapter,
          avg_score: 0,
          teacher_diff: "easy",
          student_diff: "easy",
          calc_err_freq: 0,
          conc_err_freq: 0,
          time_taken: 0,
        }))
      });
    }
  };
  const closeStatsModal = () => {
    setOpenStats(false);
    setTabStats(0);
    setClusters([]);
  };

  const handleFieldChange = (
    idx: number,
    field: keyof SubjectDatum,
    value: any
  ) => {
    setDateHist(d => {
      const sd = [...d.subject_data];
      // @ts-ignore
      sd[idx][field] = value;
      return { ...d, subject_data: sd };
    });
  };

  const saveDateHist = async () => {
    setSaving(true);
    try {
      await axios.post(
        `${API}/api/profesori/savedatehist`,
        { dateistorice: dateHist },
        { withCredentials: true }
      );
    } catch {
      setErrorMsg("Eroare la salvarea datelor istorice.");
    } finally {
      setSaving(false);
    }
  };

  const classify = async () => {
    setClassifying(true);
    try {
      await saveDateHist();
      const res = await axios.post<{ clusters: ClusteredSubject[] }>(
        `${API}/api/profesori/cluster-dateistorice`,
        {},
        { withCredentials: true }
      );
      setClusters(res.data.clusters); 
      setTabStats(1);
    } catch {
      setErrorMsg("Eroare la clasificare.");
    } finally {
      setClassifying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }
  if (!user) return null;

  return (
    <>
      <header className={styles.accBar}>
        <div><strong>Bun venit,</strong> {user.nume} {user.prenume}</div>
        <div>
          <Button onClick={openEnrollModal}>Gestionare elevi</Button>
          <Button onClick={openStatsModal}>Statistică</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* — Enroll/Elevi Modal — */}
      <Modal open={openEnroll} onClose={closeEnrollModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 450, p: 3,
          bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2
        }}>
          <Tabs value={tabEnroll} onChange={handleEnrollTabChange}>
            <Tab label="Înrolează" />
            <Tab label="Elevii mei" />
          </Tabs>

          {tabEnroll === 0 && (
            <>
              <Typography variant="h6" mt={2}>Caută și înrolează elevi</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Nume elev"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
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

          {tabEnroll === 1 && (
            <>
              <Typography variant="h6" mt={2}>Elevii mei</Typography>
              <Box sx={{
                maxHeight: 300, overflowY: 'auto',
                mt: 1, border: '1px solid #ddd', borderRadius: 1, p: 1
              }}>
                {myElevi.length > 0 ? myElevi.map(e => (
                  <Box key={e.idelev}
                    sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <span>{e.fullName}</span>
                    <Typography variant="body2">Clasa: {e.clasa}</Typography>
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
            <Button onClick={closeEnrollModal}>Închide</Button>
          </Box>
        </Box>
      </Modal>

      {/* — STATISTICĂ Modal — */}
      <Modal open={openStats} onClose={closeStatsModal}>
        <Box sx={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'90%', maxWidth:900, height:'80vh', bgcolor:'background.paper', boxShadow:24, borderRadius:2, display:'flex', flexDirection:'column' }}>
          <Tabs value={tabStats} onChange={(_,v)=>setTabStats(v)}>
            <Tab label="Date istorice" />
            <Tab label="Clasificare" disabled={!clusters.length} />
          </Tabs>

          {tabStats === 0 && (
            <Box sx={{ overflowY:'auto', flex:1, p:2 }}>
              {dateHist.subject_data.map((s, i) => {
                const key = `${s.chapter}-${s.subchapter}`;
                const names = NAME_LOOKUP[key];
                return (
                  <Accordion key={key} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{names.chapterName}: {names.subchapterName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                          <Typography gutterBottom>Scor mediu ({s.avg_score.toFixed(1)})</Typography>
                          <Slider value={s.avg_score} min={0} max={5} step={0.1} valueLabelDisplay="auto"
                            onChange={(_, v) => handleFieldChange(i, 'avg_score', v)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Diff profesor</InputLabel>
                            <Select value={s.teacher_diff} label="Diff profesor"
                              onChange={e => handleFieldChange(i, 'teacher_diff', e.target.value)}>
                              <MenuItem value="easy">Ușor</MenuItem>
                              <MenuItem value="medium">Mediu</MenuItem>
                              <MenuItem value="hard">Greu</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Diff student</InputLabel>
                            <Select value={s.student_diff} label="Diff student"
                              onChange={e => handleFieldChange(i, 'student_diff', e.target.value)}>
                              <MenuItem value="easy">Ușor</MenuItem>
                              <MenuItem value="medium">Mediu</MenuItem>
                              <MenuItem value="hard">Greu</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography gutterBottom>Erori calcul ({s.calc_err_freq.toFixed(2)})</Typography>
                          <Slider value={s.calc_err_freq} min={0} max={1} step={0.01} valueLabelDisplay="auto"
                            onChange={(_, v) => handleFieldChange(i, 'calc_err_freq', v)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography gutterBottom>Erori conceptuale ({s.conc_err_freq.toFixed(2)})</Typography>
                          <Slider value={s.conc_err_freq} min={0} max={1} step={0.01} valueLabelDisplay="auto"
                            onChange={(_, v) => handleFieldChange(i, 'conc_err_freq', v)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography gutterBottom>Timp mediu ({s.time_taken.toFixed(1)} min)</Typography>
                          <Slider value={s.time_taken} min={0} max={10} step={0.1} valueLabelDisplay="auto"
                            onChange={(_, v) => handleFieldChange(i, 'time_taken', v)} />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}

          {tabStats === 1 && (
            <Box sx={{ flex:1, overflowY:'auto', p:2 }}>
              <Grid container spacing={2}>
                {[...new Set(clusters.map(c => c.cluster))].map(clusterId => {
                  const title = clusterId === 0 ? 'Subiecte agreate'
                    : clusterId === 1 ? 'Subiecte problematice'
                    : 'Altele';
                  const items = clusters.filter(c => c.cluster === clusterId);
                  return (
                    <Grid item xs={12} md={4} key={clusterId}>
                      <Card>
                        <CardHeader title={`Categoria ${clusterId+1}`} subheader={title} />
                        <CardContent>
                          {items.map(c => {
                            const key = `${c.chapter}-${c.subchapter}`;
                            const names = NAME_LOOKUP[key];
                            return <Chip key={key} label={`${names.chapterName}: ${names.subchapterName}`} sx={{ m:0.5 }} />;
                          })}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          <Box sx={{ display:'flex', justifyContent:'space-between', p:2 }}>
            <Box>
              <Button onClick={saveDateHist} disabled={saving} variant="outlined">
                {saving ? 'Salvarea...' : 'Salvează'}
              </Button>
              <Button onClick={classify} disabled={classifying} variant="contained" sx={{ ml:2 }}>
                {classifying ? 'Clasificare...' : 'Clasifică'}
              </Button>
            </Box>
            <Button onClick={closeStatsModal}>Închide</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg(null)}
        message={errorMsg}
      />  
    </>
  );
}
