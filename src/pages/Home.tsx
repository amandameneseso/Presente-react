import "../styles/home.css";
import "../styles/style.css";
import "../styles/urso.css";
import Clouds from "../components/Clouds";
import { useEffect } from 'react';
import Footer from "../components/Footer";

function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '../js/urso.js'; // ou mova esse JS para um componente React depois
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
        <a href="/momentos" className="botao">
          <img src="/imagens/câmera-100.png" className="icone" alt="Momentos" />
          <span>Momentos</span>
        </a>
        <a href="/jornada" className="botao">
          <img src="/imagens/relógio-100.png" className="icone" alt="Jornada" />
          <span>Jornada</span>
        </a>
        <a href="/carta" className="botao">
          <img src="/imagens/mensagem-100.png" className="icone" alt="Carta" />
          <span>Carta</span>
        </a>
        <a href="/jogos" className="botao">
          <img src="/imagens/controle-100.png" className="icone" alt="Jogos" />
          <span>Jogos</span>
        </a>
        <a href="/playlist" className="botao">
          <img src="/imagens/música-100.png" className="icone" alt="Playlist" />
          <span>Playlist</span>
        </a>
      </div>

      <div className="musicbox">
        <img src="/imagens/recordplayer.png" alt="Vitrola" />
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
