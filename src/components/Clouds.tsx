import styles from '../styles/style.module.css'; // Importa o arquivo CSS Module

function Clouds() {
  return (
    <div className={styles.clouds}> {/* Se você tiver uma classe 'clouds' no CSS Module */}
      <div className={`${styles.cloud} ${styles.cloud1}`}>
        <img src="/imagens/nuvem-100.png" alt="Nuvem 1" />
      </div>
      <div className={`${styles.cloud} ${styles.cloud2}`}>
        <img src="/imagens/nuvem-100.png" alt="Nuvem 2" />
      </div>
      <div className={`${styles.cloud} ${styles.cloud3}`}>
        <img src="/imagens/nuvem-100.png" alt="Nuvem 3" />
      </div>
      <div className={`${styles.cloud} ${styles.cloud4}`}>
        <img src="/imagens/nuvem-100.png" alt="Nuvem 4" />
      </div>
    </div>
  );
}

export default Clouds;