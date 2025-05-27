// src/pages/Playlist.tsx
import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/playlist.module.css'; // Importa o CSS Module
import Clouds from '../components/Clouds';
import Footer from '../components/Footer';
import BotaoVoltar from '../components/BotaoVoltar';
import '../styles/contentWrapper.css'

const Playlist: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSourceRef = useRef<HTMLSourceElement>(null);
  const headshellInputRef = useRef<HTMLInputElement>(null); // Referência para o checkbox
  const vinylRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLSelectElement>(null);

  const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar se a música está tocando

  // Efeito para carregar e iniciar a música inicial (opcional)
  useEffect(() => {
    if (audioRef.current && headshellInputRef.current && playlistRef.current) {
      // Configura a música inicial
      audioSourceRef.current!.src = playlistRef.current.value;
      audioRef.current.load();

      // Event listener para o checkbox (headshell)
      headshellInputRef.current.addEventListener('change', () => {
        if (audioRef.current) {
          if (headshellInputRef.current?.checked) {
            audioRef.current.play();
            setIsPlaying(true);
          } else {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        }
      });

      // Event listener para o controle de volume
      const volumeControl = document.getElementById("volume-control") as HTMLInputElement;
      if (volumeControl) {
        volumeControl.addEventListener('input', (e: Event) => {
          if (audioRef.current) {
            audioRef.current.volume = parseFloat((e.target as HTMLInputElement).value);
          }
        });
      }
    }
  }, []); // Executa apenas uma vez no carregamento do componente

  // Função para mudar a faixa
  const handleChangeTrack = () => {
    if (audioRef.current && audioSourceRef.current && playlistRef.current && vinylRef.current && headshellInputRef.current) {
      const selectedTrack = playlistRef.current.value;
      audioSourceRef.current.src = selectedTrack;
      audioRef.current.load();

      // Reiniciar animação e reprodução se o braço estiver para baixo
      if (headshellInputRef.current.checked) {
        // Reinicia a animação do vinil
        vinylRef.current.style.animation = 'none';
        // Força o reflow para que a animação seja reiniciada
        void vinylRef.current.offsetHeight;
        vinylRef.current.style.animation = ''; // Reaplicar a animação padrão do CSS (se checked)
        // Se a animação não reiniciar, você pode reaplicar a classe específica:
        // vinylRef.current.classList.add(styles.vinylAnimation);

        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className={styles.body}>
    
      <Clouds />

      <div className="content-wrapper">
        <div className={styles.recordPlayer}>
          {/* Usamos um input hidden e um label para simular o clique no braço */}
          <input type="checkbox" id="headshellInput" className={styles.headshellInput} ref={headshellInputRef} hidden />
          <label htmlFor="headshellInput" className={styles.headshellLabel}></label> {/* Label que o usuário interage */}
          <audio id="player" ref={audioRef}>
            <source id="audio-source" src="" type="audio/mp3" ref={audioSourceRef} />
          </audio>
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
      <select id="playlist" className={styles.playlistSelect} onChange={handleChangeTrack} ref={playlistRef}>
        <option value="musicas/Arrival-of-the-Birds.mp3">
          The Cinematic Orchestra - Arrival of the Birds
        </option>
        <option value="musicas/Forsaken.mp3">Dream Theater - Forsaken</option>
        <option value="musicas/I-Am.mp3">Theocracy - I Am</option>
      </select>

      <BotaoVoltar />

      <Footer />
    </div>
  );
};

export default Playlist;