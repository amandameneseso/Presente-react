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
  setVolume: (volume: number) => void; // Adicionado para controle de volume global
}

// Cria o contexto da música
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Lista de músicas de exemplo
// ATENÇÃO: A ordem da samplePlaylist determina qual será a primeira música padrão.
// Se você quer que "Arrival of the Birds" seja a primeira ao carregar, ela deve ser o primeiro item aqui.
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
  const audioRef = useRef<HTMLAudioElement | null>(null); // Referência ao elemento <audio>

  // --- Funções de controle do Player ---

  // Função para tocar uma música específica.
  // Pode ser chamada por um componente para iniciar a reprodução de uma música da playlist.
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

  // Função para avançar para a próxima música na playlist.
  // Agora, esta função APENAS ATUALIZA currentSong e não altera isPlaying.
  // O useEffect principal cuidará de tocar/pausar a nova música.
  const nextSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia

    const currentIndex = currentSong
      ? playlist.findIndex((s) => s.id === currentSong.id)
      : -1; // Encontra o índice da música atual, ou -1 se não houver
    
    // Calcula o próximo índice, fazendo um loop para o início da playlist
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    setCurrentSong(playlist[nextIndex]); // Define a próxima música como a atual
    // Não chamamos playSong aqui para manter o estado isPlaying (pausado ou tocando)
  }, [currentSong, playlist]); // Depende de currentSong e playlist. playSong não é mais dependência.

  // Função para voltar para a música anterior na playlist.
  // Assim como nextSong, esta função APENAS ATUALIZA currentSong.
  const prevSong = useCallback(() => {
    if (playlist.length === 0) return; // Não faz nada se a playlist estiver vazia

    const currentIndex = currentSong
      ? playlist.findIndex((s) => s.id === currentSong.id)
      : -1; // Encontra o índice da música atual
    
    // Calcula o índice anterior, fazendo um loop para o final da playlist se for a primeira
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    
    setCurrentSong(playlist[prevIndex]); // Define a música anterior como a atual
    // Não chamamos playSong aqui para manter o estado isPlaying (pausado ou tocando)
  }, [currentSong, playlist]); // Depende de currentSong e playlist. playSong não é mais dependência.

  // Função para definir o volume do player global.
  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Aplica o volume ao elemento de áudio
    }
  }, []); // Dependências vazias.

  // --- Efeitos Colaterais (useEffect) ---

  // Efeito 1: Inicializa o elemento de áudio HTML5 e adiciona o listener 'ended'.
  // Executa uma vez na montagem do componente.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(); // Cria a instância do Audio
      audioRef.current.volume = 0.7;    // Define o volume padrão
    }
    // Adiciona o listener para chamar 'nextSong' quando a música atual terminar.
    // 'nextSong' é uma dependência para garantir que a versão mais recente seja usada.
    audioRef.current.addEventListener("ended", nextSong);

    // Função de limpeza: remove o listener quando o componente é desmontado
    // para evitar vazamentos de memória.
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", nextSong);
      }
    };
  }, [nextSong]); // Dependência: `nextSong` (para reagir à sua recriação).

  // Efeito 2: Controla a reprodução (play/pause) e a troca da fonte da música.
  // Este é o efeito que garante o comportamento desejado de "manter pausa".
  // É acionado sempre que 'currentSong' ou 'isPlaying' mudam.
  useEffect(() => {
    if (audioRef.current) { // Garante que a ref do áudio existe
      if (currentSong) { // Se há uma música selecionada para tocar
        // Verifica se a SRC do áudio atual é diferente da SRC da nova música.
        // Se for, significa que uma nova música foi selecionada.
        if (audioRef.current.src !== currentSong.src) {
          audioRef.current.src = currentSong.src; // Atualiza a SRC do áudio
          audioRef.current.load(); // Recarrega o áudio para aplicar a nova SRC
          // Não alteramos `isPlaying` aqui. O estado `isPlaying` DITA a reprodução.
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
    setPlaylist, // Permite que outros componentes modifiquem a playlist
    setVolume,   // Permite controlar o volume
  };

  return (
    // O Provedor do Contexto que envolve os componentes filhos,
    // tornando o 'contextValue' disponível para eles.
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