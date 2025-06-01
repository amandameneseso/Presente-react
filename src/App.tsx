import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Momentos from "./pages/Momentos";
import Jornada from "./pages/Jornada";
import Carta from "./pages/Carta";
import Playlist from "./pages/Playlist";
import Quiz from "./pages/Quiz";
import Desejo from "./pages/Desejo";
import BackgroundProvider from "./components/Backgroundprovider";
import { MusicProvider } from "./context/MusicPlayerContext";
// import MiniPlayer from "./components/MiniPlayer";

function App() {
  return (
    <Router>
      <MusicProvider>
        <BackgroundProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/momentos" element={<Momentos />} />
            <Route path="/jornada" element={<Jornada />} />
            <Route path="/carta" element={<Carta />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/desejo" element={<Desejo />} />
          </Routes>
          {/* <MiniPlayer /> */}
        </BackgroundProvider>
      </MusicProvider>
    </Router>
  );
}

export default App;
