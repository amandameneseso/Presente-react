// src/pages/Carta.tsx
import React, { useState } from "react";
import Clouds from "../components/Clouds";
import BotaoVoltar from "../components/BotaoVoltar";
import Footer from "../components/Footer";
import cartaStyles from "../styles/carta.module.css";
import contentStyles from "../styles/contentWrapper.module.css";

const Carta: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleValentinesClick = () => {
    setIsCardOpen(!isCardOpen);
  };

  return (
    <>
      <Clouds />

      <div className={contentStyles.contentWrapper}>
        <div className={cartaStyles.container2}>
          <div
            className={`${cartaStyles.valentines} ${!isCardOpen ? cartaStyles.animateUp : ""}`}
            onClick={handleValentinesClick}
          >
            <div className={cartaStyles.envelope}>
              <div
                className={`${cartaStyles.card} ${isCardOpen ? cartaStyles.open : ""}`}
              >
                <div className={cartaStyles.text}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet
                  consecte, adipisicing elit. Animi aperiam, necessita tibus
                  dicta nulla tempora unde dolorem voluptatibus tenetur, magni
                  quis ratione! Quas pariatur laboriosam exercitationem
                  praesentium nisi minus assumenda nam. <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet
                  consecte tur, adipisicing elit. Voluptatem quis rerum porro
                  libero iure recusandae est sunt sed eum distinctio magnam
                  quaerat, dicta repudiandae. Enim magni adipisci odio libero
                  illo?
                </div>
              </div>
            </div>
            <div className={cartaStyles.heart}></div>
            <div className={cartaStyles.front}></div>
          </div>
        </div>
      </div>

      <BotaoVoltar />

      <Footer />
    </>
  );
};

export default Carta;
