// /components/ProductModal.tsx
import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import styles, { COLORS } from '../app/styles';
import { Product } from '../types';
import { formatCurrency } from '../utils/currencyMask';

interface Props {
  visible: boolean;
  products: Product[];
  onSelect: (p: Product) => void;
  onCancel: () => void;
}

export default function ProductModal({ visible, products, onSelect, onCancel }: Props) {
  // Ordena a lista de produtos alfabeticamente (A-Z)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Adicionar Bebidas</Text>
        <FlatList
          data={sortedProducts}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardPrice}>{formatCurrency(item.price)}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: 8, gap: 12 }}
        />
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}