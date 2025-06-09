import styles from"../styles/home.module.css";
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
  UserSong 
} from "../firebase/userService";
import {
  createSharedGift,
  getUserSharedGifts,
  deactivateSharedGift,
  SharedGift
} from "../firebase/sharedGiftService";

function Home() {
  const { currentUser, logout } = useAuth(); // Adicionamos a função de logout
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharedGifts, setSharedGifts] = useState<SharedGift[]>([]);
  const [creatingGift, setCreatingGift] = useState(false);
  const [giftTitle, setGiftTitle] = useState('');
  const [showShareLink, setShowShareLink] = useState<{id: string, link: string} | null>(null);
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
      console.error('Erro ao carregar dados do usuário:', error);
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
      alert('Você precisa fazer login para criar presentes compartilhados');
      return;
    }
    
    if (!giftTitle.trim()) {
      alert('Por favor, dê um título para o seu presente');
      return;
    }
    
    setCreatingGift(true);
    
    try {
      // Criar o presente compartilhado
      const giftId = await createSharedGift(currentUser.uid, giftTitle, photos, songs);
      
      // Atualizar a lista de presentes compartilhados
      const userSharedGifts = await getUserSharedGifts(currentUser.uid);
      setSharedGifts(userSharedGifts);
      
      // Mostrar o link para compartilhar
      const baseUrl = window.location.origin;
      setShowShareLink({
        id: giftId,
        link: `${baseUrl}/#/presente/${giftId}`
      });
      
      // Limpar o formulário
      setGiftTitle('');
    } catch (error) {
      console.error('Erro ao criar presente compartilhado:', error);
      alert('Erro ao criar o presente compartilhado. Tente novamente.');
    } finally {
      setCreatingGift(false);
    }
  };
  
  // Copiar link para área de transferência
  const copyToClipboard = () => {
    if (linkRef.current) {
      linkRef.current.select();
      document.execCommand('copy');
      alert('Link copiado para a área de transferência!');
    }
  };
  
  // Desativar presente compartilhado
  const handleDeactivateGift = async (giftId: string) => {
    if (!currentUser) {
      alert('Você precisa fazer login para gerenciar presentes compartilhados');
      return;
    }
    
    if (confirm('Tem certeza que deseja desativar este link? Pessoas com esse link não poderão mais acessar o presente.')) {
      try {
        await deactivateSharedGift(giftId, currentUser.uid);
        
        // Atualizar a lista de presentes compartilhados
        setSharedGifts(prevGifts => prevGifts.map(gift => 
          gift.id === giftId ? { ...gift, isActive: false } : gift
        ));
      } catch (error) {
        console.error('Erro ao desativar presente:', error);
        alert('Erro ao desativar o presente. Tente novamente.');
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
              <h2>Presentes Compartilhados</h2>
              <button 
                onClick={() => setShowGiftPanel(false)} 
                className={styles.closeGiftPanelButton}
                aria-label="Fechar"
              >
                <FaWindowClose />
              </button>
            </div>
            
            {currentUser && (
              <div className={styles.logoutButtonContainer}>
                <button 
                  onClick={async () => {
                    try {
                      await logout();
                      navigate('/');
                      setShowGiftPanel(false);
                    } catch (error) {
                      console.error('Erro ao fazer logout:', error);
                    }
                  }} 
                  className={styles.logoutButton}
                >
                  Sair
                </button>
              </div>
            )}
            
            {!currentUser ? (
              <div className={styles.authMessage}>
                <p>Faça login ou cadastre-se para criar e gerenciar presentes compartilhados.</p>
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.authButton}>Fazer Login</Link>
                  <Link to="/register" className={styles.registerButton}>Cadastre-se</Link>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleCreateSharedGift} className={styles.giftForm}>
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
                    {creatingGift ? 'Criando...' : 'Criar Presente'}
                  </button>
                </form>
                
                <div className={styles.giftsList}>
                  <h3>Seus presentes:</h3>
                  
                  {loading ? (
                    <p>Carregando presentes...</p>
                  ) : sharedGifts.length === 0 ? (
                    <p>Nenhum presente criado ainda.</p>
                  ) : (
                    <ul>
                      {sharedGifts.map((gift) => (
                        <li key={gift.id} className={styles.giftItem}>
                          <div className={styles.giftInfo}>
                            <span className={styles.giftTitle}>{gift.title}</span>
                            <span className={gift.isActive ? styles.giftActive : styles.giftInactive}>
                              {gift.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <div className={styles.giftActions}>
                            {gift.isActive && (
                              <button
                                className={styles.linkButton}
                                onClick={() => {
                                  const baseUrl = window.location.origin;
                                  setShowShareLink({
                                    id: gift.id,
                                    link: `${baseUrl}/#/presente/${gift.id}`
                                  });
                                }}
                              >
                                Ver Link
                              </button>
                            )}
                            {gift.isActive && (
                              <button
                                className={styles.deactivateButton}
                                onClick={() => handleDeactivateGift(gift.id)}
                              >
                                Desativar
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {showShareLink && (
                  <div className={styles.modalOverlay} onClick={closeShareModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.modalHeader}>
                        <h3>Link do seu presente</h3>
                        <button onClick={closeShareModal} className={styles.closeButton}>
                          <FaTimes />
                        </button>
                      </div>
                      <p>Copie e compartilhe este link com quem você desejar:</p>
                      <div className={styles.linkContainer}>
                        <input
                          ref={linkRef}
                          type="text"
                          value={showShareLink.link}
                          readOnly
                          className={styles.linkInput}
                        />
                        <button onClick={copyToClipboard} className={styles.copyButton}>
                          <FaCopy />
                        </button>
                      </div>
                      <div className={styles.linkPreview}>
                        <button
                          onClick={() => navigate(`/presente/${showShareLink.id}`)}
                          className={styles.previewButton}
                        >
                          Visualizar presente
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
            <img src="/imagens/câmera-100.png" className={styles.icone} alt="Momentos" />
            <span>Momentos</span>
          </Link>
          <Link to="/jornada" className={styles.botao}>
            <img src="/imagens/relógio-100.png" className={styles.icone} alt="Jornada" />
            <span>Jornada</span>
          </Link>
          <Link to="/carta" className={styles.botao}>
            <img src="/imagens/mensagem-100.png" className={styles.icone} alt="Carta" />
            <span>Carta</span>
          </Link>
          <Link to="/quiz" className={styles.botao}>
            <img src="/imagens/controle-100.png" className={styles.icone} alt="Quiz" />
            <span>Quiz</span>
          </Link>
          <Link to="/playlist" className={styles.botao}>
            <img src="/imagens/apple-music-100.png" className={styles.icone} alt="Playlist" />
            <span>Playlist</span>
          </Link>
          {/* <Link to="/lagodosdesejos" className={styles.botao}>
            <img src="" className="icone" alt="" />
            <span>Desejo</span>
          </Link> */}
          <Link to="/desejo" className={styles.botao}>
            <img src="/imagens/noite-nublada-100.png" className={styles.icone} alt="" />
            <span>Desejo</span>
          </Link>
          <div>
            <button 
              onClick={() => setShowGiftPanel(!showGiftPanel)} 
              className={`${styles.botao} ${styles.giftPanelButton}`}
            >
              <img src="/imagens/configuracoes-100.png" className={styles.icone} alt="" />
              <span>{showGiftPanel ? 'Ocultar' : 'Gerenciar'}</span>
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
