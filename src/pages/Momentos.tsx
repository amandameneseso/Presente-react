import React, { useState } from "react";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import momentosStyles from "../styles/momentos.module.css";
import Footer from "../components/Footer";
import contentStyles from "../styles/contentWrapper.module.css";

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

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length
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

          {/* Botão anterior */}
          <button className={momentosStyles.prev} onClick={prevImage}>
            &#10094;
          </button>

          {/* Imagem */}
          <img
            className={momentosStyles.lightboxImg}
            src={galleryPhotos[currentIndex]}
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
