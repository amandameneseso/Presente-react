import styles from "../styles/home.module.css";
// import globalStyle from "../styles/style.module.css";
// import ursoStyles from"../styles/urso.module.css";
import Clouds from "../components/Clouds";
import { useEffect, useState, useCallback, useRef } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import MiniPlayer from "../components/MiniPlayer";
import { useAuth } from "../context/AuthContext"; // Obtém funções de autenticação
import { FaCopy, FaTimes, FaWindowClose } from "react-icons/fa";
import {
  getUserPhotos,
  getUserSongs,
  UserPhoto,
  UserSong,
} from "../firebase/userService";
import {
  createSharedGift,
  getUserSharedGifts,
  deactivateSharedGift,
  SharedGift,
  reactivateSharedGift,
} from "../firebase/sharedGiftService";

function Home() {
  const { currentUser, logout } = useAuth(); // Adicionamos a função de logout
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharedGifts, setSharedGifts] = useState<SharedGift[]>([]);
  const [creatingGift, setCreatingGift] = useState(false);
  const [giftTitle, setGiftTitle] = useState("");
  const [showShareLink, setShowShareLink] = useState<{
    id: string;
    link: string;
  } | null>(null);
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  const linkRef = useRef<HTMLInputElement>(null);

  // Carregar dados do usuário (fotos, músicas, presentes compartilhados)
  const loadUserData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const userPhotos = await getUserPhotos(currentUser.uid);
      setPhotos(userPhotos);

      const userSongs = await getUserSongs(currentUser.uid);
      setSongs(userSongs);

      const userSharedGifts = await getUserSharedGifts(currentUser.uid);
      setSharedGifts(userSharedGifts);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Carregar dados ao montar o componente e quando o usuário mudar
  useEffect(() => {
    loadUserData();
  }, [currentUser, loadUserData]);

  // Criar presente compartilhado
  const handleCreateSharedGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Você precisa fazer login para criar presentes compartilhados");
      return;
    }

    if (!giftTitle.trim()) {
      alert("Por favor, dê um título para o seu presente");
      return;
    }

    setCreatingGift(true);

    try {
      // Converter UserPhoto[] para o formato esperado por SharedGift
      const formattedPhotos = photos.map((photo) => ({
        id: photo.id || generateUniqueId(), // Garantir que sempre tenha um ID
        url: photo.url,
        caption: photo.description, // Renomear description para caption
      }));

      // Garantir que as músicas também estão no formato correto
      const formattedSongs = songs.map((song) => ({
        id: song.id || generateUniqueId(),
        title: song.title,
        artist: song.artist,
        url: song.url,
        coverUrl: song.coverUrl,
      }));

      // Criar o presente compartilhado
      const giftId = await createSharedGift(
        currentUser.uid,
        giftTitle,
        formattedPhotos,
        formattedSongs
      );

      // Atualizar a lista de presentes compartilhados
      const userSharedGifts = await getUserSharedGifts(currentUser.uid);
      setSharedGifts(userSharedGifts);

      // Mostrar o link para compartilhar
      const baseUrl = window.location.origin;
      setShowShareLink({
        id: giftId,
        link: `${baseUrl}/#/profile/${giftId}`,
      });

      // Limpar o formulário
      setGiftTitle("");
    } catch (error) {
      console.error("Erro ao criar presente compartilhado:", error);
      alert("Erro ao criar o presente compartilhado. Tente novamente.");
    } finally {
      setCreatingGift(false);
    }
  };

  // Função auxiliar para gerar IDs únicos quando necessário
  const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Copiar link para área de transferência
  const copyToClipboard = () => {
    if (linkRef.current) {
      linkRef.current.select();
      document.execCommand("copy");
      alert("Link copiado para a área de transferência!");
    }
  };

  // Desativar presente compartilhado
  const handleDeactivateGift = async (giftId: string) => {
    if (!currentUser) {
      alert("Você precisa fazer login para gerenciar presentes compartilhados");
      return;
    }

    if (
      confirm(
        "Tem certeza que deseja desativar este link? Pessoas com esse link não poderão mais acessar o presente."
      )
    ) {
      try {
        await deactivateSharedGift(giftId, currentUser.uid);

        // Atualizar a lista de presentes compartilhados
        setSharedGifts((prevGifts) =>
          prevGifts.map((gift) =>
            gift.id === giftId ? { ...gift, isActive: false } : gift
          )
        );
      } catch (error) {
        console.error("Erro ao desativar presente:", error);
        alert("Erro ao desativar o presente. Tente novamente.");
      }
    }
  };

  const handleReactivateGift = async (giftId: string) => {
    if (!currentUser) {
      alert("Você precisa fazer login para gerenciar presentes compartilhados");
      return;
    }

    if (
      confirm(
        "Deseja reativar este presente? Pessoas com o link poderão acessá-lo novamente."
      )
    ) {
      try {
        await reactivateSharedGift(giftId, currentUser.uid);

        // Atualizar a lista de presentes compartilhados
        setSharedGifts((prevGifts) =>
          prevGifts.map((gift) =>
            gift.id === giftId ? { ...gift, isActive: true } : gift
          )
        );
      } catch (error) {
        console.error("Erro ao reativar presente:", error);
        alert("Erro ao reativar o presente. Tente novamente.");
      }
    }
  };
  // Fechar modal de link compartilhado
  const closeShareModal = () => {
    setShowShareLink(null);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = import.meta.env.BASE_URL + "/js/urso.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Clouds />

      <MiniPlayer />

      {/* Botão para alternar o painel de presentes compartilhados */}
      {/* <div className={styles.giftPanelToggle}>
        <button 
          onClick={() => setShowGiftPanel(!showGiftPanel)} 
          className={styles.giftPanelButton}
        >
          {showGiftPanel ? 'Ocultar presentes' : 'Gerenciar presentes'}
        </button>
      </div> */}

      {/* Painel de presentes compartilhados */}
      {showGiftPanel && (
        <div className={styles.giftPanelContainer}>
          <div className={styles.giftPanel}>
            <div className={styles.giftPanelHeader}>
              <h2 className={styles.mainMenuTitle}>Gerenciar</h2>
              <button
                onClick={() => setShowGiftPanel(false)}
                className={styles.closeGiftPanelButton}
                aria-label="Fechar"
              >
                <FaWindowClose />
              </button>
            </div>

            {!currentUser ? (
              <div className={styles.authMessage}>
                <p>
                  Faça login ou cadastre-se para criar e gerenciar presentes
                  compartilhados.
                </p>
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.authButton}>
                    Fazer login
                  </Link>
                  <Link to="/register" className={styles.registerButton}>
                    Cadastre-se
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Só mostrar formulário de criação se o usuário não tem presentes */}
                <div className={styles.presentContent}>
                  {sharedGifts.length === 0 && (
                    <form
                      onSubmit={handleCreateSharedGift}
                      className={styles.giftForm}
                    >
                      <div className={styles.formGroup}>
                        <input
                          type="text"
                          placeholder="Dê um título para seu presente..."
                          value={giftTitle}
                          onChange={(e) => setGiftTitle(e.target.value)}
                          disabled={creatingGift}
                          className={styles.giftInput}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={creatingGift}
                        className={styles.giftButton}
                      >
                        {creatingGift ? "Criando..." : "Criar Presente"}
                      </button>
                    </form>
                  )}

                  <div className={styles.giftsList}>
                    {loading ? (
                      <p>Carregando presentes...</p>
                    ) : sharedGifts.length === 0 ? (
                      <p>Nenhum presente criado ainda.</p>
                    ) : (
                      <div className={styles.presentCard}>
                        {sharedGifts.slice(0, 1).map((gift) => (
                          <div key={gift.id}>
                            <div className={styles.presentHeader}>
                              <div className={styles.presentTitleRow}>
                                <p>Nome:</p>
                                <h3 className={styles.giftTitle}>
                                  {gift.title}
                                </h3>
                                <div
                                  className={
                                    gift.isActive
                                      ? styles.activeStatus
                                      : styles.inactiveStatus
                                  }
                                >
                                  <span className={styles.statusIcon}>
                                    {gift.isActive ? "●" : "○"}
                                  </span>
                                  <span>
                                    {gift.isActive ? "Ativo" : "Inativo"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className={styles.giftButtonsContainer}>
                              {gift.isActive && (
                                <button
                                  className={styles.linkButton}
                                  onClick={() => {
                                    const baseUrl = window.location.origin;
                                    setShowShareLink({
                                      id: gift.id,
                                      link: `${baseUrl}/#/profile/${gift.id}`,
                                    });
                                  }}
                                >
                                  Ver link
                                </button>
                              )}
                              {gift.isActive && (
                                <button
                                  className={styles.linkButton}
                                  onClick={() => {
                                    navigate(`/profile/${gift.id}`);
                                  }}
                                >
                                  Gerenciar presente
                                </button>
                              )}
                              {gift.isActive ? (
                                <button
                                  className={styles.deactivateButton}
                                  onClick={() => handleDeactivateGift(gift.id)}
                                >
                                  Desativar
                                </button>
                              ) : (
                                <button
                                  className={styles.activateButton}
                                  onClick={() => handleReactivateGift(gift.id)}
                                >
                                  Ativar
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botão de logout posicionado na parte inferior */}
                  <div className={styles.bottomButtonContainer}>
                    <button
                      onClick={async () => {
                        try {
                          await logout();
                          navigate("/");
                          setShowGiftPanel(false);
                        } catch (error) {
                          console.error("Erro ao fazer logout:", error);
                        }
                      }}
                      className={styles.logoutButtonPanel}
                    >
                      Sair
                    </button>
                  </div>
                </div>

                {/* Modal de compartilhamento do link */}
                {showShareLink && (
                  <div
                    className={styles.modalOverlay}
                    onClick={closeShareModal}
                  >
                    <div
                      className={styles.modal}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.modalHeader}>
                        <h3>Link do seu presente</h3>
                        <button
                          onClick={closeShareModal}
                          className={styles.closeButton}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <p>
                        Copie e compartilhe este link com quem você desejar:
                      </p>
                      <div className={styles.linkContainer}>
                        <input
                          ref={linkRef}
                          type="text"
                          value={showShareLink.link}
                          readOnly
                          className={styles.linkInput}
                        />
                        <button
                          onClick={copyToClipboard}
                          className={styles.copyButton}
                        >
                          <FaCopy />
                        </button>
                      </div>
                      <div className={styles.linkPreview}>
                        <button
                          onClick={() =>
                            navigate(`/profile/${showShareLink.id}`)
                          }
                          className={styles.previewButton}
                        >
                          Gerenciar presente
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles.botoesWrapper}>
        <div className={styles.botoesContainer}>
          <Link to="/momentos" className={styles.botao}>
            <img
              src="/imagens/câmera-100.png"
              className={styles.icone}
              alt="Momentos"
            />
            <span>Momentos</span>
          </Link>
          <Link to="/jornada" className={styles.botao}>
            <img
              src="/imagens/relógio-100.png"
              className={styles.icone}
              alt="Jornada"
            />
            <span>Jornada</span>
          </Link>
          <Link to="/carta" className={styles.botao}>
            <img
              src="/imagens/mensagem-100.png"
              className={styles.icone}
              alt="Carta"
            />
            <span>Carta</span>
          </Link>
          <Link to="/quiz" className={styles.botao}>
            <img
              src="/imagens/controle-100.png"
              className={styles.icone}
              alt="Quiz"
            />
            <span>Quiz</span>
          </Link>
          <Link to="/playlist" className={styles.botao}>
            <img
              src="/imagens/apple-music-100.png"
              className={styles.icone}
              alt="Playlist"
            />
            <span>Playlist</span>
          </Link>
          {/* <Link to="/lagodosdesejos" className={styles.botao}>
            <img src="" className="icone" alt="" />
            <span>Desejo</span>
          </Link> */}
          <Link to="/desejo" className={styles.botao}>
            <img
              src="/imagens/noite-nublada-100.png"
              className={styles.icone}
              alt=""
            />
            <span>Desejo</span>
          </Link>
          <div className={styles.botao}>
            <button
              onClick={() => setShowGiftPanel(!showGiftPanel)}
              className={styles.giftPanelButton}
            >
              <img
                src="/imagens/configuracoes-100.png"
                className={styles.icone}
                alt=""
              />
              {/* <span>{showGiftPanel ? "Ocultar" : "Gerenciar"}</span> */}
              <span> {"Gerenciar"}</span>
            </button>
          </div>
        </div>
        {/* <div className={styles.musicbox}>
          <img src="/imagens/recordplayer.png" alt="Vitrola" />
          <iframe
            src="https://open.spotify.com/embed/track/37Q5anxoGWYdRsyeXkkNoI?utm_source=generator"
            width="100%"
            height="552"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div> */}
      </div>

      {/* Urso */}
      {/* <div className={ursoStyles.urso}></div> */}

      <Footer />
    </>
  );
}

export default Home;
