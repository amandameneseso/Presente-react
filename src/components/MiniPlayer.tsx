import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useMusic } from '../context/MusicPlayerContext'; // Importa o hook do contexto
import styles from '../styles/miniplayer.module.css';

const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlayPause, nextSong, prevSong, nextSong: playNextSongFromContext } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate(); // Hook para navegação

  // Efeito para controlar a reprodução do áudio
  useEffect(() => {
    if (audioRef.current) {
      if (currentSong) {
        // Se a fonte da música mudou, atualiza e recarrega
        if (audioRef.current.src !== currentSong.src) {
          audioRef.current.src = currentSong.src;
          audioRef.current.load(); // Recarrega a música para aplicar a nova src
        }

        // Toca ou pausa a música com base no estado 'isPlaying'
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Erro ao tocar a música no MiniPlayer:", e));
        } else {
          audioRef.current.pause();
        }
      } else {
        // Se não há música atual, pausa e limpa a fonte
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
  }, [currentSong, isPlaying]); // Depende de currentSong e isPlaying

  // Adiciona listener para tocar a próxima música quando a atual termina
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        playNextSongFromContext(); // Chama a função do contexto para ir para a próxima música
      };
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playNextSongFromContext]); // Depende da função nextSong do contexto

  // Se não houver música tocando, o mini player não é exibido ou mostra uma mensagem simples
  if (!currentSong) {
    return (
      <div className={styles.miniPlayer}>
        <p className="text-sm">Nenhuma música tocando</p>
      </div>
    );
  }

  return (
    <div className={styles.miniPlayer}>
      {/* Imagem da capa clicável para navegar para a playlist */}
      <img
        src={currentSong.cover}
        alt={currentSong.title}
        className={styles.cover}
        onClick={() => navigate("/playlist")}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/FFD700/000000?text=Cover'; }} // Fallback
      />
      {/* Informações da música */}
      <div className={styles.info}>
        <div className={styles.title}>{currentSong.title}</div>
        <div className={styles.artist}>{currentSong.artist}</div>
      </div>
      {/* Controles do player */}
      <div className={styles.controls}>
        <button onClick={prevSong} aria-label="Música anterior" className={styles.button}>
          <span className="material-icons">skip_previous</span>
        </button>
        <button onClick={togglePlayPause} aria-label={isPlaying ? "Pausar" : "Reproduzir"} className={styles.playPauseButton}>
          <span className="material-icons">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button onClick={nextSong} aria-label="Próxima música" className={styles.button}>
          <span className="material-icons">skip_next</span>
        </button>
      </div>
      {/* Elemento de áudio HTML5 - mantém a fonte da música */}
      <audio ref={audioRef} src={currentSong.src} preload="auto"></audio>
    </div>
  );
};

export default MiniPlayer;