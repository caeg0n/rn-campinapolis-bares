import { useCallback, useState } from 'react';

interface ModalState {
  config: boolean;
  edit: boolean;
  person: boolean;
  product: boolean;
  productForm: boolean;
  billing: boolean;
  assign: boolean;
  resetTable: boolean;
  saveHistory: boolean;
  history: boolean;
  syncMenu: boolean;
}

export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({
    config: false,
    edit: false,
    person: false,
    product: false,
    productForm: false,
    billing: false,
    assign: false,
    resetTable: false,
    saveHistory: false,
    history: false,
    syncMenu: false,
  });

  const openModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      config: false,
      edit: false,
      person: false,
      product: false,
      productForm: false,
      billing: false,
      assign: false,
      resetTable: false,
      saveHistory: false,
      history: false,
      syncMenu: false,
    });
  }, []);

  return {
    ...modals,
    openModal,
    closeModal,
    closeAllModals,
  };
};