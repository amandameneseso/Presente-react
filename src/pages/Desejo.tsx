// src/pages/Teste.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/desejo.css"; // Ou import styles from "../styles/desejo.module.css";
// import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import contentStyles from "../styles/contentWrapper.module.css";

interface GhostLetterProps {
  letter: string;
  className: string;
  initialTop: number;
  initialLeft: number;
  index: number;
  totalLetters: number;
}

const GhostLetter: React.FC<GhostLetterProps> = ({
  letter,
  className,
  initialTop,
  initialLeft,
  index,
  totalLetters,
}) => {
  const [position, setPosition] = useState({
    top: initialTop,
    left: initialLeft,
  });
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const animationDelay = (totalLetters - index) * 150;

    const timeout = setTimeout(() => {
      setIsFixed(true);
      setPosition({
        top: -window.innerHeight / 2,
        left: initialLeft + window.innerWidth / 2,
      });
    }, animationDelay);

    return () => clearTimeout(timeout);
  }, [initialLeft, index, totalLetters]);

  return (
    <div
      className={`${className}${letter === " " ? " blank" : ""}`}
      style={{
        position: isFixed ? "fixed" : "absolute",
        top: position.top,
        left: position.left,
        color: "white",
        transition: isFixed ? "5s" : "0.1s",
        zIndex: 1000,
      }}
    >
      {letter}
    </div>
  );
};

