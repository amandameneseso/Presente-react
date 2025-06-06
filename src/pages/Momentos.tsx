import { Link } from "react-router-dom"; // Usado para link para a página de perfil
import React, { useState, useEffect, useCallback } from "react";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import LightboxSettings from "../components/MomentosSettings"; // Import the new component
import momentosStyles from "../styles/momentos.module.css";
import contentStyles from "../styles/contentWrapper.module.css";
import { useAuth } from "../context/AuthContext";
import { getUserPhotos } from "../firebase/userService";
// import { useBackground } from "../components/Backgroundprovider";

// Fotos padrão caso o usuário não tenha fotos próprias
const defaultGalleryPhotos: string[] = [
  "imagens/n1.jpg",
  "imagens/n2.jpg",
  "imagens/n3.jpg",
  "imagens/n14.jpg",
  "imagens/n13.jpg",
  "imagens/n6.webp",
  "imagens/n7.jpg",
  "imagens/n8.jpg",
  "imagens/n9.gif",
  "imagens/n10.jpg",
  "imagens/n11.jpg",
  "imagens/n12.jpg",
  "imagens/n5.jpg",
  "imagens/n4.jpg",
];

function Momentos() {
  const { currentUser } = useAuth();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<string[]>(defaultGalleryPhotos);

  // Carregar as fotos do usuário quando o componente montar
  useEffect(() => {
    async function loadUserPhotos() {
      // Se tiver usuário logado, tentamos carregar as fotos do usuário
      if (currentUser) {
        setLoading(true);
        try {
          const userPhotos = await getUserPhotos(currentUser.uid);
          // Se o usuário tiver fotos, usamos elas
          if (userPhotos.length > 0) {
            setPhotos(userPhotos.map(photo => photo.url));
          } else {
            // Se não tiver fotos, usamos as fotos padrão
            setPhotos(defaultGalleryPhotos);
          }
        } catch (error) {
          console.error('Erro ao carregar fotos do usuário:', error);
          setPhotos(defaultGalleryPhotos);
        } finally {
          setLoading(false);
        }
      } else {
        // Se não tem usuário logado, usa as fotos padrão sem mostrar mensagem de loading
        setPhotos(defaultGalleryPhotos);
        setLoading(false);
      }
    }

    loadUserPhotos();
  }, [currentUser]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // New state for settings modal

  // Pegando setBackgroundImage e resetBackground do contexto
  // const { setBackgroundImage, resetBackground } = useBackground();

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setIsSettingsOpen(false); // Ensure settings are closed when opening lightbox
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setIsSettingsOpen(false); // Always close settings when closing lightbox
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % defaultGalleryPhotos.length);
    setIsSettingsOpen(false); // Close settings if navigating
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + photos.length) % photos.length
    );
    setIsSettingsOpen(false); // Close settings if navigating
  }, []);

  const handleLightboxClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // Only close lightbox if the click is on the main overlay and settings are not open
      if (e.target === e.currentTarget && !isSettingsOpen) {
        closeLightbox();
      }
    },
    [closeLightbox, isSettingsOpen]
  );

  // Function to open/close settings
  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  // Close settings specific callback for LightboxSettings component
  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  // --- Adicionando navegação por teclado ---
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return; // Só ativa se o lightbox estiver aberto

      if (isSettingsOpen) { // If settings are open, handle escape key only
        if (event.key === "Escape") {
          closeSettings();
        }
        return; // Don't process other keys if settings are open
      }

      switch (event.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, isSettingsOpen, nextImage, prevImage, closeLightbox, closeSettings]); // Dependencies for useEffect

  return (
    <>
      <Clouds />

      <div className={contentStyles.contentWrapper}>
        {loading ? (
          <div className={momentosStyles.loadingContainer}>
            <p>Carregando suas fotos...</p>
          </div>
        ) : (
          <>
            <div className={momentosStyles.profileLink}>
              <Link to="/profile" className={momentosStyles.profileButton}>
                Gerenciar Minhas Fotos
              </Link>
            </div>

            <div className={momentosStyles.container1}>
              {photos.length === 0 ? (
                <div className={momentosStyles.emptyPhotos}>
                  <p>Você ainda não tem fotos. Adicione suas fotos na página de perfil!</p>
                  <Link to="/profile" className={momentosStyles.addPhotosButton}>
                    Adicionar Fotos
                  </Link>
                </div>
              ) : (
                <div className={momentosStyles.imageContainer}>
                  {photos.map((photoUrl: string, index: number) => (
                    <div className={momentosStyles.block} key={index}>
                      <img
                        src={photoUrl}
                        alt={`Momento ${index + 1}`}
                        className={momentosStyles.thumbnail}
                        onClick={() => openLightbox(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isLightboxOpen && (
        <div
          className={`${momentosStyles.lightbox} ${momentosStyles.lightboxActive}`}
          onClick={handleLightboxClick}
        >
          <span className={momentosStyles.close} onClick={closeLightbox}>
            &times;
          </span>

          {/* Settings Button */}
          <button className={momentosStyles.settingsButton} onClick={toggleSettings}>
            <span className="material-icons">settings</span>
          </button>

          <button className={momentosStyles.prev} onClick={prevImage}>
            &#10094;
          </button>

          <div className={momentosStyles.lightboxContent}>
            <img
              className={momentosStyles.lightboxImg}
              src={defaultGalleryPhotos[currentIndex]}
              alt="Imagem ampliada"
            />
          </div>

          <button className={momentosStyles.next} onClick={nextImage}>
            &#10095;
          </button>

          {/* Render LightboxSettings conditionally */}
          {isSettingsOpen && (
            <LightboxSettings
              currentImageUrl={defaultGalleryPhotos[currentIndex]}
              onClose={closeSettings}
            />
          )}
        </div>
      )}

      <BotaoVoltar />
      <Footer />
    </>
  );
}

export default Momentos;