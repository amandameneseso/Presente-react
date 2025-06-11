import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSharedGift,
  SharedGift as SharedGiftType,
} from "../firebase/sharedGiftService";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/sharedGift.module.css";
import {
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useMusic } from "../context/MusicPlayerContext";
// Definindo as interfaces de música
// Interface para o formato das músicas no presente compartilhado
interface SharedGiftSong {
  id: string;
  title: string;
  artist?: string;
  url: string;
  coverUrl?: string;
}

// Interface para o formato das músicas esperado pelo player
type PlayerSongFormat = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover: string;
};

const SharedGift: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [gift, setGift] = useState<SharedGiftType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1); // -1 significa que nenhuma foto está selecionada

  const { playSong, isPlaying, togglePlayPause, currentSong } = useMusic();

  useEffect(() => {
    const loadGift = async () => {
      if (!id) {
        setError("ID do presente não encontrado");
        setLoading(false);
        return;
      }

      try {
        const giftData = await getSharedGift(id);

        if (!giftData) {
          setError("Presente não encontrado ou não está mais disponível");
          setLoading(false);
          return;
        }

        setGift(giftData);
      } catch (err) {
        console.error("Erro ao carregar presente:", err);
        setError(
          "Ocorreu um erro ao carregar o presente. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGift();
  }, [id]);

  const handleNextPhoto = () => {
    if (gift && gift.photos.length > 0) {
      setSelectedPhotoIndex((prev) =>
        prev >= gift.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevPhoto = () => {
    if (gift && gift.photos.length > 0) {
      setSelectedPhotoIndex((prev) =>
        prev <= 0 ? gift.photos.length - 1 : prev - 1
      );
    }
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(-1);
  };

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handlePlaySong = (song: SharedGiftSong) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      // Adaptar o formato da música para o formato esperado pelo player
      const playerSong: PlayerSongFormat = {
        id: song.id,
        title: song.title,
        artist: song.artist || "Artista Desconhecido",
        src: song.url,
        cover:
          song.coverUrl ||
          "https://placehold.co/100x100/7971ea/ffffff?text=Música",
      };
      playSong(playerSong);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando seu presente especial...</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className={styles.errorContainer}>
        <MdError size={50} color="#ff6b6b" />
        <h2>Ops! Algo deu errado</h2>
        <p>{error || "Não foi possível carregar o presente"}</p>
      </div>
    );
  }

  return (
    <div className={styles.giftContainer}>
      <div className={styles.giftHeader}>
        <h1>{gift.title}</h1>
        <div className={styles.heartIcon}>
          <FaHeart color="#ff6b6b" size={24} />
        </div>
        {!currentUser && (
          <div className={styles.authActions}>
            <Link to="/login" className={styles.loginButton}>
              Fazer login
            </Link>
            <Link to="/register" className={styles.registerButton}>
              Cadastre-se
            </Link>
          </div>
        )}
        {currentUser && (
          <div className={styles.authActions}>
            <button
              className={styles.profileButton}
              onClick={() => navigate("/profile")}
            >
              Gerenciar presente
            </button>
          </div>
        )}
      </div>

      {/* Informações de acesso */}
      <div className={styles.infoBox}>
        {!currentUser ? (
          <p>
            <strong>Aviso:</strong> Faça login para adicionar ou remover suas
            próprias fotos e músicas.
          </p>
        ) : (
          <p>
            <strong>Bem-vindo(a)!</strong> Você está logado(a) e pode gerenciar
            suas fotos e músicas no seu perfil.
          </p>
        )}
      </div>

      {/* Seção de Fotos */}
      {gift.photos && gift.photos.length > 0 && (
        <section className={styles.photosSection}>
          <h2>Nossos Momentos</h2>
          <div className={styles.photoGrid}>
            {gift.photos.map((photo, index) => (
              <div
                key={photo.id}
                className={styles.photoItem}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Momento ${index + 1}`}
                  loading="lazy"
                />
                {photo.caption && (
                  <span className={styles.photoCaption}>{photo.caption}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Músicas */}
      {gift.songs && gift.songs.length > 0 && (
        <section className={styles.songsSection}>
          <h2>Nossa Playlist</h2>
          <div className={styles.songsList}>
            {gift.songs.map((song) => (
              <div
                key={song.id}
                className={`${styles.songItem} ${
                  currentSong?.id === song.id ? styles.activeSong : ""
                }`}
                onClick={() => handlePlaySong(song)}
              >
                <div className={styles.songCover}>
                  {song.coverUrl ? (
                    <img src={song.coverUrl} alt={`Capa - ${song.title}`} />
                  ) : (
                    <div className={styles.defaultCover}>
                      <FaHeart size={24} />
                    </div>
                  )}
                </div>
                <div className={styles.songInfo}>
                  <span className={styles.songTitle}>{song.title}</span>
                  {song.artist && (
                    <span className={styles.songArtist}>{song.artist}</span>
                  )}
                </div>
                <div className={styles.playIndicator}>
                  {currentSong?.id === song.id && (
                    <div
                      className={`${styles.equalizer} ${
                        isPlaying ? styles.playing : ""
                      }`}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox para visualizar fotos */}
      {selectedPhotoIndex >= 0 && gift.photos[selectedPhotoIndex] && (
        <div className={styles.lightbox}>
          <div
            className={styles.lightboxOverlay}
            onClick={handleCloseLightbox}
          ></div>
          <div className={styles.lightboxContent}>
            <button
              className={styles.closeButton}
              onClick={handleCloseLightbox}
            >
              <FaTimes size={24} />
            </button>
            <button className={styles.navButton} onClick={handlePrevPhoto}>
              <FaChevronLeft size={24} />
            </button>
            <div className={styles.lightboxImageContainer}>
              <img
                src={gift.photos[selectedPhotoIndex].url}
                alt={
                  gift.photos[selectedPhotoIndex].caption ||
                  `Momento ${selectedPhotoIndex + 1}`
                }
                className={styles.lightboxImage}
              />
              {gift.photos[selectedPhotoIndex].caption && (
                <div className={styles.lightboxCaption}>
                  {gift.photos[selectedPhotoIndex].caption}
                </div>
              )}
            </div>
            <button className={styles.navButton} onClick={handleNextPhoto}>
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      <footer className={styles.giftFooter}>
        <p>Presente criado com ♥</p>
      </footer>
    </div>
  );
};

export default SharedGift;
