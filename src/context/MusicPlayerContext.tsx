// src/context/MusicPlayerContext.tsx
import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

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
  setVolume: (volume: number) => void;
  // NOVOS:
  currentTime: number; // Tempo atual da música em segundos
  duration: number;    // Duração total da música em segundos
  seekTo: (time: number) => void; // Função para buscar um tempo específico na música
}

// Cria o contexto da música
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Lista de músicas
// A ordem da samplePlaylist determina qual será a primeira música padrão.
const samplePlaylist: Song[] = [
  {
    id: "1",
    title: "Forsaken",
    artist: "Dream Theater",
    src: "musicas/Forsaken.mp3",
    cover: "https://placehold.co/100x100/FFD700/000000?text=Song1",
  },
  {
    id: "2",
    title: "Arrival of the Birds",
    artist: "The Cinematic Orchestra",
    src: "musicas/Arrival-of-the-Birds.mp3",
    cover: "https://placehold.co/100x100/ADD8E6/000000?text=Song2",
  },
  {
    id: "3",
    title: "I Am",
    artist: "Theocracy",
    src: "musicas/I-Am.mp3",
    cover: "https://placehold.co/100x100/90EE90/000000?text=Song3",
  },
];

// Provedor do contexto da música
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Estados principais do player
  const [playlist, setPlaylist] = useState<Song[]>(samplePlaylist);
  const [currentSong, setCurrentSong] = useState<Song | null>(
    playlist.length > 0 ? playlist[0] : null // Inicializa com a primeira música da playlist
  );
  const [isPlaying, setIsPlaying] = useState(false); // Indica se a música está tocando
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ESTADOS PARA A BARRA DE PROGRESSO
  const [currentTime, setCurrentTime] = useState(0); // Tempo atual da reprodução em segundos
  const [duration, setDuration] = useState(0);    // Duração total da música em segundos

  // --- Funções de controle do Player  ---
  // Função para tocar uma música específica.
  const playSong = useCallback((song: Song) => {
    setCurrentSong(song); // Define a música como a atual
    setIsPlaying(true);    // Inicia a reprodução
  }, []); // Dependências vazias, pois só atualiza estados.

  // Função para pausar a música.
  const pauseSong = useCallback(() => {
    setIsPlaying(false); // Define o estado de reprodução como falso
  }, []); // Dependências vazias.

  // Função para alternar entre tocar e pausar.
  // Garante que a ação só ocorra se houver uma música selecionada.
  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      setIsPlaying((prev) => !prev); // Inverte o estado de isPlaying
    }
  }, [currentSong]); // Depende de currentSong para verificar se há música.

  // Função para avançar para a próxima música na playlist. Apenas atualiza currentSong, não altera isPlaying diretamente.
  const nextSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia

    const currentIndex = currentSong
      ? playlist.findIndex((s) => s.id === currentSong.id)
      : -1; // Encontra o índice da música atual, ou -1 se não houver
    
    // Calcula o próximo índice, fazendo um loop para o início da playlist
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    setCurrentSong(playlist[nextIndex]); // Define a próxima música como a atual
  }, [currentSong, playlist]); // Depende de currentSong e playlist.

  // Função para voltar para a música anterior na playlist.
  const prevSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia

    const currentIndex = currentSong
      ? playlist.findIndex((s) => s.id === currentSong.id)
      : -1; // Encontra o índice da música atual
    
    // Calcula o índice anterior, fazendo um loop para o final da playlist se for a primeira
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    
    setCurrentSong(playlist[prevIndex]); // Define a música anterior como a atual
  }, [currentSong, playlist]); // Depende de currentSong e playlist.

  // Função para definir o volume do player global.
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Aplica o volume ao elemento de áudio
    }
  }, []); // Dependências vazias.

  // Função para buscar um tempo específico na música.
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time; // Define o tempo atual do áudio
    }
  }, []);

  // --- Efeitos Colaterais (useEffect) ---
  // Efeito 1: Inicializa o elemento de áudio HTML5 e adiciona todos os listeners de áudio.
  // Executa uma vez na montagem do componente.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(); // Cria a instância do Audio
      audioRef.current.volume = 0.7;    // Define o volume padrão
    }

    // Handlers para os eventos do elemento de áudio
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime); // Atualiza o tempo atual
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration); // Define a duração total da música
        setCurrentTime(0); // Reseta o tempo atual para 0 ao carregar nova metadata
      }
    };

    const handleEnded = () => {
      nextSong(); // Chama a função para ir para a próxima música
    };

    // Adiciona os listeners ao elemento de áudio
    const audio = audioRef.current; // Cache da referência para uso nos listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Função de limpeza: remove todos os listeners quando o componente é desmontado
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [nextSong]); // Dependência: `nextSong` (para reagir à sua recriação e garantir o listener correto).

  // Efeito 2: Controla a reprodução (play/pause) e a troca da fonte da música.
  // Este efeito é acionado sempre que 'currentSong' ou 'isPlaying' mudam.
  useEffect(() => {
    if (audioRef.current) { // Garante que a ref do áudio existe
      if (currentSong) { // Se há uma música selecionada para tocar
        // Se a fonte do áudio é diferente da música atual, carrega a nova música.
        // Isso garante que a música comece do início APENAS quando for uma nova música.
        if (audioRef.current.src !== currentSong.src) {
          audioRef.current.src = currentSong.src; // Atualiza a SRC do áudio
          audioRef.current.load(); // Recarrega o áudio para aplicar a nova SRC
          setCurrentTime(0); // Garante que a UI mostre 0 ao carregar uma nova música
          setDuration(0);    // Garante que a duração seja 0 até que loadedmetadata dispare
        }

        // Toca ou pausa a música com base no estado atual de 'isPlaying'.
        if (isPlaying) {
          audioRef.current
            .play()
            .catch((e) => console.error("Erro ao tocar a música:", e)); // Tenta tocar, capturando erros de autoplay
        } else {
          audioRef.current.pause(); // Pausa a música
        }
      } else {
        // Se 'currentSong' for null (ex: playlist vazia ou player resetado),
        // pausa e limpa a fonte do áudio para garantir que nada toque.
        audioRef.current.pause();
        audioRef.current.src = "";
        setCurrentTime(0); // Reseta o tempo e duração quando não há música
        setDuration(0);
      }
    }
  }, [currentSong, isPlaying]); // Dependências: reage a mudanças em currentSong e isPlaying.

  // --- Valor do Contexto ---
  // O objeto que será fornecido pelo contexto.
  // Contém todos os estados e funções que os componentes filhos podem consumir.
  const contextValue = {
    currentSong,
    isPlaying,
    playlist,
    playSong,
    pauseSong,
    togglePlayPause,
    nextSong,
    prevSong,
    setPlaylist,
    setVolume,
    currentTime,
    duration,
    seekTo,
  };

  return (
    // O Provedor do Contexto que envolve os componentes filhos, tornando o 'contextValue' disponível para eles.
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// --- Hook Personalizado para Consumir o Contexto ---

// Hook personalizado para facilitar o consumo do contexto da música em qualquer componente.
export const useMusic = () => {
  const context = useContext(MusicContext);
  // Lança um erro útil se o hook for usado fora de um MusicProvider,
  // garantindo que o contexto esteja sempre disponível.
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};