// src/pages/Index.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import indexStyles from "../styles/index.module.css";
import contentStyles from "../styles/contentWrapper.module.css";
import clickSoundFile from "/musicas/efeito-sonoro-presente.wav";
import Clouds from "../components/Clouds";

function Index() {
  const [isActive, setIsActive] = useState(false); // Novo estado para controlar a ativação
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const navigate = useNavigate();

  // Inicializa o som uma vez
  useEffect(() => {
    clickSoundRef.current = new Audio(clickSoundFile);
  }, []);

  const handleClick = () => {
    if (!isActive) { // Usa o estado isActive
      // Tocar som
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play();
        setTimeout(() => {
          clickSoundRef.current?.pause();
        }, 1500);
      }

      setIsActive(true); // Ativa todas as animações via estado

      // Delay e redirecionamento
      setTimeout(() => {
        document.getElementById("app-root")?.classList.add("fade-out");
        setTimeout(() => {
          navigate("/home"); // Redireciona para Home
        }, 500);
      }, 1500);
    }
  };

  return (
    <>
      <div className={contentStyles.contentWrapper}>
        <div
          className={`${indexStyles.container} ${isActive ? indexStyles.active : ""}`}
          onClick={handleClick}
        >
          <div className={`${indexStyles.giftBox} ${isActive ? indexStyles.active : ""}`}>
            <div className={`${indexStyles.click} ${isActive ? indexStyles.active : ""}`}></div>
          </div>
          <div className={`${indexStyles.shadow} ${isActive ? indexStyles.active : ""}`}></div>

          {/* Renderiza as estrelas dinamicamente */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i} // Chave única para cada elemento em um loop
              className={`${indexStyles.boxStar} ${isActive ? indexStyles.active : ""} ${indexStyles[`boxStar-${i + 1}`] || ''}`}
            ></div>
          ))}
        </div>
      </div>

      <Clouds />
    </>
  );
}

export default Index;