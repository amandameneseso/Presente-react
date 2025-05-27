import { useState, useEffect } from 'react';
import '../styles/jogodamemoria.css';
import Clouds from '../components/Clouds';
import BotaoVoltar from '../components/BotaoVoltar';
import Footer from '../components/Footer';
import '../styles/contentWrapper.css';

const cartaImages = [
  '/imagens/memoria/coracao.avif', // Exemplo: Coração
  '/imagens/memoria/estrela.avif',   // Exemplo: Estrela
  '/imagens/memoria/flor.webp', // Exemplo: Flor
  '/imagens/memoria/sol.jpg',    // Exemplo: Sol
  '/imagens/memoria/lua.jpg',   // Exemplo: Lua
  '/imagens/memoria/nuvem.avif',  // Exemplo: Nuvem
  '/imagens/memoria/arco-iris.webp',// Exemplo: Arco-íris
  '/imagens/memoria/gatinho.webp',  // Exemplo: Gatinho
];

const cartaBack = 'imagens/memoria/cachorro-pensando.jpg'; // Verso da carta

// Função para embaralhar as cartas
const shufflecartas = (images: string[]) => {
  const duplicatedImages = [...images, ...images]; // Duplica para criar pares
  return duplicatedImages.sort(() => Math.random() - 0.5); // Embaralha
};

export function JogodaMemoria() {
  const [cartas, setcartas] = useState<string[]>([]);
  const [flippedcartas, setFlippedcartas] = useState<number[]>([]); // Índices das cartas viradas
  const [matchedcartas, setMatchedcartas] = useState<number[]>([]); // Índices dos pares encontrados
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [awaitingSecondFlip, setAwaitingSecondFlip] = useState(false); // Para evitar virar 3 cartas

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matchedcartas.length === cartaImages.length * 2) {
      setGameOver(true);
    }
  }, [matchedcartas]);

  const initializeGame = () => {
    setcartas(shufflecartas(cartaImages));
    setFlippedcartas([]);
    setMatchedcartas([]);
    setMoves(0);
    setGameOver(false);
    setAwaitingSecondFlip(false);
  };

  const handlecartaClick = (index: number) => {
    // Se o jogo acabou, se a carta já foi virada, se já é um par ou se está esperando o segundo flip
    if (gameOver || flippedcartas.includes(index) || matchedcartas.includes(index) || awaitingSecondFlip) {
      return;
    }

    setFlippedcartas(prev => [...prev, index]);
    setMoves(prev => prev + 1);
  };

  useEffect(() => {
    if (flippedcartas.length === 2) {
      setAwaitingSecondFlip(true); // Bloqueia novos clicks

      const [firstIndex, secondIndex] = flippedcartas;
      const firstcarta = cartas[firstIndex];
      const secondcarta = cartas[secondIndex];

      if (firstcarta === secondcarta) {
        setMatchedcartas(prev => [...prev, firstIndex, secondIndex]);
        setFlippedcartas([]); // Reseta as cartas viradas
        setAwaitingSecondFlip(false); // Libera clicks
      } else {
        setTimeout(() => {
          setFlippedcartas([]); // Vira as cartas de volta
          setAwaitingSecondFlip(false); // Libera clicks
        }, 1000); // Vira de volta após 1 segundo
      }
    }
  }, [flippedcartas, cartas]);

  return (
    <>

    <Clouds />

    <div className="game-page-container"> {/* Usar um container global para a página */}
      <div className="game-container"> {/* Contêiner principal do jogo */}
        <h1 className="game-title">Jogo da Memória</h1>

        <div className="game-stats">
          <p>Movimentos: {Math.floor(moves / 2)}</p> {/* Cada 2 viradas = 1 movimento */}
          <p>Pares: {matchedcartas.length / 2} / {cartaImages.length}</p>
        </div>

        <div className="carta-grid">
          {cartas.map((cartaImage, index) => (
            <div
              key={index}
              className={`carta ${flippedcartas.includes(index) || matchedcartas.includes(index) ? 'flipped' : ''}`}
              onClick={() => handlecartaClick(index)}
            >
              <img src={cartaImage} alt="carta frente" className="carta-frente" />
              <img src={cartaBack} alt="carta back" className="carta-back" />
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="game-over-modal">
            <h2>Parabéns!</h2>
            <p>Você encontrou todos os pares em {Math.floor(moves / 2)} movimentos!</p>
            <img src="/imagens/memoria/giphy.gif" alt="Celebração" className="celebration-gif" /> {/* Adicione um GIF fofo */}
            <button onClick={initializeGame} className="restart-button">Jogar Novamente</button>
          </div>
        )}

        <button onClick={initializeGame} className="restart-button bottom-restart">Reiniciar Jogo</button>
      </div>
    </div>

    <BotaoVoltar />

    <Footer />

    </>
  );
}

export default JogodaMemoria;