import React, { useState, useRef } from 'react';
import desejoStyles from '../styles/lagodosdesejos.module.css';
import contentStyles from "../styles/contentWrapper.module.css";
import Clouds from '../components/Clouds';
import BotaoVoltar from '../components/BotaoVoltar';
import Footer from '../components/Footer';

const LagodosDesejos: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const wishInputRef = useRef<HTMLInputElement>(null); // Ref para o input do desejo

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página

    setIsLoading(true); // Exibe o overlay da borboleta
    // O botão é automaticamente desabilitado quando isLoading é true no JSX

    // Simula o carregamento por 2.5 segundos
    setTimeout(() => {
      setIsLoading(false); // Esconde o overlay da borboleta
      setShowSuccessMessage(true); // Exibe a mensagem de sucesso

      // Opcional: Limpa o campo de input após o envio
      if (wishInputRef.current) {
        wishInputRef.current.value = '';
      }
    }, 2500);
  };

  const handleCloseMessage = () => {
    setShowSuccessMessage(false); // Esconde a mensagem de sucesso
  };

  return (
    <>

    <Clouds />

    <div className={contentStyles.contentWrapper}>
      <section className={desejoStyles["wish-section"]}>
        <div className={desejoStyles.container}>
          <div className={desejoStyles.wrapper}	>
            <div className={desejoStyles.inner}>
              <p className={desejoStyles.text}>
                <span>
                  Você encontrou um lago dos desejos encantado...<br />Faça um desejo!
                </span>
              </p>
              {/* <div className="image-divider">
                <img src="/imagens/divider.gif" alt="Divisor" />
              </div> */}
              <form onSubmit={handleSubmit} className={desejoStyles.form} method="post">
                <div className={desejoStyles.inner}>
                  <div className={desejoStyles.field} data-type="text">
                    <input
                      type="text"
                      name="whats-your-wish"
                      id="form-whats-your-wish"
                      placeholder="Qual é o seu desejo?"
                      maxLength={256}
                      required
                      ref={wishInputRef} // Atribui a ref ao input
                    />
                  </div>
                  <div className={desejoStyles.actions}>
                    <button type="submit" disabled={isLoading}>
                      Enviar
                    </button>
                  </div>
                </div>
                <input type="hidden" name="id" value="form" />
              </form>
              {/* <div className="image-divider">
                <img src="/imagens/divider.gif" alt="Divisor" />
              </div> */}
            </div>
          </div>
          {/* Overlay da borboleta controlado pelo estado `isLoading` */}
          {isLoading && (
            <div id="post-submit-loader-overlay" className={isLoading ? 'active' : ''}>
              <img src="/imagens/loader-image.gif" alt="Carregando..." />
            </div>
          )}
        </div>
        {/* Overlay da mensagem de sucesso controlado pelo estado `showSuccessMessage` */}
        {showSuccessMessage && (
          <div id={desejoStyles.loaderOverlay} className={showSuccessMessage ? '' : 'hidden'}>
            <div className={desejoStyles.successMessage}>
              <button className={desejoStyles.closeButton} onClick={handleCloseMessage}>
                x
              </button>
              <p>Seu desejo foi enviado!</p>
            </div>
          </div>
        )}
      </section>
    </div>

    <BotaoVoltar />

    <Footer />
    
    </>
  );
};

export default LagodosDesejos;