const Desejo: React.FC = () => {
  const [name, setName] = useState("");
  const [formClass, setFormClass] = useState("");
  const [ghostLetters, setGhostLetters] = useState<GhostLetterProps[]>([]);
  // NOVO ESTADO: para controlar a classe que esconde o placeholder
  const [hidePlaceholderClass, setHidePlaceholderClass] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  // ... (código para a animação dos cometas - mantenha como está)
  const boddieRef = useRef<HTMLDivElement | null>(null);
  const cometsRef = useRef<HTMLDivElement[]>([]);
  const dxRef = useRef<number[]>([]);
  const dyRef = useRef<number[]>([]);
  const xposRef = useRef<number[]>([]);
  const yposRef = useRef<number[]>([]);
  const swideRef = useRef(800);
  const shighRef = useRef(600);

  const speed = 25;
  const how_often = 50;
  const how_many = 3;
  const colours = [
    "#0ff",
    "#64B5F6",
    "#42A5F5",
    "#2196F3",
    "#1976D2",
    "#1565C0",
    "#0D47A1",
    "#4A148C",
    "#6A1B9A",
    "#8E24AA",
    "#AB47BC",
    "#CE93D8",
  ];
  const tail = colours.length;

  const setWidth = useCallback(() => {
    swideRef.current = window.innerWidth;
    shighRef.current = window.innerHeight;
  }, []);

  const div = useCallback((w: number, h: number): HTMLDivElement => {
    const d = document.createElement("div");
    d.style.position = "absolute";
    d.style.overflow = "hidden";
    d.style.width = w + "px";
    d.style.height = h + "px";
    return d;
  }, []);

  const writeComet = useCallback(
    (a: number) => {
      for (let i = 0; i < tail; i++) {
        const s = 2 + (i < tail / 4 ? 1 : 0) + (i === 0 ? 2 : 0);
        const cometDiv = div(s, s);
        cometDiv.style.backgroundColor = colours[i];
        boddieRef.current?.appendChild(cometDiv);
        cometsRef.current[i + a] = cometDiv;
      }
    },
    [div, tail]
  );

  const stepthrough = useCallback(
    (a: number) => {
      const bottomMargin = 300;
      const leftMargin = 10;

      if (
        Math.random() < 0.008 ||
        yposRef.current[a] + dyRef.current[a] < 5 || // Cometa sai pela borda superior
        xposRef.current[a] + dxRef.current[a] < leftMargin || // Cometa sai pela borda esquerda
        xposRef.current[a] + dxRef.current[a] >= swideRef.current - 5 || // Cometa sai pela borda direita
        yposRef.current[a] + dyRef.current[a] >= shighRef.current - bottomMargin // Cometa sai pela borda inferior
      ) {
        for (let i = 0; i < tail; i++) {
          setTimeout(() => {
            if (cometsRef.current[i + a]) {
              cometsRef.current[i + a].style.visibility = "hidden";
            }
          }, speed * (tail - i));
        }
        setTimeout(
          () => launch(a),
          Math.max(500, 150 * Math.random() * how_often)
        );
      } else {
        setTimeout(() => stepthrough(a), speed);
      }

      for (let i = tail - 1; i >= 0; i--) {
        if (i) {
          xposRef.current[i + a] = xposRef.current[i + a - 1];
          yposRef.current[i + a] = yposRef.current[i + a - 1];
        } else {
          xposRef.current[i + a] += dxRef.current[a];
          yposRef.current[i + a] += dyRef.current[a];
        }
        if (cometsRef.current[i + a]) {
          cometsRef.current[i + a].style.left = xposRef.current[i + a] + "px";
          cometsRef.current[i + a].style.top = yposRef.current[i + a] + "px";
        }
      }
    },
    [tail, speed, how_often, shighRef, swideRef] // Adicione shighRef e swideRef nas dependências
  );

  const launch = useCallback(
    (a: number) => {
      dxRef.current[a] = -(1 + Math.random() * 2);
      dyRef.current[a] = 1 + Math.random() * 2;

      xposRef.current[a] =
        swideRef.current -
        tail * Math.abs(dxRef.current[a]) -
        Math.round(Math.random() * (swideRef.current / 2));

      yposRef.current[a] =
        tail * dyRef.current[a] +
        Math.round(Math.random() * (shighRef.current / 2));

      for (let i = 0; i < tail; i++) {
        xposRef.current[i + a] = xposRef.current[a];
        yposRef.current[i + a] = yposRef.current[a];
        if (cometsRef.current[i + a]) {
          cometsRef.current[i + a].style.visibility = "visible";
        }
      }
      stepthrough(a);
    },
    [stepthrough, tail, shighRef, swideRef]
  );

  useEffect(() => {
    if (!boddieRef.current) {
      const boddieDiv = document.createElement("div");
      boddieDiv.style.position = "fixed";
      boddieDiv.style.zIndex = "-1";
      boddieDiv.style.top = "0px";
      boddieDiv.style.left = "0px";
      boddieDiv.style.overflow = "visible";
      boddieDiv.style.width = "1px";
      boddieDiv.style.height = "1px";
      boddieDiv.style.backgroundColor = "transparent";
      document.body.appendChild(boddieDiv);
      boddieRef.current = boddieDiv;
    }

    setWidth();
    for (let i = 0; i < how_many; i++) {
      writeComet(i * tail);
      setTimeout(() => launch(i * tail), Math.max(1000 * i));
    }

    window.addEventListener("resize", setWidth);
    return () => {
      window.removeEventListener("resize", setWidth);
      if (boddieRef.current) {
        document.body.removeChild(boddieRef.current);
        boddieRef.current = null;
      }
    };
  }, [launch, setWidth, writeComet, how_many, tail]);

  const createGhostDiv = useCallback(
    (target: HTMLInputElement | HTMLTextAreaElement, className: string) => {
      const textToAnimate = target.value;
      if (!textToAnimate || !coverRef.current) return;

      const targetSpec = target.getBoundingClientRect();
      const letters = textToAnimate.split("").map((letter, i) => ({
        letter,
        className,
        initialTop: targetSpec.y,
        initialLeft: targetSpec.x + i * 8,
        index: i,
        totalLetters: textToAnimate.length,
      }));

      setGhostLetters((prev) => [...prev, ...letters]);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      // 1. Crie as letras fantasma
      if (nameInputRef.current) {
        createGhostDiv(nameInputRef.current, "name_letter");
      }

      // 2. Limpe o texto dos inputs
      setName("");

      // NOVO: Adiciona a classe para esconder o placeholder
      setHidePlaceholderClass("hide-placeholder");

      // Opcional: Adicionar a classe de fade para o formulário
      setFormClass("fade");

      const totalLetterCount = nameInputRef.current?.value.length || 0;

      // 3. Definir um tempo para resetar e mostrar o placeholder novamente
      setTimeout(() => {
        setFormClass("fade_in");
        setGhostLetters([]);
        // NOVO: Remove a classe para mostrar o placeholder novamente
        setHidePlaceholderClass("");
      }, 3000 + totalLetterCount * 100);
    },
    [createGhostDiv, setName]
  );

  return (
    <>

    {/* <Clouds /> */}

    <div className={contentStyles.contentWrapper}>
        <form className={`form ${formClass}`}>
          <div className="sideLeft"></div>
          <div className="sideRight"></div>
          <p className="text">Você encontrou cometas... Faça um desejo!</p>
          <div className="input">
            <input
              className={`name ${hidePlaceholderClass}`} // Keep the hidePlaceholderClass
              placeholder="Qual é o seu desejo?" // New placeholder text
              type="text"
              value={name} // Assuming you'll reuse 'name' state for this single input
              onChange={(e) => setName(e.target.value)}
              ref={nameInputRef} // Still reference the input
            />
          </div>
          <div className="button_wrapper">
            <button onClick={handleSubmit} className="buttonSend">enviar</button>
          </div>
        </form>
      <div className="cover" ref={coverRef}>
        {ghostLetters.map((g, index) => (
          <GhostLetter key={index} {...g} />
        ))}
      </div>
    </div>

    <BotaoVoltar />

    <Footer />

    </>
  );
};

export default Desejo;
