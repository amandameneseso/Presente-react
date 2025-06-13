// src/pages/Profile.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import contentStyles from "../styles/contentWrapper.module.css";
import styles from "../styles/profile.module.css";
import {
  getUserPhotos,
  getUserSongs,
  uploadUserPhoto,
  uploadUserSong,
  deleteUserPhoto,
  deleteUserSong,
  UserPhoto,
  UserSong,
} from "../firebase/userService";
import {
  createSharedGift,
  getUserSharedGifts,
  deactivateSharedGift,
  getSharedGift,
  SharedGift,
} from "../firebase/sharedGiftService";
import { FaShare, FaLink, FaCopy, FaTrash } from "react-icons/fa";

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // Captura o parâmetro id da URL, se existir
  const [activeTab, setActiveTab] = useState<"photos" | "songs" | "share">(
    "photos"
  );
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sharedGifts, setSharedGifts] = useState<SharedGift[]>([]);
  const [creatingGift, setCreatingGift] = useState(false);
  const [giftTitle, setGiftTitle] = useState("");
  const [showShareLink, setShowShareLink] = useState<{
    id: string;
    link: string;
  } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const songInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");

  const loadUserData = useCallback(async () => {
    if (!currentUser) {
      setAuthError("Você precisa fazer login para acessar seu perfil");
      setLoading(false);
      return;
    }

    setAuthError(null);
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

  // Função para carregar dados específicos de um presente compartilhado
  const loadSharedGiftData = useCallback(async (giftId: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      console.log("Carregando dados do presente com ID:", giftId);

      // Buscar os dados do presente específico usando a função getSharedGift do Firebase
      const sharedGift = await getSharedGift(giftId);

      if (!sharedGift) {
        setAuthError("Presente não encontrado ou está inativo");
        setLoading(false);
        return;
      }

      // Atualizar o estado com os dados do presente compartilhado
      setPhotos(sharedGift.photos || []);

      // Converter as músicas do presente compartilhado para o formato UserSong
      // para garantir compatibilidade de tipos (artist é obrigatório em UserSong)
      const userSongs: UserSong[] = (sharedGift.songs || []).map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist || "Artista desconhecido", // Garantir que artist nunca seja undefined
        url: song.url,
        coverUrl: song.coverUrl,
      }));

      setSongs(userSongs);

      // Definir um título do presente no estado, se necessário
      setGiftTitle(sharedGift.title);

      // Atualizar a aba ativa para mostrar as fotos por padrão
      setActiveTab("photos");

      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados do presente compartilhado:", error);
      setAuthError("Erro ao carregar os dados do presente");
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   if (id) {
  //     // Se temos um ID na URL, carregamos os dados específicos desse presente
  //     loadSharedGiftData(id);
  //   } else if (currentUser) {
  //     // Caso contrário, carregamos os dados normais do usuário se estiver logado
  //     loadUserData();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [id, currentUser, loadUserData, loadSharedGiftData]);

  useEffect(() => {
    // Caso contrário, carregamos os dados normais do usuário se estiver logado
    loadUserData();
  }, [id, currentUser]);

  const handlePhotoClick = () => {
    if (!currentUser) {
      setAuthError("Você precisa fazer login para adicionar fotos");
      return;
    }
    photoInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!currentUser) {
      setAuthError("Você precisa fazer login para adicionar fotos");
      return;
    }

    setUploading(true);

    try {
      const file = files[0];
      await uploadUserPhoto(currentUser.uid, file);

      // Recarregar fotos após upload
      const userPhotos = await getUserPhotos(currentUser.uid);
      setPhotos(userPhotos);
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      alert("Erro ao enviar a foto. Tente novamente.");
    } finally {
      setUploading(false);
      // Limpar o input
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleSongClick = () => {
    if (!currentUser) {
      setAuthError("Você precisa fazer login para adicionar músicas");
      return;
    }
    songInputRef.current?.click();
  };

  const handleCoverClick = () => {
    if (!currentUser) {
      setAuthError("Você precisa fazer login para adicionar músicas");
      return;
    }
    coverInputRef.current?.click();
  };

  const handleSongSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const songFile = songInputRef.current?.files?.[0];
    const coverFile = coverInputRef.current?.files?.[0];

    if (!songFile || !currentUser) {
      alert("Selecione um arquivo de música.");
      return;
    }

    setUploading(true);

    try {
      await uploadUserSong(currentUser.uid, songFile, {
        title: songTitle || "Música sem título",
        artist: songArtist || "Artista desconhecido",
        coverFile: coverFile,
      });

      const updatedSongs = await getUserSongs(currentUser.uid);
      setSongs(updatedSongs);

      setSongTitle("");
      setSongArtist("");

      if (songInputRef.current) songInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";
    } catch (error) {
      console.error("Erro ao fazer upload da música:", error);
      alert("Erro ao fazer upload da música. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: UserPhoto) => {
    if (!currentUser) {
      setAuthError("Você precisa fazer login para excluir fotos");
      return;
    }

    if (!photo.id) return;

    if (confirm("Tem certeza que deseja excluir esta foto?")) {
      try {
        await deleteUserPhoto(currentUser.uid, photo.id);
        setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photo.id));
      } catch (error) {
        console.error("Erro ao excluir foto:", error);
        alert("Erro ao excluir a foto. Tente novamente.");
      }
    }
  };

  const handleDeleteSong = async (song: UserSong) => {
    if (!currentUser || !song.id) return;

    if (confirm("Tem certeza que deseja excluir esta música?")) {
      try {
        await deleteUserSong(currentUser.uid, song.id);
        setSongs((prevSongs) => prevSongs.filter((s) => s.id !== song.id));
      } catch (error) {
        console.error("Erro ao excluir música:", error);
        alert("Erro ao excluir a música. Tente novamente.");
      }
    }
  };

  const handleCreateSharedGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthError(
        "Você precisa fazer login para criar presentes compartilhados"
      );
      return;
    }

    if (!giftTitle.trim()) {
      alert("Por favor, dê um título para o seu presente");
      return;
    }

    setCreatingGift(true);

    try {
      // Criar o presente compartilhado
      const giftId = await createSharedGift(
        currentUser.uid,
        giftTitle,
        photos,
        songs
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

  const handleCopyLink = () => {
    if (!showShareLink || !linkRef.current) return;

    linkRef.current.select();
    document.execCommand("copy");
    alert("Link copiado para a área de transferência!");
  };

  const handleDeactivateGift = async (giftId: string) => {
    if (!currentUser) {
      setAuthError(
        "Você precisa fazer login para gerenciar presentes compartilhados"
      );
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <Clouds />

      <div className={contentStyles.contentWrapper}>
        {!currentUser && !id ? (
          <div className={styles.noAuthMessage}>
            <h2>Acesso restrito</h2>
            <p>
              {authError ||
                "Esta é uma área restrita para usuários logados. Faça login ou cadastre-se para gerenciar suas fotos, músicas e presentes compartilhados."}
            </p>
            <p>
              No momento, você pode visualizar fotos e músicas padrão nas
              páginas de Momentos e Playlist.
            </p>
            <div className={styles.authButtons}>
              <Link
                to="/login"
                className={`${styles.demoButton} ${styles.loginButton}`}
              >
                Fazer Login
              </Link>
              <Link
                to="/register"
                className={`${styles.demoButton} ${styles.registerButton}`}
              >
                Cadastre-se
              </Link>
            </div>
            <div className={styles.demoButtons}>
              <Link to="/momentos" className={styles.demoButton}>
                Ver Fotos
              </Link>
              <Link to="/playlist" className={styles.demoButton}>
                Ouvir Músicas
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <h1>Meu perfil</h1>
              <p>Olá, {currentUser?.displayName || "Usuário"}</p>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Sair
              </button>
            </div>

            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "photos" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("photos")}
              >
                Minhas fotos
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "songs" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("songs")}
              >
                Minhas músicas
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "share" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("share")}
              >
                Compartilhar site
              </button>
            </div>

            {activeTab === "photos" && (
              <div className={styles.tabContent}>
                <div className={styles.uploadArea}>
                  <button
                    className={styles.uploadButton}
                    onClick={handlePhotoClick}
                    disabled={uploading}
                  >
                    {uploading ? "Enviando..." : "Adicionar foto"}
                  </button>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>

                {loading ? (
                  <div className={styles.loadingMessage}>
                    Carregando suas fotos...
                  </div>
                ) : (
                  <div className={styles.photosGrid}>
                    {photos.length === 0 ? (
                      <div className={styles.emptyMessage}>
                        Você ainda não adicionou nenhuma foto. Adicione sua
                        primeira foto!
                      </div>
                    ) : (
                      photos.map((photo, index) => (
                        <div
                          key={photo.id || index}
                          className={styles.photoItem}
                        >
                          <img
                            src={photo.url}
                            alt={photo.description || `Foto ${index + 1}`}
                          />
                          <div className={styles.photoOverlay}>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeletePhoto(photo)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "share" && (
              <div className={styles.tabContent}>
                <div className={styles.shareSection}>
                  <h3>Criar e compartilhar site</h3>
                  <p className={styles.shareDescription}>
                    Crie seu site especial que permite compartilhar suas fotos e
                    músicas com alguém especial, sem que esta pessoa precise
                    fazer login.
                  </p>

                  {/* Formulário para criar novo presente */}
                  <div className={styles.createGiftForm}>
                    <h4>Novo presente</h4>
                    <form onSubmit={handleCreateSharedGift}>
                      <div className={styles.formGroup}>
                        <label htmlFor="giftTitle">Título do presente</label>
                        <input
                          type="text"
                          id="giftTitle"
                          value={giftTitle}
                          onChange={(e) => setGiftTitle(e.target.value)}
                          placeholder="Ex: Nosso cantinho"
                          required
                        />
                      </div>

                      <div className={styles.shareInfo}>
                        <p>O que será incluído no seu presente:</p>
                        <ul>
                          <li>
                            {photos.length} foto{photos.length !== 1 ? "s" : ""}
                          </li>
                          <li>
                            {songs.length} música{songs.length !== 1 ? "s" : ""}
                          </li>
                        </ul>
                      </div>

                      <button
                        type="submit"
                        className={styles.createShareButton}
                        disabled={
                          creatingGift ||
                          (photos.length === 0 && songs.length === 0)
                        }
                      >
                        {creatingGift ? "Criando..." : "Criar presente"}
                        <FaShare className={styles.buttonIcon} />
                      </button>

                      {photos.length === 0 && songs.length === 0 && (
                        <p className={styles.warningText}>
                          Adicione pelo menos uma foto ou música antes de criar
                          um presente.
                        </p>
                      )}
                    </form>
                  </div>

                  {/* Modal para mostrar link compartilhável */}
                  {showShareLink && (
                    <div className={styles.shareLinkModal}>
                      <h4>Seu presente está pronto!</h4>
                      <p>Compartilhe este link:</p>

                      <div className={styles.linkContainer}>
                        <input
                          type="text"
                          ref={linkRef}
                          value={showShareLink.link}
                          readOnly
                          className={styles.linkInput}
                        />
                        <button
                          className={styles.copyButton}
                          onClick={handleCopyLink}
                        >
                          <FaCopy /> Copiar
                        </button>
                      </div>

                      <button
                        className={styles.closeModalButton}
                        onClick={() => setShowShareLink(null)}
                      >
                        Fechar
                      </button>
                    </div>
                  )}

                  {/* Lista de presentes compartilhados anteriormente */}
                  <div className={styles.sharedGiftsList}>
                    <h4>Presentes compartilhados</h4>

                    {loading ? (
                      <p>Carregando seus presentes...</p>
                    ) : sharedGifts.length === 0 ? (
                      <p>Você ainda não criou nenhum presente.</p>
                    ) : (
                      <ul className={styles.giftsList}>
                        {sharedGifts.map((gift) => (
                          <li key={gift.id} className={styles.giftItem}>
                            <div className={styles.giftDetails}>
                              <h5>{gift.title}</h5>
                              <p>
                                Criado em:{" "}
                                {new Date(gift.createdAt).toLocaleDateString()}
                              </p>
                              <p
                                className={
                                  gift.isActive
                                    ? styles.activeStatus
                                    : styles.inactiveStatus
                                }
                              >
                                Status: {gift.isActive ? "Ativo" : "Inativo"}
                              </p>
                            </div>

                            <div className={styles.giftActions}>
                              {gift.isActive ? (
                                <>
                                  <button
                                    className={styles.giftLinkButton}
                                    onClick={() => {
                                      const baseUrl = window.location.origin;
                                      const link = `${baseUrl}/#/profile/${gift.id}`;
                                      navigator.clipboard.writeText(link);
                                      alert(
                                        "Link copiado para a área de transferência!"
                                      );
                                    }}
                                  >
                                    <FaLink /> Copiar Link
                                  </button>

                                  <button
                                    className={styles.deactivateButton}
                                    onClick={() =>
                                      handleDeactivateGift(gift.id)
                                    }
                                  >
                                    <FaTrash /> Desativar
                                  </button>
                                </>
                              ) : (
                                <span className={styles.deactivatedText}>
                                  Este presente foi desativado
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "songs" && (
              <div className={styles.tabContent}>
                <div className={styles.uploadForm}>
                  <h3>Adicionar música</h3>
                  <form onSubmit={handleSongSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="songTitle">Título</label>
                      <input
                        type="text"
                        id="songTitle"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="songArtist">Artista</label>
                      <input
                        type="text"
                        id="songArtist"
                        value={songArtist}
                        onChange={(e) => setSongArtist(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Arquivo da música</label>
                      <button
                        type="button"
                        className={styles.fileButton}
                        onClick={handleSongClick}
                      >
                        Selecionar arquivo
                      </button>
                      <input
                        type="file"
                        ref={songInputRef}
                        accept="audio/*"
                        style={{ display: "none" }}
                        required
                      />
                      <span className={styles.fileName}>
                        {songInputRef.current?.files?.[0]?.name ||
                          "Nenhum arquivo selecionado"}
                      </span>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Capa da música (opcional)</label>
                      <button
                        type="button"
                        className={styles.fileButton}
                        onClick={handleCoverClick}
                      >
                        Selecionar capa
                      </button>
                      <input
                        type="file"
                        ref={coverInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <span className={styles.fileName}>
                        {coverInputRef.current?.files?.[0]?.name ||
                          "Nenhuma capa selecionada"}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={uploading}
                    >
                      {uploading ? "Enviando..." : "Adicionar música"}
                    </button>
                  </form>
                </div>

                {loading ? (
                  <div className={styles.loadingMessage}>
                    Carregando suas músicas...
                  </div>
                ) : (
                  <div className={styles.songsList}>
                    <h3>Minhas músicas</h3>
                    {songs.length === 0 ? (
                      <div className={styles.emptyMessage}>
                        Você ainda não adicionou nenhuma música.
                      </div>
                    ) : (
                      <div className={styles.songsGrid}>
                        {songs.map((song, index) => (
                          <div
                            key={song.id || index}
                            className={styles.songItem}
                          >
                            <div className={styles.songCover}>
                              {song.coverUrl ? (
                                <img
                                  src={song.coverUrl}
                                  alt={`Capa de ${song.title}`}
                                />
                              ) : (
                                <div className={styles.defaultCover}>
                                  <span>{song.title.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className={styles.songInfo}>
                              <h4>{song.title}</h4>
                              <p>{song.artist}</p>
                            </div>
                            <div className={styles.songActions}>
                              <audio src={song.url} controls />
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteSong(song)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <BotaoVoltar />
      <Footer />
    </div>
  );
}

export default Profile;
