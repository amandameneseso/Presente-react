// src/pages/Profile.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Clouds from '../components/Clouds';
import BotaoVoltar from '../components/BotaoVoltar';
import Footer from '../components/Footer';
import contentStyles from '../styles/contentWrapper.module.css';
import styles from '../styles/profile.module.css';
import {
  getUserPhotos,
  getUserSongs,
  uploadUserPhoto,
  uploadUserSong,
  deleteUserPhoto,
  deleteUserSong,
  UserPhoto,
  UserSong
} from '../firebase/userService';

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'photos' | 'songs'>('photos');
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [songs, setSongs] = useState<UserSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const songInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');

  const loadUserData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      const userPhotos = await getUserPhotos(currentUser.uid);
      setPhotos(userPhotos);
      
      const userSongs = await getUserSongs(currentUser.uid);
      setSongs(userSongs);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser, loadUserData]);

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };
  
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;
    
    setUploading(true);
    
    try {
      await uploadUserPhoto(currentUser.uid, file);
      const updatedPhotos = await getUserPhotos(currentUser.uid);
      setPhotos(updatedPhotos);
      
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSongClick = () => {
    songInputRef.current?.click();
  };
  
  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };
  
  const handleSongSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const songFile = songInputRef.current?.files?.[0];
    const coverFile = coverInputRef.current?.files?.[0];
    
    if (!songFile || !currentUser) {
      alert('Selecione um arquivo de música.');
      return;
    }
    
    setUploading(true);
    
    try {
      await uploadUserSong(
        currentUser.uid,
        songFile,
        {
          title: songTitle || 'Música sem título',
          artist: songArtist || 'Artista desconhecido',
          coverFile: coverFile
        }
      );
      
      const updatedSongs = await getUserSongs(currentUser.uid);
      setSongs(updatedSongs);
      
      setSongTitle('');
      setSongArtist('');
      
      if (songInputRef.current) songInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';
    } catch (error) {
      console.error('Erro ao fazer upload da música:', error);
      alert('Erro ao fazer upload da música. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: UserPhoto) => {
    if (!currentUser || !photo.id) return;
    
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        await deleteUserPhoto(currentUser.uid, photo.id);
        setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photo.id));
      } catch (error) {
        console.error('Erro ao excluir foto:', error);
        alert('Erro ao excluir a foto. Tente novamente.');
      }
    }
  };
  
  const handleDeleteSong = async (song: UserSong) => {
    if (!currentUser || !song.id) return;
    
    if (confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        await deleteUserSong(currentUser.uid, song.id);
        setSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
      } catch (error) {
        console.error('Erro ao excluir música:', error);
        alert('Erro ao excluir a música. Tente novamente.');
      }
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <Clouds />
      
      <div className={contentStyles.contentWrapper}>
        {!currentUser ? (
          <div className={styles.noAuthMessage}>
            <h2>Acesso restrito</h2>
            <p>Esta é uma versão de demonstração sem login. Nesta página seria possível gerenciar fotos e músicas pessoais.</p>
            <p>No momento, você pode visualizar fotos e músicas padrão nas páginas de Momentos e Playlist.</p>
            <div className={styles.demoButtons}>
              <Link to="/momentos" className={styles.demoButton}>Ver Fotos</Link>
              <Link to="/playlist" className={styles.demoButton}>Ouvir Músicas</Link>
            </div>
          </div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <h1>Meu Perfil</h1>
              <p>Olá, {currentUser?.displayName || 'Usuário'}</p>
              <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
            </div>
            
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                Minhas Fotos
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'songs' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('songs')}
              >
                Minhas Músicas
              </button>
            </div>
            
            {activeTab === 'photos' && (
              <div className={styles.tabContent}>
                <div className={styles.uploadArea}>
                  <button 
                    className={styles.uploadButton} 
                    onClick={handlePhotoClick}
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Adicionar Nova Foto'}
                  </button>
                  <input 
                    type="file" 
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                
                {loading ? (
                  <div className={styles.loadingMessage}>Carregando suas fotos...</div>
                ) : (
                  <div className={styles.photosGrid}>
                    {photos.length === 0 ? (
                      <div className={styles.emptyMessage}>
                        Você ainda não adicionou nenhuma foto. Adicione sua primeira foto!
                      </div>
                    ) : (
                      photos.map((photo, index) => (
                        <div key={photo.id || index} className={styles.photoItem}>
                          <img src={photo.url} alt={photo.description || `Foto ${index + 1}`} />
                          <div className={styles.photoOverlay}>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => handleDeletePhoto(photo)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'songs' && (
              <div className={styles.tabContent}>
                <div className={styles.uploadForm}>
                  <h3>Adicionar Nova Música</h3>
                  <form onSubmit={handleSongSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="songTitle">Título da Música</label>
                      <input 
                        type="text" 
                        id="songTitle"
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="songArtist">Artista</label>
                      <input 
                        type="text" 
                        id="songArtist"
                        value={songArtist}
                        onChange={(e) => setSongArtist(e.target.value)}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Arquivo de Música</label>
                      <button 
                        type="button" 
                        className={styles.fileButton}
                        onClick={handleSongClick}
                      >
                        Selecionar Arquivo
                      </button>
                      <input 
                        type="file" 
                        ref={songInputRef}
                        accept="audio/*"
                        style={{ display: 'none' }}
                        required
                      />
                      <span className={styles.fileName}>
                        {songInputRef.current?.files?.[0]?.name || 'Nenhum arquivo selecionado'}
                      </span>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Capa da Música (opcional)</label>
                      <button 
                        type="button" 
                        className={styles.fileButton}
                        onClick={handleCoverClick}
                      >
                        Selecionar Capa
                      </button>
                      <input 
                        type="file" 
                        ref={coverInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <span className={styles.fileName}>
                        {coverInputRef.current?.files?.[0]?.name || 'Nenhuma capa selecionada'}
                      </span>
                    </div>
                    
                    <button 
                      type="submit" 
                      className={styles.submitButton}
                      disabled={uploading}
                    >
                      {uploading ? 'Enviando...' : 'Enviar Música'}
                    </button>
                  </form>
                </div>
                
                {loading ? (
                  <div className={styles.loadingMessage}>Carregando suas músicas...</div>
                ) : (
                  <div className={styles.songsList}>
                    <h3>Minhas Músicas</h3>
                    {songs.length === 0 ? (
                      <div className={styles.emptyMessage}>
                        Você ainda não adicionou nenhuma música. Adicione sua primeira música!
                      </div>
                    ) : (
                      <div className={styles.songsGrid}>
                        {songs.map((song, index) => (
                          <div key={song.id || index} className={styles.songItem}>
                            <div className={styles.songCover}>
                              {song.coverUrl ? (
                                <img src={song.coverUrl} alt={`Capa de ${song.title}`} />
                              ) : (
                                <div className={styles.defaultCover}>
                                  <span>{song.title.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className={styles.songInfo}>
                              <h4>{song.title}</h4>
                              <p>{song.artist}</p>
                            </div>
                            <div className={styles.songActions}>
                              <audio src={song.url} controls />
                              <button 
                                className={styles.deleteButton}
                                onClick={() => handleDeleteSong(song)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <BotaoVoltar />
      <Footer />
    </div>
  );
}

export default Profile;
