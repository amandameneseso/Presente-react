import React, { createContext, useContext, useEffect, useState } from "react";
import dayBackground from "/imagens/background-desktop.png";
import nightBackground from "/imagens/background-desktop-noite.png";
import styles from "../styles/BackGroundChanger.module.css";

interface BackgroundContextData {
  backgroundImage: string | null;
  setBackgroundImage: (url: string) => void;
  resetBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextData | undefined>(
  undefined
);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground deve ser usado dentro de BackgroundProvider");
  }
  return context;
};

interface BackgroundProviderProps {
  children: React.ReactNode;
}

const LOCAL_STORAGE_KEY = "customBackgroundImage";

const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const [isDay, setIsDay] = useState(true);
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);

  useEffect(() => {
    // Carregar background salvo no localStorage, se existir
    const savedBackground = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBackground) {
      setBackgroundImageState(savedBackground);
    }
  }, []);

  useEffect(() => {
    const updateBackground = () => {
      const dataAtual = new Date();
      const horaAtual = dataAtual.getHours();
      const horaDiaInicio = 6;
      const horaNoiteInicio = 18;
      const newIsDay =
        horaAtual >= horaDiaInicio && horaAtual < horaNoiteInicio;
      if (newIsDay !== isDay) {
        setIsDay(newIsDay);
      }
    };

    updateBackground();
    const intervalId = setInterval(updateBackground, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isDay]);

  const setBackgroundImage = (url: string) => {
    setBackgroundImageState(url);
    localStorage.setItem(LOCAL_STORAGE_KEY, url);
  };

  const resetBackground = () => {
    setBackgroundImageState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const backgroundStyle = {
    backgroundImage: backgroundImage
      ? `url(${backgroundImage})`
      : `url(${isDay ? dayBackground : nightBackground})`,
  };

  return (
    <BackgroundContext.Provider
      value={{ backgroundImage, setBackgroundImage, resetBackground }}
    >
      <div className={styles.backgroundContainer} style={backgroundStyle}>
        {children}
      </div>
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider;
