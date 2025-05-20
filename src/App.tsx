import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Momentos from "./pages/Momentos";
import Jornada from "./pages/Jornada";
import Carta from "./pages/Carta";
import Playlist from "./pages/Playlist";
import Jogos from "./pages/Jogos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/momentos" element={<Momentos />} />
        <Route path="/jornada" element={<Jornada />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/jogos" element={<Jogos />} />
      </Routes>
    </Router>
  );
}

export default App;
