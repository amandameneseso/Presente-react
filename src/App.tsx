import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Momentos from "./pages/Momentos";
import Jornada from "./pages/Jornada";
import Carta from "./pages/Carta";
import Playlist from "./pages/Playlist";
import Quiz from "./pages/Quiz";
import OutroJogo from "./pages/OutroJogo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/momentos" element={<Momentos />} />
        <Route path="/jornada" element={<Jornada />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/outrojogo" element={<OutroJogo />} />
      </Routes>
    </Router>
  );
}

export default App;
