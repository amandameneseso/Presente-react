// src/pages/Carta.tsx
import React, { useState } from 'react';
import Clouds from '../components/Clouds';
import BotaoVoltar from '../components/BotaoVoltar';
import Footer from '../components/Footer';
import '../styles/carta.css';

const Carta: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleValentinesClick = () => {
    setIsCardOpen(!isCardOpen);
  };

  const valentinesAnimation = isCardOpen ? 'none' : 'up 3s linear infinite';

  return (
    <>
      <Clouds />

      <div className="container2">
        <div
          className="valentines"
          onClick={handleValentinesClick}
          style={{ animation: valentinesAnimation }} // Apply animation dynamically
        >
          <div className="envelope">
            <div className={`card ${isCardOpen ? 'open' : ''}`}>
              <div className="text">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet
                consecte, adipisicing elit. Animi aperiam, necessita tibus dicta
                nulla tempora unde dolorem voluptatibus tenetur, magni quis
                ratione! Quas pariatur laboriosam exercitationem praesentium nisi
                minus assumenda nam. <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet
                consecte tur, adipisicing elit. Voluptatem quis rerum porro libero
                iure recusandae est sunt sed eum distinctio magnam quaerat, dicta
                repudiandae. Enim magni adipisci odio libero illo?
              </div>
            </div>
          </div>
          <div className="heart"></div>
          <div className="front"></div>
        </div>
      </div>

      <BotaoVoltar />

      <Footer />
    </>
  );
};

export default Carta;