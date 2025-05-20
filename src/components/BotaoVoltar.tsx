import React from 'react';
import { Link } from 'react-router-dom';

const BotaoVoltar: React.FC = () => {
  return (
    <div className="divDoBotao" style={{ position: 'fixed' }}>
      <Link to="/home">
        <img
          src="imagens/tecla-de-seta-para-a-esquerda-64.png"
          className="icone"
          alt="Voltar"
        />
      </Link>
    </div>
  );
};

export default BotaoVoltar;