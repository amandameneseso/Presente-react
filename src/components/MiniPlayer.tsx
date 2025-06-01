// src/components/MiniPlayer.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react'; // Importa useCallback
import { useNavigate } from "react-router-dom";
import { useMusic } from "../context/MusicPlayerContext";

import styles from "../styles/miniplayer.module.css";

const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    prevSong,
    playlist,
    currentTime,
    duration,
    seekTo,
  } = useMusic();

  const navigate = useNavigate();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);

  // --- Handlers de Eventos dos Controles do Player ---
  const handlePlayPauseClick = () => {
    togglePlayPause();
  };

  const handleNextClick = () => {
    nextSong();
  };

  const handlePrevClick = () => {
    prevSong();
  };

  // --- Lógica da Barra de Progresso (Busca) ---

  const calculateSeekTime = useCallback((clientX: number): number => {
    if (!progressBarRef.current || duration === 0) return 0;
    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - progressBarRect.left;
    const percentage = Math.max(0, Math.min(1, clickX / progressBarRect.width));
    return percentage * duration;
  }, [duration]); // Dependência: 'duration' (é usada dentro da função)


  // Handler para quando o mouse é pressionado na barra de progresso
  // ENVOLVIDO EM useCallback
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!currentSong || duration === 0) return;
    setIsSeeking(true);
    const seekTime = calculateSeekTime(e.clientX);
    seekTo(seekTime);
  }, [currentSong, duration, calculateSeekTime, seekTo]); // Dependências: tudo que é usado na função


  // Handler para quando o mouse se move (usado para arrastar a barra)
  // ENVOLVIDO EM useCallback
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isSeeking && currentSong && duration > 0) {
      const seekTime = calculateSeekTime(e.clientX);
      seekTo(seekTime);
    }
  }, [isSeeking, currentSong, duration, calculateSeekTime, seekTo]); // Dependências: tudo que é usado na função


  // Handler para quando o botão do mouse é liberado (finaliza a busca)
  // ENVOLVIDO EM useCallback
  const handleMouseUp = useCallback(() => {
    setIsSeeking(false);
  }, []); // Dependências vazias, pois não usa nada de fora de seu escopo (além de setIsSeeking, que é um setter)


  // Efeito para anexar e remover listeners de mouse globais (para arrasto)
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]); // AGORA COM handleMouseMove e handleMouseUp como dependências

  // Se não houver música atual e a playlist estiver vazia, não renderiza o MiniPlayer
  if (!currentSong && playlist.length === 0) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.miniPlayer}>
      <img
        src={currentSong!.cover}
        alt={currentSong!.title}
        className={styles.cover}
        onClick={() => navigate("/playlist")}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/100x100/CCCCCC/000000?text=No+Cover";
        }}
      />
      <div className={styles.info}>
        <div className={styles.title}>{currentSong!.title}</div>
        <div className={styles.artist}>{currentSong!.artist}</div>
      </div>
      <div className={styles.controls}>
        <button
          onClick={handlePrevClick}
          aria-label="Música anterior"
          className={styles.button}
        >
          <span className="material-icons">skip_previous</span>
        </button>
        <button
          onClick={handlePlayPauseClick}
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          className={styles.playPauseButton}
        >
          <span className="material-icons">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          onClick={handleNextClick}
          aria-label="Próxima música"
          className={styles.button}
        >
          <span className="material-icons">skip_next</span>
        </button>
      </div>

      <div
        className={styles.progressBarOuter}
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className={styles.progressBarFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MiniPlayer;