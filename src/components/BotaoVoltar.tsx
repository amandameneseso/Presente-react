import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/style.module.css'; // Importa o arquivo CSS Module
import homeStyles from '../styles/home.module.css';

const BotaoVoltar: React.FC = () => {
  return (
    <div className={styles.divDoBotao} style={{ position: 'fixed' }}>
      <Link to="/home">
        <img
          src="imagens/tecla-de-seta-para-a-esquerda-64.png"
          className={homeStyles.icone}
          alt="Voltar"
        />
      </Link>
    </div>
  );
};

export default BotaoVoltar;