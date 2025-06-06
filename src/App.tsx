import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Momentos from "./pages/Momentos";
import Jornada from "./pages/Jornada";
import Carta from "./pages/Carta";
import Playlist from "./pages/Playlist";
import Quiz from "./pages/Quiz";
import Desejo from "./pages/Desejo";
import Login from "./pages/Login";
// import Register from "./pages/Register"; // Comentado pois não está sendo usado no momento
import Profile from "./pages/Profile.tsx";
import BackgroundProvider from "./components/Backgroundprovider";
import { MusicProvider } from "./context/MusicPlayerContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
// import MiniPlayer from "./components/MiniPlayer";

// Componente de rota protegida que verifica autenticação
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <BackgroundProvider>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/profile" element={<Profile />} />

              {/* Rotas acessíveis sem login */}
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
      </AuthProvider>
    </Router>
  );
}

export default App;
