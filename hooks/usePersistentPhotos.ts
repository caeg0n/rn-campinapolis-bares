// hooks/usePersistentPhotos.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const TAKEN_PHOTOS_STORAGE_KEY = "taken_photos";
const MAX_PHOTOS = 50; // Limite máximo de fotos para evitar uso excessivo de memória

export const usePersistentPhotos = () => {
  const [takenPhotos, setTakenPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar fotos do AsyncStorage
  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const photosData = await AsyncStorage.getItem(TAKEN_PHOTOS_STORAGE_KEY);
      if (photosData) {
        const parsedPhotos = JSON.parse(photosData);
        setTakenPhotos(parsedPhotos);
      }
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar fotos:", err);
      setError("Erro ao carregar fotos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar fotos no AsyncStorage
  const savePhotos = useCallback(async (photos: string[]) => {
    try {
      // Limitar o número de fotos para evitar uso excessivo de memória
      const limitedPhotos = photos.slice(-MAX_PHOTOS);
      await AsyncStorage.setItem(TAKEN_PHOTOS_STORAGE_KEY, JSON.stringify(limitedPhotos));
      setError(null);
    } catch (err) {
      console.error("Erro ao salvar fotos:", err);
      setError("Erro ao salvar fotos");
    }
  }, []);

  // Adicionar uma nova foto
  const addPhoto = useCallback(async (photoUri: string) => {
    setTakenPhotos(prev => {
      // Evitar duplicatas
      if (!prev.includes(photoUri)) {
        const newPhotos = [...prev, photoUri];
        savePhotos(newPhotos);
        return newPhotos;
      }
      return prev;
    });
  }, [savePhotos]);

  // Remover uma foto específica
  const removePhoto = useCallback(async (photoUri: string) => {
    setTakenPhotos(prev => {
      const newPhotos = prev.filter(photo => photo !== photoUri);
      savePhotos(newPhotos);
      return newPhotos;
    });
  }, [savePhotos]);

  // Limpar todas as fotos
  const clearAllPhotos = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TAKEN_PHOTOS_STORAGE_KEY);
      setTakenPhotos([]);
      setError(null);
    } catch (err) {
      console.error("Erro ao limpar fotos:", err);
      setError("Erro ao limpar fotos");
    }
  }, []);

  // Obter estatísticas das fotos
  const getPhotoStats = useCallback(() => {
    const totalPhotos = takenPhotos.length;
    const totalSize = takenPhotos.reduce((size, photo) => {
      // Estimar tamanho do base64 (aprox. 4/3 do tamanho real)
      return size + (photo.length * 0.75);
    }, 0);
    
    return {
      totalPhotos,
      totalSizeKB: Math.round(totalSize / 1024),
      maxPhotos: MAX_PHOTOS,
    };
  }, [takenPhotos]);

  // Carregar fotos na inicialização
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return {
    takenPhotos,
    isLoading,
    error,
    addPhoto,
    removePhoto,
    clearAllPhotos,
    getPhotoStats,
    reloadPhotos: loadPhotos,
  };
};