import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Usado para link para a página de perfil
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import momentosStyles from "../styles/momentos.module.css";
import Footer from "../components/Footer";
import contentStyles from "../styles/contentWrapper.module.css";
import { useAuth } from "../context/AuthContext";
import { getUserPhotos } from "../firebase/userService";

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

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + photos.length) % photos.length
    );
  };

  const handleLightboxClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

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

          {/* Botão anterior */}
          <button className={momentosStyles.prev} onClick={prevImage}>
            &#10094;
          </button>

          {/* Imagem */}
          <img
            className={momentosStyles.lightboxImg}
            src={photos[currentIndex]}
            alt="Imagem ampliada"
          />

          {/* Botão próximo */}
          <button className={momentosStyles.next} onClick={nextImage}>
            &#10095;
          </button>
        </div>
      )}

      <BotaoVoltar />
      <Footer />
    </>
  );
}

export default Momentos;
