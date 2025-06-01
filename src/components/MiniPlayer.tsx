import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useMusic } from '../context/MusicPlayerContext'; // Importa o hook do contexto
import styles from '../styles/miniplayer.module.css';

const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlayPause, nextSong, prevSong, playlist, playSong } = useMusic();
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate(); // Hook para navegação

  // Efeito para inicializar a primeira música se nenhuma estiver selecionada
  // useEffect(() => {
  //   if (playlist.length > 0 && !currentSong) {
  //     playSong(playlist[0]);
  //   }
  // }, [playlist, currentSong, playSong]);

  // Efeito para controlar a reprodução do áudio
  // useEffect(() => {
  //   if (audioRef.current) {
  //     if (currentSong) {
  //       // Se a fonte da música mudou, atualiza e recarrega
  //       if (audioRef.current.src !== currentSong.src) {
  //         audioRef.current.src = currentSong.src;
  //         audioRef.current.load(); // Recarrega a música para aplicar a nova src
  //       }

  //       // Toca ou pausa a música com base no estado 'isPlaying'
  //       if (isPlaying) {
  //         audioRef.current.play().catch(e => console.error("Erro ao tocar a música no MiniPlayer:", e));
  //       } else {
  //         audioRef.current.pause();
  //       }
  //     } else {
  //       // Se não há música atual, pausa e limpa a fonte
  //       audioRef.current.pause();
  //       audioRef.current.src = '';
  //     }
  //   }
  // }, [currentSong, isPlaying]); // Depende de currentSong e isPlaying

  // Adiciona listener para tocar a próxima música quando a atual termina
  // useEffect(() => {
  //   const audio = audioRef.current;
  //   if (audio) {
  //     const handleEnded = () => {
  //       playNextSongFromContext(); // Chama a função do contexto para ir para a próxima música
  //     };
  //     audio.addEventListener('ended', handleEnded);
  //     return () => {
  //       audio.removeEventListener('ended', handleEnded);
  //     };
  //   }
  // }, [playNextSongFromContext]); // Depende da função nextSong do contexto

  // Definir valores padrão quando não houver música tocando
  const songTitle = currentSong ? currentSong.title : 'Arrival of the Birds';
  const songArtist = currentSong ? currentSong.artist : 'The Cinematic Orchestra';
  const songCover = currentSong ? currentSong.cover : 'https://placehold.co/100x100/ADD8E6/000000?text=Song2';
  // const songSrc = currentSong?.src || '';

  // Funções para garantir que os botões funcionem mesmo sem música selecionada
  const handlePlayPause = () => {
    if (!currentSong && playlist.length > 0) {
      playSong(playlist[0]);
    } else {
      togglePlayPause();
    }
  };

  const handleNext = () => {
    if (!currentSong && playlist.length > 0) {
      playSong(playlist[0]);
    } else {
      nextSong();
    }
  };

  const handlePrev = () => {
    if (!currentSong && playlist.length > 0) {
      playSong(playlist[playlist.length - 1]);
    } else {
      prevSong();
    }
  };

  return (
    <div className={styles.miniPlayer}>
      {/* Imagem da capa clicável para navegar para a playlist */}
      <img
        src={songCover}
        alt={songTitle}
        className={styles.cover}
        onClick={() => {
          // Garantir que navegamos para a página de playlist
          navigate('/playlist');
        }}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/ADD8E6/000000?text=Song2'; }} // Fallback
      />
      {/* Informações da música */}
      <div className={styles.info}>
        <div className={styles.title}>{songTitle}</div>
        <div className={styles.artist}>{songArtist}</div>
      </div>
      {/* Controles do player */}
      <div className={styles.controls}>
        <button onClick={handlePrev} aria-label="Música anterior" className={styles.button}>
          <span className="material-icons">skip_previous</span>
        </button>
        <button onClick={handlePlayPause} aria-label={isPlaying ? "Pausar" : "Reproduzir"} className={styles.playPauseButton}>
          <span className="material-icons">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button onClick={handleNext} aria-label="Próxima música" className={styles.button}>
          <span className="material-icons">skip_next</span>
        </button>
      </div>
      {/* Elemento de áudio HTML5 - mantém a fonte da música */}
      {/* <audio ref={audioRef} src={songSrc} preload="auto"></audio> */}
    </div>
  );
};

export default MiniPlayer;