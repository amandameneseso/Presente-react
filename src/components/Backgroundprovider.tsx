import { useState, useEffect } from "react";
import dayBackground from "/imagens/background-desktop.png";
import nightBackground from "/imagens/background-desktop-noite.png";
import styles from "../styles/BackGroundChanger.module.css";

interface BackgroundProviderProps {
  children: React.ReactNode;
}

const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
}) => {
  const [isDay, setIsDay] = useState(true);

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
    const intervalId = setInterval(updateBackground, 60 * 1000); // A cada 1 minuto

    return () => {
      clearInterval(intervalId);
    };
  }, [isDay]);

  const backgroundStyle = {
    backgroundImage: `url(${isDay ? dayBackground : nightBackground})`,
  };

  return (
    <div className={styles.backgroundContainer} style={backgroundStyle}>
      {/* Crie um div para o conteúdo principal e aplique estilos a ele */}
      {children}
    </div>
  );
};

export default BackgroundProvider;
