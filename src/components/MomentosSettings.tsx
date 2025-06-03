// src/components/LightboxSettings.tsx
import React from 'react';
import { useBackground } from "../components/Backgroundprovider";
import styles from "../styles/momentos.module.css"; // Reuse your existing styles

interface LightboxSettingsProps {
  currentImageUrl: string;
  onClose: () => void; // Function to close the settings overlay
}

const LightboxSettings: React.FC<LightboxSettingsProps> = ({ currentImageUrl, onClose }) => {
  const { setBackgroundImage, resetBackground } = useBackground();

  return (
    <div className={styles.lightboxSettingsOverlay}>
      <div className={styles.lightboxSettingsContent}>
        <h3>Opções</h3>
        <button
          className={styles.setBgButton}
          onClick={() => {
            setBackgroundImage(currentImageUrl);
            onClose(); // Close settings after setting background
          }}
        >
          Definir como plano de fundo
        </button>

        <button
          className={styles.resetBgButton}
          onClick={() => {
            resetBackground();
            onClose(); // Close settings after resetting background
          }}
        >
          Voltar ao fundo padrão
        </button>
        <button className={styles.closeSettingsButton} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default LightboxSettings;