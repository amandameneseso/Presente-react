import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import "../styles/index.css";
import clickSoundFile from "/musicas/efeito-sonoro-presente.wav";
import Clouds from "../components/Clouds";

function Index() {
  const clickRef = useRef<HTMLDivElement>(null);
  const giftBoxRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<NodeListOf<HTMLDivElement> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const clickEl = clickRef.current;
    const giftBoxEl = giftBoxRef.current;
    const shadowEl = shadowRef.current;
    const containerEl = containerRef.current;

    const clickSound = new Audio(clickSoundFile);

    if (!clickEl || !giftBoxEl || !shadowEl || !containerEl) return;

    const handleClick = () => {
      if (!clickEl.classList.contains("active")) {
        // Tocar som
        clickSound.currentTime = 0;
        clickSound.play();
        setTimeout(() => {
          clickSound.pause();
        }, 1500);

        // Adicionar classes
        clickEl.classList.add("active");
        giftBoxEl.classList.add("active");
        shadowEl.classList.add("active");
        containerEl.classList.add("active");

        // Ativar estrelas
        if (starsRef.current) {
          starsRef.current.forEach((star) => {
            star.classList.add("active");
          });
        }

        // Delay e redirecionamento
        setTimeout(() => {
          document.getElementById("app-root")?.classList.add("fade-out"); // adiciona a classe fade-out ao app-root
          setTimeout(() => {
            navigate("/home"); // Redireciona para Home
          }, 500);
        }, 1500);
      }
    };

    clickEl.addEventListener("click", handleClick);
    return () => {
      clickEl.removeEventListener("click", handleClick);
    };
  }, [navigate]);

  useEffect(() => {
    starsRef.current = document.querySelectorAll(".box-star");
  }, []);

  return (
    <>
      <div className="content-wrapper">
        <div className="container" ref={containerRef}>
          <div className="gift-box" ref={giftBoxRef}>
            <div className="click" ref={clickRef}></div>
          </div>
          <div className="shadow" ref={shadowRef}></div>
          <div className="box-star box-star-1"></div>
          <div className="box-star box-star-2"></div>
          <div className="box-star box-star-3"></div>
          <div className="box-star box-star-4"></div>
          <div className="box-star box-star-5"></div>
        </div>
      </div>

      <Clouds />
    </>
  );
}

export default Index;
