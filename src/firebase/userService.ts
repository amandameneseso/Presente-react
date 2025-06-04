// src/firebase/userService.ts
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';
import { User } from 'firebase/auth';

// Interface para as músicas do usuário
export interface UserSong {
  id?: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
}

// Interface para as fotos do usuário
export interface UserPhoto {
  id?: string;
  url: string;
  description?: string;
}

// Interface para os dados do usuário
export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photos?: UserPhoto[];
  songs?: UserSong[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Criar um documento para o usuário quando ele se registra
export async function createUserDocument(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserData = {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photos: [],
      songs: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(userRef, userData);
    return userData;
  }

  return userSnap.data() as UserData;
}

// Obter dados do usuário
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
}

// Atualizar dados do usuário
export async function updateUserData(userId: string, userData: Partial<UserData>) {
  try {
    const userRef = doc(db, 'users', userId);
    const updatedData = {
      ...userData,
      updatedAt: new Date()
    };
    await setDoc(userRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    return false;
  }
}

// Upload de foto para o Storage do Firebase
export async function uploadUserPhoto(userId: string, file: File, description?: string): Promise<UserPhoto | null> {
  try {
    // Criar um nome de arquivo único usando timestamp
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `users/${userId}/photos/${fileName}`);
    
    // Upload do arquivo
    await uploadBytes(storageRef, file);
    
    // Obter URL de download
    const downloadURL = await getDownloadURL(storageRef);
    
    // Criar documento para a foto no Firestore
    const photosCollectionRef = collection(db, 'users', userId, 'photos');
    const photoDoc = await addDoc(photosCollectionRef, {
      url: downloadURL,
      description: description || '',
      fileName: fileName,
      createdAt: new Date()
    });
    
    // Atualizar o array de fotos no documento do usuário
    const userPhoto: UserPhoto = {
      id: photoDoc.id,
      url: downloadURL,
      description: description
    };
    
    return userPhoto;
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    return null;
  }
}

// Obter todas as fotos do usuário
export async function getUserPhotos(userId: string): Promise<UserPhoto[]> {
  try {
    const photosCollectionRef = collection(db, 'users', userId, 'photos');
    const photosSnapshot = await getDocs(photosCollectionRef);
    
    const photos: UserPhoto[] = [];
    photosSnapshot.forEach(doc => {
      const data = doc.data();
      photos.push({
        id: doc.id,
        url: data.url,
        description: data.description
      });
    });
    
    return photos;
  } catch (error) {
    console.error('Erro ao obter fotos do usuário:', error);
    return [];
  }
}

// Excluir uma foto do usuário
export async function deleteUserPhoto(userId: string, photoId: string, fileName?: string) {
  try {
    // Excluir documento do Firestore
    const photoDocRef = doc(db, 'users', userId, 'photos', photoId);
    await deleteDoc(photoDocRef);
    
    // Se tiver o nome do arquivo, excluir também do Storage
    if (fileName) {
      const photoRef = ref(storage, `users/${userId}/photos/${fileName}`);
      await deleteObject(photoRef);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir foto:', error);
    return false;
  }
}

// Upload de música para o Storage do Firebase
export async function uploadUserSong(userId: string, file: File, songData: { title: string, artist: string, coverFile?: File }): Promise<UserSong | null> {
  try {
    // Criar um nome de arquivo único usando timestamp
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `users/${userId}/songs/${fileName}`);
    
    // Upload do arquivo de música
    await uploadBytes(storageRef, file);
    const songURL = await getDownloadURL(storageRef);
    
    // Upload da capa da música (se fornecida)
    let coverURL = '';
    if (songData.coverFile) {
      const coverFileName = `${timestamp}_cover_${songData.coverFile.name}`;
      const coverRef = ref(storage, `users/${userId}/covers/${coverFileName}`);
      await uploadBytes(coverRef, songData.coverFile);
      coverURL = await getDownloadURL(coverRef);
    }
    
    // Criar documento para a música no Firestore
    const songsCollectionRef = collection(db, 'users', userId, 'songs');
    const songDoc = await addDoc(songsCollectionRef, {
      title: songData.title,
      artist: songData.artist,
      url: songURL,
      coverUrl: coverURL,
      fileName: fileName,
      createdAt: new Date()
    });
    
    // Retornar a música criada
    const userSong: UserSong = {
      id: songDoc.id,
      title: songData.title,
      artist: songData.artist,
      url: songURL,
      coverUrl: coverURL
    };
    
    return userSong;
  } catch (error) {
    console.error('Erro ao fazer upload da música:', error);
    return null;
  }
}

// Obter todas as músicas do usuário
export async function getUserSongs(userId: string): Promise<UserSong[]> {
  try {
    const songsCollectionRef = collection(db, 'users', userId, 'songs');
    const songsSnapshot = await getDocs(songsCollectionRef);
    
    const songs: UserSong[] = [];
    songsSnapshot.forEach(doc => {
      const data = doc.data();
      songs.push({
        id: doc.id,
        title: data.title,
        artist: data.artist,
        url: data.url,
        coverUrl: data.coverUrl
      });
    });
    
    return songs;
  } catch (error) {
    console.error('Erro ao obter músicas do usuário:', error);
    return [];
  }
}

// Excluir uma música do usuário
export async function deleteUserSong(userId: string, songId: string, fileName?: string) {
  try {
    // Excluir documento do Firestore
    const songDocRef = doc(db, 'users', userId, 'songs', songId);
    await deleteDoc(songDocRef);
    
    // Se tiver o nome do arquivo, excluir também do Storage
    if (fileName) {
      const songRef = ref(storage, `users/${userId}/songs/${fileName}`);
      await deleteObject(songRef);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir música:', error);
    return false;
  }
}
