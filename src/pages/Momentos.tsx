import React, { useState } from "react";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import "../styles/momentos.css";
import Footer from "../components/Footer";
import '../styles/contentWrapper.css'

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
  // Estado para gerenciar o Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");

  // Manipuladores de Evento do Lightbox
  const openLightbox = (imageUrl: string) => {
    setLightboxImageUrl(imageUrl);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImageUrl("");
  };

  const handleLightboxClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Se o clique foi no background do lightbox (não na imagem)
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <>
      <Clouds />

      <div className="content-wrapper">
        <div className="container1">
          <div className="image-container">
            {galleryPhotos.map((photoUrl, index) => (
              <div className="block" key={index}>
                <img
                  src={photoUrl}
                  alt={`Momento ${index + 1}`}
                  className="thumbnail"
                  onClick={() => openLightbox(photoUrl)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox - Renderizado condicionalmente */}
      {isLightboxOpen && (
        <div
          className={`lightbox ${isLightboxOpen ? "active" : ""}`}
          onClick={handleLightboxClick}
        >
          <span className="close" onClick={closeLightbox}>
            &times;
          </span>
          <img
            className="lightbox-img"
            src={lightboxImageUrl}
            alt="Imagem ampliada"
          />
        </div>
      )}

      <BotaoVoltar />

      <Footer />
    </>
  );
}

export default Momentos;
