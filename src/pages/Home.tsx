import styles from"../styles/home.module.css";
// import globalStyle from "../styles/style.module.css";
// import ursoStyles from"../styles/urso.module.css";
import Clouds from "../components/Clouds";
import { useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import MiniPlayer from "../components/MiniPlayer";

function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "../js/urso.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Clouds />

      <MiniPlayer />

      <div className={styles.botoesWrapper}>
        <div className={styles.botoesContainer}>
          <Link to="/momentos" className={styles.botao}>
            <img src="/imagens/câmera-100.png" className={styles.icone} alt="Momentos" />
            <span>Momentos</span>
          </Link>
          <Link to="/jornada" className={styles.botao}>
            <img src="/imagens/relógio-100.png" className={styles.icone} alt="Jornada" />
            <span>Jornada</span>
          </Link>
          <Link to="/carta" className={styles.botao}>
            <img src="/imagens/mensagem-100.png" className={styles.icone} alt="Carta" />
            <span>Carta</span>
          </Link>
          <Link to="/quiz" className={styles.botao}>
            <img src="/imagens/controle-100.png" className={styles.icone} alt="Quiz" />
            <span>Quiz</span>
          </Link>
          <Link to="/playlist" className={styles.botao}>
            <img src="/imagens/apple-music-100.png" className={styles.icone} alt="Playlist" />
            <span>Playlist</span>
          </Link>
          {/* <Link to="/lagodosdesejos" className={styles.botao}>
            <img src="" className="icone" alt="" />
            <span>Desejo</span>
          </Link> */}
          <Link to="/desejo" className={styles.botao}>
            <img src="/imagens/noite-nublada-100.png" className={styles.icone} alt="" />
            <span>Desejo</span>
          </Link>
        </div>
        {/* <div className={styles.musicbox}>
          <img src="/imagens/recordplayer.png" alt="Vitrola" />
          <iframe
            src="https://open.spotify.com/embed/track/37Q5anxoGWYdRsyeXkkNoI?utm_source=generator"
            width="100%"
            height="552"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div> */}
      </div>

      {/* Urso */}
      {/* <div className={ursoStyles.urso}></div> */}

      <Footer />
    </>
  );
}

export default Home;
