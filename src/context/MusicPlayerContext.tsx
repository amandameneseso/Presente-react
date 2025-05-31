// src/context/MusicPlayerContext.tsx
import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

// Define a interface para uma música
interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string; // URL da capa do álbum
}

// Define a interface para o estado do contexto da música
interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setPlaylist: (newPlaylist: Song[]) => void;
    setVolume: (volume: number) => void; // Adicionado para controle de volume global

}

// Cria o contexto da música
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Lista de músicas de exemplo
const samplePlaylist: Song[] = [
  {
    id: '1',
    title: 'Forsaken',
    artist: 'Dream Theater',
    src: 'musicas/Forsaken.mp3',
    cover: 'https://placehold.co/100x100/FFD700/000000?text=Song1',
  },
  {
    id: '2',
    title: 'Arrival of the Birds',
    artist: 'The Cinematic Orchestra',
    src: 'musicas/Arrival-of-the-Birds.mp3',
    cover: 'https://placehold.co/100x100/ADD8E6/000000?text=Song2',
  },
  {
    id: '3',
    title: 'I Am',
    artist: 'Theocracy',
    src: 'musicas/I-Am.mp3',
    cover: 'https://placehold.co/100x100/90EE90/000000?text=Song3',
  },
];

// Provedor do contexto da música
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>(samplePlaylist);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializa o elemento de áudio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7; // Volume padrão
      // Adiciona um listener para tocar a próxima música quando a atual termina
      audioRef.current.addEventListener('ended', nextSong);
    }
    // Cleanup: remove o listener quando o componente é desmontado
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', nextSong);
      }
    };
  }, []); // O array de dependências vazio garante que este efeito roda apenas uma vez na montagem

  // Efeito para controlar a reprodução quando a música atual ou o estado de reprodução muda
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
          audioRef.current.play().catch(e => console.error("Erro ao tocar a música:", e));
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

  // Função para tocar uma música específica
  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  // Função para pausar a música
  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Função para alternar entre tocar e pausar
  const togglePlayPause = useCallback(() => {
    if (currentSong) { // Só alterna se houver uma música selecionada
      setIsPlaying(prev => !prev);
    }
  }, [currentSong]);

  // Função para tocar a próxima música na playlist
  const nextSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia
    const currentIndex = currentSong ? playlist.findIndex(s => s.id === currentSong.id) : -1;
    const nextIndex = (currentIndex + 1) % playlist.length; // Loop de volta ao início
    playSong(playlist[nextIndex]);
  }, [currentSong, playlist, playSong]);

  // Função para tocar a música anterior na playlist
  const prevSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia
    const currentIndex = currentSong ? playlist.findIndex(s => s.id === currentSong.id) : -1;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length; // Loop para o final se for a primeira
    playSong(playlist[prevIndex]);
  }, [currentSong, playlist, playSong]);

  // Função para definir o volume do player global
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  // O valor que será fornecido pelo contexto
  const contextValue = {
    currentSong,
    isPlaying,
    playlist,
    playSong,
    pauseSong,
    togglePlayPause,
    nextSong,
    prevSong,
    setPlaylist, // Permite que outros componentes modifiquem a playlist
        setVolume, // Adiciona a função setVolume ao contexto
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook personalizado para usar o contexto da música
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};