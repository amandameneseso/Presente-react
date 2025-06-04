// src/pages/Playlist.tsx
import styles from '../styles/playlist.module.css'; // Importa o CSS Module
import Clouds from '../components/Clouds';
import Footer from '../components/Footer';
import BotaoVoltar from '../components/BotaoVoltar';
import contentStyles from "../styles/contentWrapper.module.css";
import { Link } from 'react-router-dom';

import React, { useRef, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicPlayerContext'; // Importa o hook do contexto
import { useAuth } from '../context/AuthContext'; // Importa o contexto de autenticação
import { getUserSongs } from '../firebase/userService'; // Importa serviço para obter músicas do usuário

// Simula o contentWrapper
// const contentStyles = {
//   contentWrapper: "flex flex-col items-center justify-center flex-1 w-full",
// };

const Playlist: React.FC = () => {
  const { currentUser } = useAuth();
  // Hooks do music player
  const { playlist, setPlaylist, currentSong, playSong, isPlaying, togglePlayPause, setVolume } = useMusic();
  // Estado local
  const [loading, setLoading] = useState(false);
  const [hasUserSongs, setHasUserSongs] = useState(false);

  const headshellInputRef = useRef<HTMLInputElement>(null); // Referência para o checkbox
  const vinylRef = useRef<HTMLDivElement>(null);
  const playlistSelectRef = useRef<HTMLSelectElement>(null); // Renomeado para evitar conflito
  
  // Carregar músicas do usuário
  useEffect(() => {
    // Se tem usuário logado, carrega músicas do banco de dados
    if (currentUser) {
      setLoading(true);
      getUserSongs(currentUser.uid)
        .then(userSongs => {
          setLoading(false);
          if (userSongs.length > 0) {
            // Converte as músicas do usuário para o formato esperado pelo player
            const formattedSongs = userSongs.map(song => ({
              id: song.id || Math.random().toString(36).substr(2, 9),
              title: song.title || 'Música sem título',
              artist: song.artist || 'Artista desconhecido',
              src: song.url, // mapeando url para src como esperado pela interface Song
              cover: song.coverUrl || 'imagens/default-cover.jpg' // usa a capa da música ou a capa padrão
            }));
            
            setPlaylist(formattedSongs);
            setHasUserSongs(true);
            
            // Se tem músicas mas nenhuma está tocando, inicia a primeira
            if (formattedSongs.length > 0 && !currentSong) {
              playSong(formattedSongs[0]);
            }
          } else {
            // Se o usuário não tem músicas, não altera a playlist padrão
            setHasUserSongs(false);
          }
        })
        .catch(error => {
          console.error('Erro ao carregar músicas:', error);
          setLoading(false);
          setHasUserSongs(false);
        });
    } else {
      // Se não tem usuário logado, usamos a playlist padrão já carregada pelo context
      // Sem mostrar mensagem de loading ou indicador de usuário sem músicas
      setHasUserSongs(true); // Fingimos que tem músicas para não mostrar mensagem de vazio
      setLoading(false);
    }
  }, [currentUser, setPlaylist, playSong, currentSong]);

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
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando suas músicas...</p>
          </div>
        ) : (
          <>
            <div className={styles.profileLink}>
              <Link to="/profile" className={styles.profileButton}>
                Gerenciar Minhas Músicas
              </Link>
            </div>

            {!hasUserSongs && currentUser && (
              <div className={styles.noSongsMessage}>
                <p>Você ainda não tem músicas. Adicione suas músicas na página de perfil!</p>
                <Link to="/profile" className={styles.addSongsButton}>
                  Adicionar Músicas
                </Link>
              </div>
            )}

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
          </>
        )}
      </div>

      {/* Lista de reprodução */}
      {playlist.length > 0 && (
        <select id="playlist" className={styles.playlistSelect} onChange={handleChangeTrack} ref={playlistSelectRef}>
          {playlist.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title} - {song.artist}
            </option>
          ))}
        </select>
      )}

      <BotaoVoltar />

      <Footer />
    </div>
  );
};

export default Playlist;