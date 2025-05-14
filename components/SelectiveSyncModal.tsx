// components/SelectiveSyncModal.tsx - Clean version with separated styles
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNModal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { SelectiveSyncModalStyles as styles } from '../styles/SelectiveSyncModalStyles';
import { Person, Table } from '../types';
import { JSONCompressor } from '../utils/compressionPako';
import { formatCurrency } from '../utils/currencyMask';

interface SelectiveSyncModalProps {
  visible: boolean;
  onClose: () => void;
  tables: Table[];
  onRemoveProduct: (tableId: number, personIndex: number, orderIndices: number[]) => void;
}

type SyncStep = 'choose_table' | 'choose_person' | 'choose_products' | 'show_qr' | 'receive';

export default function SelectiveSyncModal({
  visible,
  onClose,
  tables,
  onRemoveProduct
}: SelectiveSyncModalProps) {
  const [currentStep, setCurrentStep] = useState<SyncStep>('choose_table');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number>(-1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [qrData, setQrData] = useState('');
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

  // Get enabled tables
  const enabledTables = tables.filter(table => table.enabled);

  // Reset all selections when modal closes
  const resetSelections = () => {
    setCurrentStep('choose_table');
    setSelectedTable(null);
    setSelectedPerson(null);
    setSelectedPersonIndex(-1);
    setSelectedProducts([]);
    setQrData('');
    setIsConfirmingRemoval(false);
  };

  const handleClose = () => {
    resetSelections();
    onClose();
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCurrentStep('choose_person');
  };

  const handlePersonSelect = (person: Person, personIndex: number) => {
    // Only allow selection of unpaid people
    if (person.paid) {
      Alert.alert('Pessoa já paga', 'Esta pessoa já pagou sua conta. Não é possível sincronizar.');
      return;
    }
    
    setSelectedPerson(person);
    setSelectedPersonIndex(personIndex);
    
    // Filter only unpaid orders
    const unpaidOrders = person.orders || [];
    if (unpaidOrders.length === 0) {
      Alert.alert('Sem pedidos', 'Esta pessoa não tem pedidos para sincronizar.');
      return;
    }
    
    setCurrentStep('choose_products');
  };

  const toggleProductSelection = (orderIndex: number) => {
    setSelectedProducts(prev => 
      prev.includes(orderIndex) 
        ? prev.filter(i => i !== orderIndex)
        : [...prev, orderIndex]
    );
  };

  const generateQRCode = () => {
    if (!selectedTable || !selectedPerson || selectedProducts.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um produto para sincronizar.');
      return;
    }

    // Create sync data
    const syncData = {
      type: 'PERSON_ORDERS',
      table: {
        number: selectedTable.number,
        name: selectedTable.name
      },
      person: {
        name: selectedPerson.name,
        // Don't include avatar for smaller QR codes
      },
      orders: selectedProducts.map(orderIndex => selectedPerson.orders[orderIndex])
    };

    // Compress the data
    const compressedData = JSONCompressor.compressJSON(JSON.stringify(syncData));
    const finalData = `SYNC:${compressedData}`;
    
    setQrData(finalData);
    setCurrentStep('show_qr');
  };

  const getTotalAmount = () => {
    if (!selectedPerson) return 0;
    return selectedProducts.reduce((sum, orderIndex) => {
      const order = selectedPerson.orders[orderIndex];
      return sum + (order.product.price * order.quantity);
    }, 0);
  };

  const confirmRemovalAfterSync = () => {
    if (!selectedTable || !selectedPerson || selectedProducts.length === 0) return;
    
    const productNames = selectedProducts
      .map(orderIndex => {
        const order = selectedPerson.orders[orderIndex];
        return `• ${order.quantity}x ${order.product.name}`;
      })
      .join('\n');
    
    const totalValue = getTotalAmount();
    
    Alert.alert(
      "QR Code foi escaneado?",
      `Os seguintes produtos serão removidos da conta de ${selectedPerson.name}:\n\n${productNames}\n\nTotal: ${formatCurrency(totalValue)}\n\nConfirma que o QR Code foi lido com sucesso e deseja remover esses produtos?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setIsConfirmingRemoval(false)
        },
        {
          text: "Confirmar Remoção",
          style: "destructive",
          onPress: () => {
            // Remove the products
            onRemoveProduct(selectedTable.id, selectedPersonIndex, selectedProducts);
            
            Alert.alert(
              "Produtos Removidos",
              `Os produtos foram removidos da conta de ${selectedPerson.name}.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    resetSelections();
                    onClose();
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  // Render different steps
  if (currentStep === 'choose_table') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>SINCRONIZAÇÃO</Text>
          <Text style={styles.stepTitle}>1. Escolher Mesa</Text>
          
          {enabledTables.length === 0 ? (
            <Text style={styles.emptyMessage}>Nenhuma mesa ativa encontrada.</Text>
          ) : (
            <FlatList
              data={enabledTables}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.tableButton}
                  onPress={() => handleTableSelect(item)}
                >
                  <View style={styles.tableInfo}>
                    <Text style={styles.tableNumber}>Mesa {item.number}</Text>
                    {item.name && (
                      <Text style={styles.tableName}>{item.name}</Text>
                    )}
                    <Text style={styles.tablePeople}>
                      {item.people.filter(p => !p.paid).length} pessoa(s) não paga(s)
                    </Text>
                  </View>
                  <Icon name="arrow-forward" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.receiveButton} onPress={() => setCurrentStep('receive')}>
              <Icon name="qr-code-scanner" size={24} color={COLORS.primary} />
              <Text style={styles.receiveButtonText}>RECEBER</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  if (currentStep === 'choose_person') {
    const unpaidPeople = selectedTable?.people.filter(person => !person.paid) || [];
    
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Mesa {selectedTable?.number}</Text>
          <Text style={styles.stepTitle}>2. Escolher Cliente</Text>
          
          {unpaidPeople.length === 0 ? (
            <Text style={styles.emptyMessage}>Todos os clientes desta mesa já pagaram.</Text>
          ) : (
            <FlatList
              data={unpaidPeople}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const originalIndex = selectedTable!.people.findIndex(p => p === item);
                return (
                  <TouchableOpacity 
                    style={styles.personButton}
                    onPress={() => handlePersonSelect(item, originalIndex)}
                  >
                    <View style={styles.personInfo}>
                      <Image source={{ uri: item.avatar }} style={styles.personAvatar} />
                      <View style={styles.personDetails}>
                        <Text style={styles.personName}>{item.name}</Text>
                        <Text style={styles.personTotal}>
                          Total: {formatCurrency(item.bill)}
                        </Text>
                        <Text style={styles.personOrders}>
                          {item.orders?.length || 0} produto(s)
                        </Text>
                      </View>
                    </View>
                    <Icon name="arrow-forward" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                );
              }}
            />
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setCurrentStep('choose_table')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={styles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  if (currentStep === 'choose_products') {
    const orders = selectedPerson?.orders || [];
    
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cliente: {selectedPerson?.name}</Text>
          <Text style={styles.stepTitle}>3. Escolher Produtos</Text>
          
          {orders.length === 0 ? (
            <Text style={styles.emptyMessage}>Este cliente não tem produtos.</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  style={[
                    styles.productButton,
                    selectedProducts.includes(index) && styles.selectedProduct
                  ]}
                  onPress={() => toggleProductSelection(index)}
                >
                  <View style={styles.productInfo}>
                    <Text style={styles.productQuantity}>{item.quantity}x</Text>
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <Text style={styles.productPrice}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </Text>
                  </View>
                  <Icon 
                    name={selectedProducts.includes(index) ? "check-box" : "check-box-outline-blank"}
                    size={24} 
                    color={COLORS.primary} 
                  />
                </TouchableOpacity>
              )}
            />
          )}
          
          {selectedProducts.length > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total selecionado: {formatCurrency(getTotalAmount())}
              </Text>
            </View>
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setCurrentStep('choose_person')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={styles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.generateButton,
                selectedProducts.length === 0 && styles.disabledButton
              ]}
              onPress={generateQRCode}
              disabled={selectedProducts.length === 0}
            >
              <Icon name="qr-code" size={24} color="black" />
              <Text style={styles.generateButtonText}>GERAR QR CODE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  if (currentStep === 'show_qr') {
    const dataSize = qrData.length;
    
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.9}>
        <View style={styles.qrModalContainer}>
          <Text style={styles.qrTitle}>QR Code - Cliente Específico</Text>
          <Text style={styles.qrSubtitle}>
            Mesa {selectedTable?.number} - {selectedPerson?.name}
          </Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={250}
              color="black"
              backgroundColor="white"
            />
          </View>
          
          <View style={styles.qrInfoContainer}>
            <Text style={styles.qrInfoText}>
              📦 {selectedProducts.length} produto(s) selecionado(s)
            </Text>
            <Text style={styles.qrInfoText}>
              💰 Total: {formatCurrency(getTotalAmount())}
            </Text>
          </View>
          
          <View style={styles.qrButtonsContainer}>
            <TouchableOpacity 
              style={styles.confirmRemovalButton}
              onPress={() => setIsConfirmingRemoval(true)}
            >
              <Icon name="sync" size={24} color="black" />
              <Text style={styles.confirmRemovalButtonText}>QR LIDO - CONFIRMAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backToProductsButton}
              onPress={() => setCurrentStep('choose_products')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={styles.backToProductsButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
          
          {/* Confirmation Modal for Product Removal */}
          {isConfirmingRemoval && (
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmModal}>
                <Icon name="warning" size={60} color="#FFA500" />
                <Text style={styles.confirmTitle}>Confirmar Remoção</Text>
                <Text style={styles.confirmMessage}>
                  Antes de remover os produtos, certifique-se de que o QR Code foi escaneado e lido com sucesso pelo dispositivo receptor.
                </Text>
                <Text style={styles.confirmInstruction}>
                  Clique em &quot;CONFIRMAR REMOÇÃO&quot; apenas após verificar que os dados foram transferidos.
                </Text>
                
                <View style={styles.confirmButtons}>
                  <TouchableOpacity 
                    style={styles.cancelConfirmButton}
                    onPress={() => setIsConfirmingRemoval(false)}
                  >
                    <Text style={styles.cancelConfirmButtonText}>CANCELAR</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.proceedConfirmButton}
                    onPress={confirmRemovalAfterSync}
                  >
                    <Text style={styles.proceedConfirmButtonText}>CONFIRMAR REMOÇÃO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </RNModal>
    );
  }

  if (currentStep === 'receive') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>RECEBER DADOS</Text>
          
          <View style={styles.receiveContainer}>
            <Icon name="qr-code-scanner" size={100} color={COLORS.primary} />
            <Text style={styles.receiveTitle}>Funcionalidade em Desenvolvimento</Text>
            <Text style={styles.receiveText}>
              Em breve você poderá escanear QR codes para receber dados de outros dispositivos.
            </Text>
          </View>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    );
  }

  return null;
}