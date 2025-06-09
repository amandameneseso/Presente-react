import React, { useState, useEffect, useCallback } from "react";
import stylesQuiz from "../styles/quiz.module.css";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import contentStyles from "../styles/contentWrapper.module.css";
import { FaPlus, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";

const loadConfetti = () => {
  if (typeof window !== "undefined" && !window.confetti) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (typeof window.confetti === "function") {
        console.log("Confetti script loaded successfully.");
      }
    };
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }
};

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

const quizQuestions: Question[] = [
  {
    question: "Onde foi nosso primeiro encontro?",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: true },
      { text: "", correct: false },
    ],
    correctFeedback: "",
    wrongFeedback: "",
  },
  {
    question: "Qual é a minha comida favorita?",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: true },
      { text: "", correct: false },
    ],
    correctFeedback: "",
    wrongFeedback: "",
  },
  {
    question: "Qual é o meu filme favorito?",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: true },
    ],
    correctFeedback: "",
    wrongFeedback: "",
  },
  {
    question: "Quando começamos a namorar?",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: true },
      { text: "", correct: false },
    ],
    correctFeedback: "",
    wrongFeedback: "",
  },
  {
    question: "Quem é o mais bagunceiro?",
    answers: [
      { text: "",
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
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
    correctFeedback: "",
    wrongFeedback: "",
  },
  {
    question: "O que você acha que eu mais gosto em você?",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: true },
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
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [editedDefaultQuestions, setEditedDefaultQuestions] = useState<Question[]>([]);
  const [editDefaultQuestionIndex, setEditDefaultQuestionIndex] = useState<number | null>(null);

  // Estados para gerenciamento de perguntas personalizadas
  const [useDefaultQuestions, setUseDefaultQuestions] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // Estados para criação de novas perguntas
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Answer[]>([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
  ]);
  const [newCorrectFeedback, setNewCorrectFeedback] = useState("");
  const [newWrongFeedback, setNewWrongFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load confetti script on component mount
  useEffect(() => {
    loadConfetti();
  }, []);

  // Função para preparar as perguntas com base nas escolhas do usuário
  const prepareQuestions = useCallback(
    (useDefault: boolean, custom: Question[]) => {
      let questions: Question[] = [];

      if (useDefault) {
        // Usar versões editadas das perguntas padrão quando disponíveis
        const defaultQuestionsToUse = quizQuestions.map(q => {
          const edited = editedDefaultQuestions.find(
            editedQ => editedQ.question === q.question
          );
          return edited || q;
        });
        
        if (custom.length === 0) {
          questions = [...defaultQuestionsToUse];
        } else {
          questions = [...defaultQuestionsToUse, ...custom];
        }
      } else if (!useDefault && custom.length > 0) {
        questions = [...custom];
      } else {
        // Sem perguntas selecionadas
        return false;
      }

      const shuffled = shuffleArray([...questions]);
      setShuffledQuestions(shuffled);
      return true;
    },
    [editedDefaultQuestions]
  );

  // Efeito para preparar perguntas quando iniciar o quiz
  useEffect(() => {
    if (quizStarted) {
      prepareQuestions(useDefaultQuestions, customQuestions);
    }
  }, [quizStarted, useDefaultQuestions, customQuestions, prepareQuestions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleStartQuiz = () => {
    // Validação
    if (!useDefaultQuestions && customQuestions.length === 0) {
      setErrorMessage(
        "Adicione pelo menos uma pergunta personalizada ou selecione 'Usar perguntas pré-definidas'."
      );
      return;
    }

    // Preparar perguntas antes de iniciar
    const success = prepareQuestions(useDefaultQuestions, customQuestions);
    if (!success) {
      setErrorMessage(
        "Selecione ao menos um tipo de pergunta ou adicione perguntas personalizadas."
      );
      return;
    }

    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setFeedback("");
    setAnswered(false);
    setErrorMessage("");
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
    setQuizStarted(false);
    setShowResults(false);
  };

  // Funções para gerenciar perguntas personalizadas
  const handleAddNewQuestion = () => {
    setShowAddQuestion(true);
  };

  const handleCancelAddQuestion = () => {
    setShowAddQuestion(false);
    setEditDefaultQuestionIndex(null);
    setNewQuestion("");
    setNewAnswers([
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ]);
    setNewCorrectFeedback("");
    setNewWrongFeedback("");
    setErrorMessage("");
  };

  const handleAnswerTextChange = (index: number, text: string) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index].text = text;
    setNewAnswers(updatedAnswers);
  };

  const handleSetCorrectAnswer = (index: number) => {
    const updatedAnswers = newAnswers.map((answer, i) => ({
      ...answer,
      correct: i === index,
    }));
    setNewAnswers(updatedAnswers);
  };

  const handleSaveQuestion = () => {
    // Validação
    if (newQuestion.trim() === "") {
      setErrorMessage("Adicione uma pergunta.");
      return;
    }

    if (newAnswers.some((answer) => answer.text.trim() === "")) {
      setErrorMessage("Todas as respostas devem ser preenchidas.");
      return;
    }

    if (!newAnswers.some((answer) => answer.correct)) {
      setErrorMessage("Selecione uma resposta como correta.");
      return;
    }

    if (newCorrectFeedback.trim() === "" || newWrongFeedback.trim() === "") {
      setErrorMessage(
        "Adicione feedback para respostas corretas e incorretas."
      );
      return;
    }

    // Cria nova pergunta
    const newQuestionObj: Question = {
      question: newQuestion,
      answers: [...newAnswers],
      correctFeedback: newCorrectFeedback,
      wrongFeedback: newWrongFeedback,
    };

    if (editDefaultQuestionIndex !== null) {
      // Estamos editando uma pergunta padrão
      const updatedEditedQuestions = [...editedDefaultQuestions];
      const originalQuestion = quizQuestions[editDefaultQuestionIndex];
      
      // Precisamos manter a pergunta original para identificação
      newQuestionObj.question = originalQuestion.question;
      
      // Verifica se já existe uma versão editada dessa pergunta
      const existingIndex = editedDefaultQuestions.findIndex(
        q => q.question === originalQuestion.question
      );
      
      if (existingIndex >= 0) {
        // Atualiza a versão editada existente
        updatedEditedQuestions[existingIndex] = newQuestionObj;
      } else {
        // Adiciona nova versão editada
        updatedEditedQuestions.push(newQuestionObj);
      }
      
      setEditedDefaultQuestions(updatedEditedQuestions);
    } else {
      // Adiciona à lista de perguntas personalizadas
      setCustomQuestions([...customQuestions, newQuestionObj]);
    }

    // Limpa o formulário
    handleCancelAddQuestion();
  };

  const handleDeleteCustomQuestion = (index: number) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions.splice(index, 1);
    setCustomQuestions(updatedQuestions);
  };

  // Logic to trigger confetti
  const triggerConfetti = useCallback(() => {
    const scorePercentage = Math.round(
      (score / shuffledQuestions.length) * 100
    );
    if (scorePercentage >= 50) {
      if (typeof window.confetti === "function") {
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
    const scorePercentage = Math.round(
      (score / shuffledQuestions.length) * 100
    );
    if (scorePercentage >= 70) {
      return `${import.meta.env.BASE_URL}/imagens/rabbit.gif`;
    } else if (scorePercentage >= 60) {
      return `${import.meta.env.BASE_URL}/imagens/rabbit2.gif`;
    } else if (scorePercentage >= 30) {
      return `${import.meta.env.BASE_URL}/imagens/50e74.gif`;
    } else {
      return `${import.meta.env.BASE_URL}/imagens/rabbittriste.gif`;
    }
  };

  return (
    <>
      <Clouds />

      <Footer />

      <div className={stylesQuiz.hiddenOverflow}>
        <div className={contentStyles.contentWrapper}>
          <div className={stylesQuiz.container}>
            <div className={stylesQuiz.sideLeft}></div>
            <div className={stylesQuiz.sideRight}></div>
            <div className={stylesQuiz.divider}>
              <img
                src={`${import.meta.env.BASE_URL}/imagens/divbiscuit2.gif`}
                className={stylesQuiz.div1}
                alt=""
              />
              <img
                src={`${import.meta.env.BASE_URL}/imagens/divbiscuit2.gif`}
                className={stylesQuiz.div2}
                alt=""
              />
              <img
                src={`${import.meta.env.BASE_URL}/imagens/divbiscuit2.gif`}
                className={stylesQuiz.div3}
                alt=""
              />
            </div>
            <main className={stylesQuiz.mainContent}>
              {!quizStarted && !showResults ? (
                <div className={stylesQuiz.mensagemInicial}>
                  <h2>QUIZ</h2>
                  <div className={stylesQuiz.quizOptions}>
                    <div className={stylesQuiz.optionsHeader}>
                      <div className={stylesQuiz.checkboxContainer}>
                        <input
                          type="checkbox"
                          id="useDefaultQuestions"
                          className={stylesQuiz.checkbox}
                          checked={useDefaultQuestions}
                          onChange={(e) => {
                            setUseDefaultQuestions(e.target.checked);
                            // Se desmarcar, esconder as perguntas pré-definidas
                            if (!e.target.checked) {
                              setShowDefaultQuestions(false);
                            }
                          }}
                        />
                        <label
                          htmlFor="useDefaultQuestions"
                          className={stylesQuiz.checkboxLabel}
                        >
                          Usar perguntas pré-definidas
                        </label>
                      </div>
                      {useDefaultQuestions && (
                        <button 
                          className={stylesQuiz.toggleDefaultQuestionsBtn}
                          onClick={() => setShowDefaultQuestions(!showDefaultQuestions)}
                        >
                          {showDefaultQuestions ? 'Ocultar perguntas' : 'Ver perguntas'}
                        </button>
                      )}
                    </div>
                    {useDefaultQuestions && showDefaultQuestions && (
                    <div className={stylesQuiz.customQuestionsContainer}>
                        <div className={stylesQuiz.customQuestionHeader}>
                        <h3>Perguntas pré-definidas (clique em editar para personalizá-las)</h3>
                      </div>
                      <div className={stylesQuiz.customQuestionsList}>
                        {quizQuestions.map((question, index) => {
                          // Verificar se existe uma versão editada
                          const editedVersion = editedDefaultQuestions.find(
                            q => q.question === question.question
                          );
                          
                          return (
                            <div key={index} className={stylesQuiz.customQuestionItem}>
                              <p>{editedVersion ? 
                                 <><span className={stylesQuiz.editedBadge}>✎</span> {question.question}</> : 
                                 question.question}
                              </p>
                              <button
                                className={stylesQuiz.editQuestionBtn}
                                onClick={() => {
                                  // Carregar dados da pergunta para edição
                                  const questionToEdit = editedVersion || question;
                                  setNewQuestion(questionToEdit.question);
                                  setNewAnswers([...questionToEdit.answers]);
                                  setNewCorrectFeedback(questionToEdit.correctFeedback);
                                  setNewWrongFeedback(questionToEdit.wrongFeedback);
                                  setEditDefaultQuestionIndex(index);
                                  setShowAddQuestion(true);
                                }}
                              >
                                Editar
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className={stylesQuiz.customQuestionsContainer}>
                    <div className={stylesQuiz.customQuestionHeader}>
                      <h3>
                        Perguntas ({customQuestions.length})
                      </h3>
                      <button
                        className={stylesQuiz.addQuestionBtn}
                        onClick={handleAddNewQuestion}
                      >
                        <FaPlus /> Nova
                      </button>
                    </div>

                    {customQuestions.length > 0 && (
                      <div className={stylesQuiz.customQuestionsList}>
                        {customQuestions.map((q, index) => (
                          <div
                            key={index}
                            className={stylesQuiz.customQuestionItem}
                          >
                            <p>{q.question}</p>
                            <button
                              className={stylesQuiz.deleteQuestionBtn}
                              onClick={() => handleDeleteCustomQuestion(index)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddQuestion && (
                      <div className={stylesQuiz.addQuestionForm}>
                        <h3>{editDefaultQuestionIndex !== null ? 'Editar pergunta' : 'Nova pergunta'}</h3>
                        {errorMessage && (
                          <p className={stylesQuiz.errorMsg}>{errorMessage}</p>
                        )}

                        <div className={stylesQuiz.formGroup}>
                          <label>Pergunta:</label>
                          <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Digite a pergunta..."
                          />
                        </div>

                        <div className={stylesQuiz.formGroup}>
                          <label>Respostas:</label>
                          {newAnswers.map((answer, index) => (
                            <div key={index} className={stylesQuiz.answerInput}>
                              <input
                                type="text"
                                value={answer.text}
                                onChange={(e) =>
                                  handleAnswerTextChange(index, e.target.value)
                                }
                                placeholder={`Opção ${index + 1}`}
                              />
                              <button
                                className={`${stylesQuiz.correctBtn} ${
                                  answer.correct ? stylesQuiz.selected : ""
                                }`}
                                onClick={() => handleSetCorrectAnswer(index)}
                              >
                                {answer.correct ? <FaCheck /> : "✓"}
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className={stylesQuiz.formGroup}>
                          <label>Feedback para acerto:</label>
                          <input
                            type="text"
                            value={newCorrectFeedback}
                            onChange={(e) =>
                              setNewCorrectFeedback(e.target.value)
                            }
                            placeholder="Ex: Parabéns!"
                          />
                        </div>

                        <div className={stylesQuiz.formGroup}>
                          <label>Feedback para erro:</label>
                          <input
                            type="text"
                            value={newWrongFeedback}
                            onChange={(e) =>
                              setNewWrongFeedback(e.target.value)
                            }
                            placeholder="Ex: Tente novamente!"
                          />
                        </div>

                        <div className={stylesQuiz.formActions}>
                          <button
                            className={stylesQuiz.cancelBtn}
                            onClick={handleCancelAddQuestion}
                          >
                            <FaTimes /> Cancelar
                          </button>
                          <button
                            className={stylesQuiz.saveBtn}
                            onClick={handleSaveQuestion}
                          >
                            <FaCheck /> Salvar pergunta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {errorMessage && !showAddQuestion && (
                    <p className={stylesQuiz.errorMsg}>{errorMessage}</p>
                  )}

                  <button
                    className={stylesQuiz.startBtn}
                    onClick={handleStartQuiz}
                  >
                    Iniciar Quiz
                  </button>
                </div>
                </div>
              ) : showResults ? (
                <div className={stylesQuiz.resultsContainer}>
                  {/* <h2>Resultado:</h2> */}
                  <p>
                    Você acertou {score} de {shuffledQuestions.length}{" "}
                    perguntas!
                  </p>
                  <p>
                    Sua pontuação:{" "}
                    {Math.round((score / shuffledQuestions.length) * 100)}%
                  </p>
                  <img
                    src={getResultImage()}
                    alt="Resultado do Quiz"
                    className={stylesQuiz.resultImage}
                  />
                  <button
                    // id="retry-button"
                    className={stylesQuiz.retryBtn}
                    onClick={handleRetryQuiz}
                  >
                    Refazer quiz
                  </button>
                </div>
              ) : (
                <div className={stylesQuiz["quiz-container"]}>
                  <div id="question-container" className={stylesQuiz.question}>
                    {currentQuestion
                      ? `${currentQuestionIndex + 1}. ${
                          currentQuestion.question
                        }`
                      : "Carregando pergunta..."}
                  </div>
                  <div id="answer-buttons" className={stylesQuiz.answers}>
                    {currentQuestion &&
                      currentQuestion.answers.map((answer, index) => (
                        <button
                          key={index}
                          // Apply .answers button styles, and conditionally .correct or .wrong
                          className={`${stylesQuiz["answers-button"]} ${
                            answered
                              ? answer.correct
                                ? stylesQuiz.correct
                                : stylesQuiz.wrong
                              : ""
                          }`}
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
                  {answered &&
                    (currentQuestionIndex < shuffledQuestions.length - 1 ? (
                      <button
                        // id="next-button"
                        className={stylesQuiz.nextBtn}
                        onClick={handleNextQuestion}
                      >
                        Próxima
                      </button>
                    ) : (
                      <button
                        // id="finishBtn"
                        className={`${stylesQuiz.nextBtn} ${stylesQuiz.finishBtn}`} // Applying multiple classes
                        onClick={handleFinishQuiz}
                      >
                        Finalizar quiz
                      </button>
                    ))}
                </div>
              )}
            </main>
            <img
              src={`${import.meta.env.BASE_URL}/imagens/bunny.png`}
              alt=""
              className={stylesQuiz.imagemInferior}
            />
          </div>
        </div>
      </div>

      <BotaoVoltar />
    </>
  );
};

export default Quiz;
