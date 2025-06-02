// src/components/MiniPlayer.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
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

  const titleRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);
  const artistContainerRef = useRef<HTMLDivElement>(null);

  const [shouldScrollTitle, setShouldScrollTitle] = useState(false);
  const [shouldScrollArtist, setShouldScrollArtist] = useState(false);

  // Verifica se deve aplicar rolagem ao título e artista
  useEffect(() => {
    if (
      titleRef.current &&
      titleContainerRef.current &&
      titleRef.current.scrollWidth > titleContainerRef.current.offsetWidth
    ) {
      setShouldScrollTitle(true);
    } else {
      setShouldScrollTitle(false);
    }

    if (
      artistRef.current &&
      artistContainerRef.current &&
      artistRef.current.scrollWidth > artistContainerRef.current.offsetWidth
    ) {
      setShouldScrollArtist(true);
    } else {
      setShouldScrollArtist(false);
    }
  }, [currentSong]);

  const handlePlayPauseClick = () => {
    togglePlayPause();
  };

  const handleNextClick = () => {
    nextSong();
  };

  const handlePrevClick = () => {
    prevSong();
  };

  const calculateSeekTime = useCallback((clientX: number): number => {
    if (!progressBarRef.current || duration === 0) return 0;
    const progressBarRect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - progressBarRect.left;
    const percentage = Math.max(0, Math.min(1, clickX / progressBarRect.width));
    return percentage * duration;
  }, [duration]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!currentSong || duration === 0) return;
    setIsSeeking(true);
    const seekTime = calculateSeekTime(e.clientX);
    seekTo(seekTime);
  }, [currentSong, duration, calculateSeekTime, seekTo]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isSeeking && currentSong && duration > 0) {
      const seekTime = calculateSeekTime(e.clientX);
      seekTo(seekTime);
    }
  }, [isSeeking, currentSong, duration, calculateSeekTime, seekTo]);

  const handleMouseUp = useCallback(() => {
    setIsSeeking(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
          e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/000000?text=No+Cover";
        }}
      />

      <div className={styles.info}>
        <div className={styles.scrollContainer} ref={titleContainerRef}>
          <div
            className={`${styles.scrollText} ${shouldScrollTitle ? styles.animate : ""}`}
            ref={titleRef}
          >
            <div className={styles.title}>{currentSong!.title}</div>
          </div>
        </div>
        <div className={styles.scrollContainer} ref={artistContainerRef}>
          <div
            className={`${styles.scrollText} ${shouldScrollArtist ? styles.animate : ""}`}
            ref={artistRef}
          >
            <div className={styles.artist}>{currentSong!.artist}</div>
          </div>
        </div>
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
