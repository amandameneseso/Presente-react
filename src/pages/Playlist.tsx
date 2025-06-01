// src/pages/Playlist.tsx
import styles from '../styles/playlist.module.css'; // Importa o CSS Module
import Clouds from '../components/Clouds';
import Footer from '../components/Footer';
import BotaoVoltar from '../components/BotaoVoltar';
import contentStyles from "../styles/contentWrapper.module.css";


import React, { useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicPlayerContext'; // Importa o hook do contexto

// Simula o contentWrapper
// const contentStyles = {
//   contentWrapper: "flex flex-col items-center justify-center flex-1 w-full",
// };

const Playlist: React.FC = () => {
  // Removidos audioRef e audioSourceRef, pois o áudio é global no MusicProvider
  const { playlist, currentSong, playSong, isPlaying, togglePlayPause, setVolume } = useMusic();
  // const navigate = useNavigate();

  const headshellInputRef = useRef<HTMLInputElement>(null); // Referência para o checkbox
  const vinylRef = useRef<HTMLDivElement>(null);
  const playlistSelectRef = useRef<HTMLSelectElement>(null); // Renomeado para evitar conflito

  // Efeito para sincronizar o estado do checkbox com o isPlaying do contexto
  useEffect(() => {
    if (headshellInputRef.current) {
      headshellInputRef.current.checked = isPlaying;
    }
  }, [isPlaying]);

  // Efeito para configurar listeners e volume inicial
  useEffect(() => {
    if (headshellInputRef.current) {
      const headshellInput = headshellInputRef.current;

      const handleHeadshellChange = () => {
        // Usa togglePlayPause do contexto para controlar o player global
        togglePlayPause();
      };

      headshellInput.addEventListener('change', handleHeadshellChange);

      // Configura o volume inicial do player global
      // O volume inicial do MusicProvider é 0.7, então sincronizamos o controle visual.
      const volumeControl = document.getElementById("volume-control") as HTMLInputElement;
      if (volumeControl) {
        volumeControl.value = "0.7"; // Define o valor inicial do input range
        const handleVolumeChange = (e: Event) => {
          setVolume(parseFloat((e.target as HTMLInputElement).value));
        };
        volumeControl.addEventListener('input', handleVolumeChange);
        return () => {
          headshellInput.removeEventListener('change', handleHeadshellChange);
          volumeControl.removeEventListener('input', handleVolumeChange);
        };
      }
    }
  }, [togglePlayPause, setVolume]); // Depende das funções do contexto

  // Função para mudar a faixa
  const handleChangeTrack = () => {
    if (playlistSelectRef.current) {
      const selectedSongId = playlistSelectRef.current.value;
      const selectedSong = playlist.find(song => song.id === selectedSongId);
      if (selectedSong) {
        playSong(selectedSong); // Toca a música selecionada usando a função do contexto
      }
    }
  };

  // Efeito para definir a música inicial na seleção da playlist
  useEffect(() => {
    if (playlistSelectRef.current && currentSong) {
      playlistSelectRef.current.value = currentSong.id;
    }
  }, [currentSong]); // Atualiza a seleção quando a música atual muda

  return (
    <div className={styles.body}>

      <Clouds />

      <div className={contentStyles.contentWrapper}>
        <div className={styles.recordPlayer}>
          {/* Usamos um input hidden e um label para simular o clique no braço */}
          <input type="checkbox" id="headshellInput" className={styles.headshellInput} ref={headshellInputRef} hidden />
          <label htmlFor="headshellInput" className={styles.headshellLabel}></label> {/* Label que o usuário interage */}
          {/* O elemento audio não está mais aqui, ele está no MusicProvider */}
          <input
            type="range"
            max="1"
            min="0"
            step="0.1"
            id="volume-control"
            className={styles.volumeControl}
          />
          <div className={styles.plinth}></div>
          <div className={styles.platter}></div>
          {/* Aplica a classe vinylAnimation condicionalmente para controlar a animação */}
          <div className={`${styles.vinyl} ${isPlaying ? styles.vinylAnimation : ''}`} ref={vinylRef}></div>
          <div className={styles.topCircle}></div>
        </div>
      </div>

      {/* Lista de reprodução */}
      <select id="playlist" className={styles.playlistSelect} onChange={handleChangeTrack} ref={playlistSelectRef}>
        {playlist.map((song) => (
          <option key={song.id} value={song.id}>
            {song.title} - {song.artist}
          </option>
        ))}
      </select>

      <BotaoVoltar />

      <Footer />
    </div>
  );
};

export default Playlist;