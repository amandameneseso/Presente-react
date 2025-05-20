// src/pages/Jornada.tsx
import React, { useState, useEffect } from 'react';
import Clouds from '../components/Clouds';
import BotaoVoltar from '../components/BotaoVoltar';
import Footer from '../components/Footer';
import '../styles/jornada.css';

const startDate = new Date('2024-07-04T17:00:00');

const Jornada: React.FC = () => {
  // Estado para os valores do contador
  const [countdown, setCountdown] = useState({
    dias: '00',
    horas: '00',
    minutos: '00',
    segundos: '00',
  });

  // useEffect para lidar com o intervalo do temporizador
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      // Calcula os componentes de tempo
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      // Adiciona zeros à esquerda se necessário
      setCountdown({
        dias: String(d).padStart(2, '0'),
        horas: String(h).padStart(2, '0'),
        minutos: String(m).padStart(2, '0'),
        segundos: String(s).padStart(2, '0'),
      });
    };

    // Atualização inicial para exibir os valores imediatamente
    updateTimer();

    // Configura o intervalo e armazena seu ID
    const intervalId = setInterval(updateTimer, 1000);

    // Função de limpeza: limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []); // O array de dependências agora está vazio, pois startDate é uma constante estável

  return (
    <>
      <Clouds />

      <h1 id="frase">Há quanto tempo estamos juntos?</h1>

      <div id="countdown" className="countdown">
        <div className="side-left"></div>
        <div className="side-right"></div>
        <div className="time">
          <h2 id="dias">{countdown.dias}</h2>
          <small>dias</small>
        </div>

        <div className="time">
          <h2 id="horas">{countdown.horas}</h2>
          <small>horas</small>
        </div>

        <div className="time">
          <h2 id="minutos">{countdown.minutos}</h2>
          <small>minutos</small>
        </div>

        <div className="time">
          <h2 id="segundos">{countdown.segundos}</h2>
          <small>segundos</small>
        </div>
      </div>

      <BotaoVoltar />

      <Footer />
    </>
  );
};

export default Jornada;