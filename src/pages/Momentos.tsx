import React, { useState, useEffect, useCallback } from "react";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import LightboxSettings from "../components/MomentosSettings"; // Import the new component
import momentosStyles from "../styles/momentos.module.css";
import contentStyles from "../styles/contentWrapper.module.css";
// import { useBackground } from "../components/Backgroundprovider";

const galleryPhotos: string[] = [
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    setCurrentIndex((prev) => (prev + 1) % galleryPhotos.length);
    setIsSettingsOpen(false); // Close settings if navigating
  }, []);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length
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
    <div>
      <Clouds />

      <div className={contentStyles.contentWrapper}>
        <div className={momentosStyles.container1}>
          <div className={momentosStyles.imageContainer}>
            {galleryPhotos.map((photoUrl, index) => (
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
        </div>
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
              src={galleryPhotos[currentIndex]}
              alt="Imagem ampliada"
            />
            {/* These buttons are now moved to LightboxSettings.tsx */}
            {/*
            <button
              className={momentosStyles.setBgButton}
              onClick={() => {
                setBackgroundImage(galleryPhotos[currentIndex]);
                closeLightbox();
              }}
            >
              Definir como plano de fundo
            </button>

            <button
              className={momentosStyles.resetBgButton}
              onClick={() => {
                resetBackground();
                closeLightbox();
              }}
              style={{ marginTop: "10px" }}
            >
              Voltar ao fundo padrão
            </button>
            */}
          </div>

          <button className={momentosStyles.next} onClick={nextImage}>
            &#10095;
          </button>

          {/* Render LightboxSettings conditionally */}
          {isSettingsOpen && (
            <LightboxSettings
              currentImageUrl={galleryPhotos[currentIndex]}
              onClose={closeSettings}
            />
          )}
        </div>
      )}

      <BotaoVoltar />
      <Footer />
    </div>
  );
}

export default Momentos;