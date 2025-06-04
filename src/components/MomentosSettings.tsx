import React from "react";
import { useBackground } from "../components/Backgroundprovider";
import styles from "../styles/momentos.module.css";

interface LightboxSettingsProps {
  currentImageUrl: string;
  onClose: () => void;
}

const LightboxSettings: React.FC<LightboxSettingsProps> = ({ currentImageUrl, onClose }) => {
  const { backgroundImage, setBackgroundImage, resetBackground } = useBackground();
  const isActive = backgroundImage === currentImageUrl;

  const toggleBackground = () => {
    if (isActive) {
      resetBackground();
    } else {
      setBackgroundImage(currentImageUrl);
    }
  };

  return (
    <div className={styles.lightboxSettingsOverlay}>
      <div className={styles.lightboxSettingsContent}>
        <h3>Opções</h3>

        <label className={styles.toggleWrapper}>
          <span>Definir como plano de fundo</span>
          <div className={styles.toggleContainer}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={toggleBackground}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
          </div>
        </label>

        <button className={styles.closeSettingsButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default LightboxSettings;
