import React, { useState, useEffect, useCallback } from "react";
// import { Link } from "react-router-dom";
// import "../styles/style.css";
import stylesQuiz from "../styles/quiz.module.css"; // Your CSS Modules for Quiz
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from '../components/Footer';

// Import the confetti script dynamically
const loadConfetti = () => {
  // Check if window is defined (for SSR compatibility) and if confetti is not already loaded
  if (typeof window !== 'undefined' && !window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.js';
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (typeof window.confetti === 'function') {
        console.log('Confetti script loaded successfully.');
      }
    };
    return () => {
      // Clean up the script if the component unmounts before it loads
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }
};

// Define types for answers and questions
interface Answer {
  text: string;
  correct: boolean;
}

interface Question {
  question: string;
  answers: Answer[];
  correctFeedback: string;
  wrongFeedback: string;
}

// Quiz questions data
const quizQuestions: Question[] = [
  {
    question: "Onde foi nosso primeiro encontro?",
    answers: [
      { text: "No mercadinho", correct: false },
      { text: "Na lanchonete da esquina", correct: false },
      {
        text: "No cinema vendo aquele filme que ninguém entendeu nada",
        correct: true,
      },
      { text: "Num piquenique romântico no parque", correct: false },
    ],
    correctFeedback:
      "Acertou! Quem diria que um combo de pipoca e nervosismo renderia esse romance?",
    wrongFeedback: "Errrooou :( Mas valeu a tentativa, tenta de novo na próxima!",
  },
  {
    question: "Qual é a minha comida favorita?",
    answers: [
      { text: "Sushi", correct: false },
      { text: "Pizza", correct: false },
      { text: "Macarronada de sardinha da sua mãe", correct: true },
      { text: "Batata frita", correct: false },
    ],
    correctFeedback:
      "Quem precisa de um jantar chique quando existe macarrão com sardinha?!",
    wrongFeedback: "Errado! Mas relaxa, a macarronada te perdoa...",
  },
  {
    question: "Qual é o meu filme favorito?",
    answers: [
      { text: "Forrest Gump", correct: false },
      { text: "Shrek", correct: false },
      { text: "Titanic", correct: false },
      { text: "Irmão Urso", correct: true },
    ],
    correctFeedback: "Acertou! E sorte sua que eu não esqueço tudo todo dia.",
    wrongFeedback: "Errado! Mas valeu a tentativa, tenta de novo na próxima!",
  },
  {
    question: "Quando começamos a namorar?",
    answers: [
      { text: "25/11/2023", correct: false },
      { text: "14/06/2022", correct: false },
      { text: "04/07/2024", correct: true },
      { text: "18/09/2024", correct: false },
    ],
    correctFeedback: "Acertou! Esse dia foi incrivelmente especial...",
    wrongFeedback: "Errado. Alguém vai dormir no sofá hoje!",
  },
  {
    question: "Quem é o mais bagunceiro?",
    answers: [
      {
        text: "Eu (o(a) amorzinho(a) que fez esse site)",
        correct: false,
      },
      { text: "Você", correct: true },
      { text: "O gato", correct: false },
      { text: "O universo conspira contra nós", correct: false },
    ],
    correctFeedback: "Boa :) Isso já é meio caminho pra arrumar a bagunça.",
    wrongFeedback: "Negar não ajuda... a toalha no sofá te entregou.",
  },
  {
    question: "Quem faz mais drama?",
    answers: [
      { text: "Eu (o(a) amorzinho(a) que fez esse site)", correct: true },
      { text: "Você", correct: false },
      { text: "Os dois", correct: false },
      { text: "O wi-fi quando cai", correct: false },
    ],
    correctFeedback:
      "Acertou! Infelizmente (ou felizmente) o Oscar de melhor drama vai para mim.",
    wrongFeedback:
      "Nããão, que injustiça! O drama é meu superpoder (ou defeito, dependendo do dia).",
  },
  {
    question: "O que você acha que eu mais gosto em você?",
    answers: [
      { text: "Sua personalidade", correct: false },
      { text: "Sua aparência", correct: false },
      { text: "Seu cuidado comigo", correct: false },
      { text: "Todas essas coisas e muito mais...", correct: true },
    ],
    correctFeedback: "Isso mesmo, namolado!",
    wrongFeedback: "Errado! Mas valeu a tentativa, tenta de novo na próxima!",
  },
];

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Load confetti script on component mount
  useEffect(() => {
    loadConfetti();
  }, []);

  // Shuffle questions once when the component mounts
  useEffect(() => {
    setShuffledQuestions(shuffleArray(quizQuestions));
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setFeedback("");
    setAnswered(false);
    setShuffledQuestions(shuffleArray(quizQuestions)); // Reshuffle on restart
  };

  const handleAnswerClick = (isCorrect: boolean) => {
    if (answered) return;

    setAnswered(true);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback(currentQuestion.correctFeedback);
    } else {
      setFeedback(currentQuestion.wrongFeedback);
    }
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setAnswered(false);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < shuffledQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResults(true);
    }
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const handleRetryQuiz = () => {
    handleStartQuiz();
  };

  // Logic to trigger confetti
  const triggerConfetti = useCallback(() => {
    const scorePercentage = Math.round((score / shuffledQuestions.length) * 100);
    if (scorePercentage >= 50) {
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [score, shuffledQuestions.length]);

  useEffect(() => {
    if (showResults) {
      triggerConfetti();
    }
  }, [showResults, triggerConfetti]);

  const getResultImage = () => {
    const scorePercentage = Math.round((score / shuffledQuestions.length) * 100);
    if (scorePercentage >= 70) {
      return "/imagens/rabbit.gif";
    } else if (scorePercentage >= 60) {
      return "/imagens/rabbit2.gif";
    } else if (scorePercentage >= 30) {
      return "/imagens/50e74.gif";
    } else {
      return "/imagens/rabbittriste.gif";
    }
  };

  return (
    <>
      <Clouds />

      <BotaoVoltar />

      <Footer />

      <div className={stylesQuiz.container}>
        {/* Pseudo-elements for .container::before, .container::after, .container .side-left, .container .side-right are handled by the CSS itself */}
        <div className={stylesQuiz['side-left']}></div>
        <div className={stylesQuiz['side-right']}></div>

        {/* <nav>
          <ul>
            <li>
              <a href="#" id="jogo1-link">Quiz</a>
            </li>
          </ul>
        </nav> */}

        <div className={stylesQuiz.divider}>
          <img src="/imagens/divbiscuit2.gif" id="div1" alt="" />
          <img src="/imagens/divbiscuit2.gif" id="div2" alt="" />
          <img src="/imagens/divbiscuit2.gif" id="div3" alt="" />
        </div>

        <main>
          {!quizStarted ? (
            <div className={stylesQuiz['mensagem-inicial']}>
              <button
                id="start-button"
                className={stylesQuiz['start-btn']}
                onClick={handleStartQuiz}
              >
                Iniciar Quiz
              </button>
            </div>
          ) : showResults ? (
            <div className={stylesQuiz['results-container']}>
              <h2>Resultados do Quiz!</h2>
              <p>Você acertou {score} de {shuffledQuestions.length} perguntas!</p>
              <p>Sua pontuação: {Math.round((score / shuffledQuestions.length) * 100)}%</p>
              <img
                src={getResultImage()}
                alt="Resultado do Quiz"
                className={stylesQuiz['result-image']}
              />
              <button
                id="retry-button"
                className={stylesQuiz['retry-btn']}
                onClick={handleRetryQuiz}
              >
                Refazer quiz
              </button>
            </div>
          ) : (
            <div className={stylesQuiz['quiz-container']}>
              <div id="question-container" className={stylesQuiz.question}>
                {currentQuestion ? `${currentQuestionIndex + 1}. ${currentQuestion.question}` : "Carregando pergunta..."}
              </div>
              <div id="answer-buttons" className={stylesQuiz.answers}>
                {currentQuestion &&
                  currentQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      // Apply .answers button styles, and conditionally .correct or .wrong
                      className={`${stylesQuiz['answers-button']} ${answered ? (answer.correct ? stylesQuiz.correct : stylesQuiz.wrong) : ''}`}
                      onClick={() => handleAnswerClick(answer.correct)}
                      disabled={answered}
                    >
                      {answer.text}
                    </button>
                  ))}
              </div>
              <div id="feedback" className={stylesQuiz.feedback}>
                {feedback}
              </div>
              {answered && (
                currentQuestionIndex < shuffledQuestions.length - 1 ? (
                  <button
                    id="next-button"
                    className={stylesQuiz['next-btn']}
                    onClick={handleNextQuestion}
                  >
                    Próxima
                  </button>
                ) : (
                  <button
                    id="finish-button"
                    className={`${stylesQuiz['next-btn']} ${stylesQuiz['finish-button']}`} // Applying multiple classes
                    onClick={handleFinishQuiz}
                  >
                    Finalizar quiz
                  </button>
                )
              )}
            </div>
          )}
        </main>

        <img src="/imagens/bunny.png" alt="" className={stylesQuiz['imagem-inferior-esquerda']} />
      </div>

    </>
  );
};

export default Quiz;