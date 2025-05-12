import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { COLORS } from '../app/styles';
import { Product } from '../types';
import { formatCurrency, handleCurrencyInput, parseCurrency } from '../utils/currencyMask';

interface Props {
  visible: boolean;
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductFormModal({ 
  visible, 
  products, 
  onSave, 
  onDelete,
  onCancel 
}: Props) {
  const [name, setName] = useState('');
  const [priceInput, setPriceInput] = useState('R$ ');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Ordena a lista de produtos alfabeticamente (A-Z)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const handleSave = () => {
    if (!name || priceInput === 'R$ ') return;
    
    // Converte o valor do input para número
    const priceValue = parseCurrency(priceInput);
    
    if (priceValue <= 0) return;
    
    const product: Product = {
      name,
      price: priceValue
    };
    
    onSave(product);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setPriceInput('R$ ');
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setName(product.name);
    setPriceInput(formatCurrency(product.price));
    setEditingProduct(product);
  };

  const handleDelete = (product: Product) => {
    onDelete(product);
    if (editingProduct && editingProduct.name === product.name) {
      resetForm();
    }
  };

  const handlePriceChange = (text: string) => {
    setPriceInput(handleCurrencyInput(text));
  };

  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Gerenciar Produtos</Text>
        
        <View style={localStyles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Produto"
            placeholderTextColor={COLORS.disabled}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Preço"
            placeholderTextColor={COLORS.disabled}
            keyboardType="numeric"
            value={priceInput}
            onChangeText={handlePriceChange}
          />
          
          <TouchableOpacity 
            style={[
              styles.btn,
              (!name || priceInput === 'R$ ') && localStyles.disabledButton
            ]} 
            onPress={handleSave}
            disabled={!name || priceInput === 'R$ '}
          >
            <Text style={styles.btnText}>
              {editingProduct ? 'ATUALIZAR' : 'ADICIONAR'} PRODUTO
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.divider} />
        
        <View style={localStyles.listHeader}>
          <Text style={localStyles.listTitle}>Lista de Produtos:</Text>
          <Text style={localStyles.sortLabel}>Ordenados A-Z</Text>
        </View>
        
        <FlatList
          data={sortedProducts}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={localStyles.productItem}>
              <TouchableOpacity 
                style={localStyles.productInfo}
                onPress={() => startEdit(item)}
              >
                <Text style={localStyles.productName}>{item.name}</Text>
                <Text style={localStyles.productPrice}>{formatCurrency(item.price)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={localStyles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Icon name="delete" size={22} color="#FF5555" />
              </TouchableOpacity>
            </View>
          )}
          style={localStyles.productList}
        />
        
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>FECHAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const localStyles = StyleSheet.create({
  formContainer: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sortLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  productList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.disabled,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});