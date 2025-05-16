// import { useCallback, useState } from 'react';
// import { Person } from '../types';
// import { generateRandomAvatar } from '../utils/tableUtils';

// export const usePersonForm = () => {
//   const [newPersonName, setNewPersonName] = useState("");
//   const [newPersonAvatar, setNewPersonAvatar] = useState("");
//   const [customAvatar, setCustomAvatar] = useState<string | null>(null);

//   const resetForm = useCallback(() => {
//     setNewPersonName("");
//     setNewPersonAvatar(generateRandomAvatar());
//     setCustomAvatar(null);
//   }, []);

//   const handlePhotoTaken = useCallback((base64Image: string) => {
//     setCustomAvatar(base64Image);
//   }, []);

//   const createPerson = useCallback((): Person | null => {
//     if (!newPersonName) return null;
    
//     const avatarToUse = customAvatar || newPersonAvatar;
    
//     return {
//       name: newPersonName,
//       avatar: avatarToUse,
//       bill: 0.0,
//       orders: [],
//       paid: false,
//     };
//   }, [newPersonName, customAvatar, newPersonAvatar]);

//   return {
//     newPersonName,
//     setNewPersonName,
//     newPersonAvatar,
//     setNewPersonAvatar,
//     customAvatar,
//     resetForm,
//     handlePhotoTaken,
//     createPerson,
//   };
// };
import { useCallback, useState } from 'react';
import { Person } from '../types';
import { generateRandomAvatar } from '../utils/tableUtils';

export const usePersonForm = () => {
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonAvatar, setNewPersonAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setNewPersonName("");
    setNewPersonAvatar(generateRandomAvatar());
    setCustomAvatar(null);
  }, []);

  const handlePhotoTaken = useCallback((base64Image: string) => {
    setCustomAvatar(base64Image);
  }, []);

  const createPerson = useCallback((): Person | null => {
    if (!newPersonName) return null;
    
    const avatarToUse = customAvatar || newPersonAvatar;
    
    return {
      name: newPersonName,
      avatar: avatarToUse,
      bill: 0.0,
      orders: [],
      paid: false,
    };
  }, [newPersonName, customAvatar, newPersonAvatar]);

  return {
    newPersonName,
    setNewPersonName,
    newPersonAvatar,
    setNewPersonAvatar,
    customAvatar,
    resetForm,
    handlePhotoTaken,
    createPerson,
  };
};