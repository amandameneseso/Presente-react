import { db, storage } from "./config";
import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Interface para o presente compartilhado
export interface SharedGift {
  id: string;
  creatorId: string;
  createdAt: number;
  title: string;
  isActive: boolean;
  photos: {
    id: string;
    url: string;
    caption?: string;
  }[];
  songs: {
    id: string;
    title: string;
    artist?: string;
    url: string;
    coverUrl?: string;
  }[];
}

// Gera um ID único para o presente compartilhado (mais curto que UUID padrão)
export const generateShortId = (): string => {
  const fullUuid = uuidv4();
  // Usar apenas os primeiros 12 caracteres do UUID para tornar a URL mais amigável
  return fullUuid.replace(/-/g, "").substring(0, 12);
};

// Criar um novo presente compartilhado
export const createSharedGift = async (
  userId: string,
  title: string,
  photos: any[],
  songs: any[]
): Promise<string> => {
  try {
    const giftId = generateShortId();
    
    const sharedGift: SharedGift = {
      id: giftId,
      creatorId: userId,
      createdAt: Date.now(),
      title,
      isActive: true,
      photos,
      songs
    };
    
    // Salvar no Firestore na coleção sharedGifts
    await setDoc(doc(db, "sharedGifts", giftId), sharedGift);
    
    return giftId;
  } catch (error) {
    console.error("Erro ao criar presente compartilhado:", error);
    throw error;
  }
};

// Buscar um presente compartilhado pelo ID
export const getSharedGift = async (giftId: string): Promise<SharedGift | null> => {
  try {
    const giftDoc = await getDoc(doc(db, "sharedGifts", giftId));
    
    if (giftDoc.exists() && giftDoc.data().isActive) {
      return giftDoc.data() as SharedGift;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao buscar presente compartilhado:", error);
    return null;
  }
};

// Desativar um presente compartilhado
export const deactivateSharedGift = async (giftId: string, userId: string): Promise<boolean> => {
  try {
    const giftDoc = await getDoc(doc(db, "sharedGifts", giftId));
    
    if (giftDoc.exists() && giftDoc.data().creatorId === userId) {
      await setDoc(
        doc(db, "sharedGifts", giftId),
        { isActive: false },
        { merge: true }
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erro ao desativar presente compartilhado:", error);
    return false;
  }
};

// Listar todos os presentes compartilhados de um usuário
export const getUserSharedGifts = async (userId: string): Promise<SharedGift[]> => {
  try {
    const q = query(
      collection(db, "sharedGifts"),
      where("creatorId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const gifts: SharedGift[] = [];
    
    querySnapshot.forEach((doc) => {
      gifts.push(doc.data() as SharedGift);
    });
    
    return gifts;
  } catch (error) {
    console.error("Erro ao listar presentes compartilhados:", error);
    return [];
  }
};
