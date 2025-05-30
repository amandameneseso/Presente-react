import "../styles/home.css";
// import "../styles/style.css";
import "../styles/urso.css";
import Clouds from "../components/Clouds";
import { useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${import.meta.env.BASE_URL}js/urso.js`; // ou mova esse JS para um componente React depois
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Clouds />

      <div className="botoes-container">
        <Link to="/momentos" className="botao">
          <img src={`${import.meta.env.BASE_URL}imagens/câmera-100.png`} className="icone" alt="Momentos" />
          <span>Momentos</span>
        </Link>
        <Link to="/jornada" className="botao">
          <img src={`${import.meta.env.BASE_URL}imagens/relógio-100.png`} className="icone" alt="Jornada" />
          <span>Jornada</span>
        </Link>
        <Link to="/carta" className="botao">
          <img src={`${import.meta.env.BASE_URL}imagens/mensagem-100.png`} className="icone" alt="Carta" />
          <span>Carta</span>
        </Link>
        <Link to="/quiz" className="botao">
          <img src={`${import.meta.env.BASE_URL}imagens/controle-100.png`} className="icone" alt="Quiz" />
          <span>Quiz</span>
        </Link>
        <Link to="/playlist" className="botao">
          <img src={`${import.meta.env.BASE_URL}imagens/música-100.png`} className="icone" alt="Playlist" />
          <span>Playlist</span>
        </Link>
        <Link to="/outrojogo" className="botao">
          <img src="" className="icone" alt="" />
          <span>Outro Jogo</span>
        </Link>
      </div>

      <div className="musicbox">
        <img src={`${import.meta.env.BASE_URL}imagens/recordplayer.png`} alt="Vitrola" />
        <iframe
          src="https://open.spotify.com/embed/track/37Q5anxoGWYdRsyeXkkNoI?utm_source=generator"
          width="100%"
          height="552"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>

      {/* Urso */}
      <div className="wrapper show-message"></div>

      <Footer />
    </>
  );
}

export default Home;
