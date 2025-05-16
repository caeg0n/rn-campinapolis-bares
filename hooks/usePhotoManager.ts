import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { TAKEN_PHOTOS_STORAGE_KEY } from '../constants';

export const usePhotoManager = () => {
  const [takenPhotos, setTakenPhotos] = useState<string[]>([]);

  useEffect(() => {
    const loadTakenPhotos = async () => {
      try {
        const photosData = await AsyncStorage.getItem(TAKEN_PHOTOS_STORAGE_KEY);
        if (photosData) {
          const parsedPhotos = JSON.parse(photosData);
          setTakenPhotos(parsedPhotos);
        }
      } catch (error) {
        console.error("Erro ao carregar fotos:", error);
      }
    };
    loadTakenPhotos();
  }, []);

  const saveTakenPhotosToStorage = async (photos: string[]) => {
    try {
      await AsyncStorage.setItem(TAKEN_PHOTOS_STORAGE_KEY, JSON.stringify(photos));
    } catch (error) {
      console.error("Erro ao salvar fotos:", error);
    }
  };

  const addPhoto = useCallback((base64Image: string) => {
    setTakenPhotos(prev => {
      const newPhotos = [...prev];
      if (!newPhotos.includes(base64Image)) {
        newPhotos.push(base64Image);
        saveTakenPhotosToStorage(newPhotos);
      }
      return newPhotos;
    });
  }, []);

  return {
    takenPhotos,
    addPhoto,
  };
};