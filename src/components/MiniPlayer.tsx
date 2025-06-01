// src/components/MiniPlayer.tsx
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
  } = useMusic();

  const navigate = useNavigate();

  if (!currentSong && playlist.length === 0) {
    return null;
  }

  const songToDisplay = currentSong || playlist[0];
  const songTitle = songToDisplay.title;
  const songArtist = songToDisplay.artist;
  const songCover = songToDisplay.cover;

  const handlePlayPauseClick = () => {
    togglePlayPause();
  };

  const handleNextClick = () => {
    nextSong();
  };

  const handlePrevClick = () => {
    prevSong();
  };

  return (
    <div className={styles.miniPlayer}>
      <img
        src={songCover}
        alt={songTitle}
        className={styles.cover}
        onClick={() => navigate("/playlist")}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/100x100/CCCCCC/000000?text=No+Cover";
        }}
      />
      <div className={styles.info}>
        <div className={styles.title}>{songTitle}</div>
        <div className={styles.artist}>{songArtist}</div>
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
    </div>
  );
};

export default MiniPlayer;
