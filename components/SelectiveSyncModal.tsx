// components/SelectiveSyncModal.tsx - Full component with separated styles
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNModal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';

// Import separated style files
import { ConfirmationOverlayStyles as confirmStyles } from '../styles/ConfirmationOverlayStyles';
import { MainSyncModalStyles as mainStyles } from '../styles/MainSyncModalStyles';

import { Person, Table } from '../types';
import { JSONCompressor } from '../utils/compressionPako';
import { formatCurrency } from '../utils/currencyMask';
import QRScanner from './QRScanner';

interface SelectiveSyncModalProps {
  visible: boolean;
  onClose: () => void;
  tables: Table[];
  onRemoveProduct: (tableId: number, personIndex: number, orderIndices: number[]) => void;
  onImportProducts: (tableNumber: string, personName: string, orders: any[]) => void;
}

type SyncStep =
  | 'choose_table'
  | 'choose_person'
  | 'choose_products'
  | 'show_qr'
  | 'receive'
  | 'scanning'
  | 'show_received_data'
  | 'confirm_import';

export default function SelectiveSyncModal({
  visible,
  onClose,
  tables,
  onRemoveProduct,
  onImportProducts
}: SelectiveSyncModalProps) {
  const [currentStep, setCurrentStep] = useState<SyncStep>('choose_table');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number>(-1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [qrData, setQrData] = useState('');
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  const enabledTables = tables.filter(table => table.enabled);

  const resetSelections = () => {
    setCurrentStep('choose_table');
    setSelectedTable(null);
    setSelectedPerson(null);
    setSelectedPersonIndex(-1);
    setSelectedProducts([]);
    setQrData('');
    setIsConfirmingRemoval(false);
    setScannedData(null);
    setParsedData(null);
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
    if (person.paid) {
      Alert.alert('Pessoa já paga', 'Esta pessoa já pagou sua conta. Não é possível sincronizar.');
      return;
    }
    setSelectedPerson(person);
    setSelectedPersonIndex(personIndex);

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
    const syncData = {
      type: 'PERSON_ORDERS',
      table: {
        number: selectedTable.number,
        name: selectedTable.name
      },
      person: {
        name: selectedPerson.name,
      },
      orders: selectedProducts.map(orderIndex => selectedPerson.orders[orderIndex])
    };
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

  // Handle QR code scanning
  const handleQRCodeScanned = (data: string) => {
    setScannedData(data);
    try {
      if (data.startsWith('SYNC:')) {
        const compressedData = data.substring(5);
        const decompressedJson = JSONCompressor.decompressJSON(compressedData);
        const parsedData = JSON.parse(decompressedJson);
        setParsedData(parsedData);

        if (parsedData.type === 'PERSON_ORDERS') {
          const matchingTable = tables.find(table =>
            table.enabled && table.number === parsedData.table.number
          );
          if (matchingTable) {
            setCurrentStep('confirm_import');
          } else {
            setCurrentStep('show_received_data');
          }
        } else {
          setCurrentStep('show_received_data');
        }
      } else if (data.startsWith('COMPRESSED:')) {
        const compressedData = data.substring(11);
        const decompressedJson = JSONCompressor.decompressJSON(compressedData);
        const parsedData = JSON.parse(decompressedJson);
        setParsedData(parsedData);
        setCurrentStep('show_received_data');
      } else {
        Alert.alert(
          'QR Code não reconhecido',
          'Este QR Code não é do formato esperado. Apenas QR codes gerados por este aplicativo são aceitos.',
          [{ text: 'OK' }]
        );
        setParsedData({ raw: data, error: 'Unrecognized format' });
        setCurrentStep('show_received_data');
      }
    } catch (error) {
      Alert.alert(
        'Erro ao processar QR Code',
        `Erro: ${error}`,
        [{ text: 'OK' }]
      );
      setParsedData({ raw: data, error: (error instanceof Error ? error.message : String(error)) });
      setCurrentStep('show_received_data');
    }
  };

  const handleStartScanning = () => {
    setCurrentStep('scanning');
  };

  const handleCloseScanner = () => {
    setCurrentStep('receive');
  };

  // Handle importing products
  const handleConfirmImport = () => {
    if (!parsedData || parsedData.type !== 'PERSON_ORDERS') return;
    const importedOrders = parsedData.orders.map((order: any) => ({
      ...order,
      importedViaQR: true
    }));
    onImportProducts(
      parsedData.table.number,
      parsedData.person.name,
      importedOrders
    );
    Alert.alert(
      'Produtos Importados',
      `${parsedData.orders.length} produto(s) foram adicionados à conta de ${parsedData.person.name} na Mesa ${parsedData.table.number}.`,
      [
        {
          text: 'OK',
          onPress: () => {
            resetSelections();
            onClose();
          }
        }
      ]
    );
  };

  // Step 1: Choose Table
  if (currentStep === 'choose_table') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>SINCRONIZAÇÃO</Text>
          <Text style={mainStyles.stepTitle}>1. Escolher Mesa</Text>
          {enabledTables.length === 0 ? (
            <Text style={mainStyles.emptyMessage}>Nenhuma mesa ativa encontrada.</Text>
          ) : (
            <FlatList
              data={enabledTables}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={mainStyles.tableButton}
                  onPress={() => handleTableSelect(item)}
                >
                  <View style={mainStyles.tableInfo}>
                    <Text style={mainStyles.tableNumber}>Mesa {item.number}</Text>
                    {item.name && (
                      <Text style={mainStyles.tableName}>{item.name}</Text>
                    )}
                    <Text style={mainStyles.tablePeople}>
                      {item.people.filter(p => !p.paid).length} pessoa(s) não paga(s)
                    </Text>
                  </View>
                  <Icon name="arrow-forward" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
          )}
          <View style={mainStyles.buttonRow}>
            <TouchableOpacity
              style={[mainStyles.receiveButton, { backgroundColor: COLORS.primary }]}
              onPress={() => setCurrentStep('receive')}
            >
              <Icon name="qr-code" size={24} color="black" />
              <Text style={[mainStyles.receiveButtonText, { color: 'black' }]}>RECEBER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mainStyles.cancelButton} onPress={handleClose}>
              <Text style={mainStyles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  // Step 2: Choose Person
  if (currentStep === 'choose_person') {
    const unpaidPeople = selectedTable?.people.filter(person => !person.paid) || [];
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>Mesa {selectedTable?.number}</Text>
          <Text style={mainStyles.stepTitle}>2. Escolher Cliente</Text>
          {unpaidPeople.length === 0 ? (
            <Text style={mainStyles.emptyMessage}>Todos os clientes desta mesa já pagaram.</Text>
          ) : (
            <FlatList
              data={unpaidPeople}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const originalIndex = selectedTable!.people.findIndex(p => p === item);
                return (
                  <TouchableOpacity
                    style={mainStyles.personButton}
                    onPress={() => handlePersonSelect(item, originalIndex)}
                  >
                    <View style={mainStyles.personInfo}>
                      <Image source={{ uri: item.avatar }} style={mainStyles.personAvatar} />
                      <View style={mainStyles.personDetails}>
                        <Text style={mainStyles.personName}>{item.name}</Text>
                        <Text style={mainStyles.personTotal}>
                          Total: {formatCurrency(item.bill)}
                        </Text>
                        <Text style={mainStyles.personOrders}>
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
          <View style={mainStyles.buttonRow}>
            <TouchableOpacity
              style={mainStyles.backButton}
              onPress={() => setCurrentStep('choose_table')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={mainStyles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mainStyles.cancelButton} onPress={handleClose}>
              <Text style={mainStyles.cancelButtonText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  // Step 3: Choose Products
  if (currentStep === 'choose_products') {
    const orders = selectedPerson?.orders || [];
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>Cliente: {selectedPerson?.name}</Text>
          <Text style={mainStyles.stepTitle}>3. Escolher Produtos</Text>
          {orders.length === 0 ? (
            <Text style={mainStyles.emptyMessage}>Este cliente não tem produtos.</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    mainStyles.productButton,
                    selectedProducts.includes(index) && mainStyles.selectedProduct
                  ]}
                  onPress={() => toggleProductSelection(index)}
                >
                  <View style={mainStyles.productInfo}>
                    <Text style={mainStyles.productQuantity}>{item.quantity}x</Text>
                    <Text style={mainStyles.productName}>{item.product.name}</Text>
                    <Text style={mainStyles.productPrice}>
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
            <View style={mainStyles.totalContainer}>
              <Text style={mainStyles.totalText}>
                Total selecionado: {formatCurrency(getTotalAmount())}
              </Text>
            </View>
          )}
          <View style={mainStyles.buttonRow}>
            <TouchableOpacity
              style={mainStyles.backButton}
              onPress={() => setCurrentStep('choose_person')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={mainStyles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                mainStyles.generateButton,
                selectedProducts.length === 0 && mainStyles.disabledButton
              ]}
              onPress={generateQRCode}
              disabled={selectedProducts.length === 0}
            >
              <Icon name="qr-code" size={24} color="black" />
              <Text style={mainStyles.generateButtonText}>GERAR QR CODE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  // Step 4: Show QR Code
  if (currentStep === 'show_qr') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.9}>
        <View style={mainStyles.qrModalContainer}>
          <Text style={mainStyles.qrTitle}>QR Code - Cliente Específico</Text>
          <Text style={mainStyles.qrSubtitle}>
            Mesa {selectedTable?.number} - {selectedPerson?.name}
          </Text>
          <View style={mainStyles.qrContainer}>
            <QRCode
              value={qrData}
              size={250}
              color="black"
              backgroundColor="white"
            />
          </View>
          <View style={mainStyles.qrInfoContainer}>
            <Text style={mainStyles.qrInfoText}>
              📦 {selectedProducts.length} produto(s) selecionado(s)
            </Text>
            <Text style={mainStyles.qrInfoText}>
              💰 Total: {formatCurrency(getTotalAmount())}
            </Text>
          </View>
          <View style={mainStyles.qrButtonsContainer}>
            <TouchableOpacity
              style={mainStyles.confirmRemovalButton}
              onPress={() => setIsConfirmingRemoval(true)}
            >
              <Icon name="sync" size={24} color="black" />
              <Text style={mainStyles.confirmRemovalButtonText}>QR LIDO - CONFIRMAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={mainStyles.backToProductsButton}
              onPress={() => setCurrentStep('choose_products')}
            >
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={mainStyles.backToProductsButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
          
          {/* Confirmation Overlay Modal */}
          {isConfirmingRemoval && (
            <View style={confirmStyles.confirmOverlay}>
              <View style={confirmStyles.confirmModal}>
                <Icon name="warning" size={60} color="#FFA500" />
                <Text style={confirmStyles.confirmTitle}>Confirmar Remoção</Text>
                <Text style={confirmStyles.confirmMessage}>
                  Antes de remover os produtos, certifique-se de que o QR Code foi escaneado e lido com sucesso pelo dispositivo receptor.
                </Text>
                <Text style={confirmStyles.confirmInstruction}>
                  Clique em &quot;CONFIRMAR REMOÇÃO&quot; apenas após verificar que os dados foram transferidos.
                </Text>
                <View style={confirmStyles.confirmButtons}>
                  <TouchableOpacity
                    style={confirmStyles.cancelConfirmButton}
                    onPress={() => setIsConfirmingRemoval(false)}
                  >
                    <Text style={confirmStyles.cancelConfirmButtonText}>CANCELAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={confirmStyles.proceedConfirmButton}
                    onPress={confirmRemovalAfterSync}
                  >
                    <Text style={confirmStyles.proceedConfirmButtonText}>CONFIRMAR REMOÇÃO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </RNModal>
    );
  }

  // Step 5: Receive Data - Simplified Layout
  if (currentStep === 'receive') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>RECEBER DADOS</Text>
          
          <View style={mainStyles.receiveModalContent}>
            <View style={mainStyles.receiveQRIcon}>
              <Icon name="qr-code-scanner" size={80} color={COLORS.primary} />
            </View>
            
            <Text style={mainStyles.receiveTitle}>Escaneie um QR Code</Text>
            
            <Text style={mainStyles.receiveDescription}>
              Posicione a câmera sobre um QR Code gerado por este aplicativo para receber dados de sincronização.
            </Text>
            
            <View style={mainStyles.receiveInfoBox}>
              <Text style={mainStyles.receiveInfoBoxTitle}>
                Tipos de QR Code suportados:
              </Text>
              <Text style={mainStyles.receiveInfoText}>
                • SYNC: Pedidos de cliente específico{'\n'}
                • COMPRESSED: Dados de todas as mesas
              </Text>
            </View>
            
            <View style={mainStyles.receiveButtonsContainer}>
              <TouchableOpacity style={mainStyles.scanButton} onPress={handleStartScanning}>
                <Icon name="qr-code-scanner" size={24} color="black" />
                <Text style={mainStyles.scanButtonText}>INICIAR ESCANEAMENTO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={mainStyles.voltarButton} onPress={handleClose}>
                <Text style={mainStyles.voltarButtonText}>VOLTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    );
  }

  // Step 6: Scanning
  if (currentStep === 'scanning') {
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={1}>
        <QRScanner
          onScan={handleQRCodeScanned}
          onClose={handleCloseScanner}
        />
      </RNModal>
    );
  }

  // Step 7: Confirm Import - COMPLETE FIX
  if (currentStep === 'confirm_import') {
    const matchingTable = tables.find(
      table => table.enabled && table.number === parsedData.table.number
    );

    const calculateTotal = (orders: any[]) => {
      return orders.reduce(
        (sum, order) => sum + order.product.price * order.quantity,
        0
      );
    };

    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>CONFIRMAR IMPORTAÇÃO</Text>
          
          <View style={mainStyles.importModalContent}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={mainStyles.importScrollContent}
              onScroll={(event) => {
                // Handle scroll for custom indicator if needed
              }}
              scrollEventThrottle={16}
            >
              <View style={mainStyles.importConfirmContainer}>
                <View style={mainStyles.importIconContainer}>
                  <Icon name="download" size={60} color={COLORS.primary} />
                </View>
                
                <Text style={mainStyles.importTitle}>Mesa Encontrada!</Text>
                <Text style={mainStyles.importSubtitle}>
                  Uma mesa ativa com o número {parsedData.table.number} foi encontrada.
                </Text>
                
                <View style={mainStyles.importDetailsContainer}>
                  <View style={mainStyles.importDetailRow}>
                    <Text style={mainStyles.importDetailLabel}>Cliente:</Text>
                    <Text style={mainStyles.importDetailValue}>{parsedData.person.name}</Text>
                  </View>
                  
                  <View style={mainStyles.importDetailRow}>
                    <Text style={mainStyles.importDetailLabel}>Mesa de Origem:</Text>
                    <Text style={mainStyles.importDetailValue}>
                      {parsedData.table.number} - {parsedData.table.name}
                    </Text>
                  </View>
                  
                  <View style={mainStyles.importDetailRow}>
                    <Text style={mainStyles.importDetailLabel}>Mesa de Destino:</Text>
                    <Text style={mainStyles.importDetailValue}>
                      {matchingTable?.number} - {matchingTable?.name}
                    </Text>
                  </View>
                  
                  <View style={mainStyles.importProductsSection}>
                    <Text style={mainStyles.importProductsTitle}>Produtos ({parsedData.orders.length}):</Text>
                    {parsedData.orders.map((order: any, index: number) => (
                      <Text key={index} style={mainStyles.importProductItem}>
                        {order.quantity}x {order.product.name} - {formatCurrency(order.product.price * order.quantity)}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={mainStyles.importTotalSection}>
                    <View style={mainStyles.importTotalRow}>
                      <Text style={mainStyles.importTotalLabel}>Total:</Text>
                      <Text style={mainStyles.importTotalValue}>
                        {formatCurrency(calculateTotal(parsedData.orders))}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={mainStyles.importWarningContainer}>
                  <Text style={mainStyles.importWarning}>
                    Os produtos serão adicionados à conta do cliente na mesa ativa.
                    Se o cliente não existir, será criado automaticamente.
                  </Text>
                </View>
              </View>
            </ScrollView>
            
            {/* Custom yellow scroll indicator - simplified approach */}
            <View style={mainStyles.scrollIndicatorContainer}>
              <View style={[mainStyles.scrollIndicatorThumb, { height: '30%' }]} />
            </View>
            
            <View style={mainStyles.importButtonsContainer}>
              <TouchableOpacity 
                style={mainStyles.importConfirmButton}
                onPress={handleConfirmImport}
              >
                <Icon name="download" size={24} color="black" />
                <Text style={mainStyles.importConfirmButtonText}>IMPORTAR PRODUTOS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={mainStyles.cancelButton} 
                onPress={() => setCurrentStep('show_received_data')}
              >
                <Text style={mainStyles.cancelButtonText}>APENAS VISUALIZAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    );
  }

  // Step 8: Show Received Data
  if (currentStep === 'show_received_data') {
    const formatOrdersText = (orders: any[]) => {
      return orders.map(order =>
        `${order.quantity}x ${order.product.name} - ${formatCurrency(order.product.price * order.quantity)}`
      ).join('\n');
    };
    const calculateTotal = (orders: any[]) => {
      return orders.reduce((sum, order) =>
        sum + (order.product.price * order.quantity), 0
      );
    };
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={mainStyles.modalContainer}>
          <Text style={mainStyles.modalTitle}>DADOS RECEBIDOS</Text>
          {parsedData && !parsedData.error ? (
            <View style={mainStyles.receivedDataContainer}>
              {parsedData.type === 'PERSON_ORDERS' ? (
                <>
                  <Text style={mainStyles.receivedDataLabel}>Tipo:</Text>
                  <Text style={mainStyles.receivedDataValue}>Pedidos de Cliente Específico</Text>
                  <Text style={mainStyles.receivedDataLabel}>Mesa:</Text>
                  <Text style={mainStyles.receivedDataValue}>
                    {parsedData.table.number} - {parsedData.table.name}
                  </Text>
                  <Text style={mainStyles.receivedDataLabel}>Cliente:</Text>
                  <Text style={mainStyles.receivedDataValue}>{parsedData.person.name}</Text>
                  <Text style={mainStyles.receivedDataLabel}>Pedidos ({parsedData.orders.length}):</Text>
                  {parsedData.orders.map((order: any, index: number) => (
                    <Text key={index} style={mainStyles.receivedProductItem}>
                      {order.quantity}x {order.product.name} - {formatCurrency(order.product.price * order.quantity)}
                    </Text>
                  ))}
                  <Text style={mainStyles.receivedDataTotal}>
                    Total: {formatCurrency(calculateTotal(parsedData.orders))}
                  </Text>
                </>
              ) : parsedData.d ? (
                <>
                  <Text style={mainStyles.receivedDataLabel}>Tipo:</Text>
                  <Text style={mainStyles.receivedDataValue}>Dados de Todas as Mesas</Text>
                  <Text style={mainStyles.receivedDataLabel}>Versão:</Text>
                  <Text style={mainStyles.receivedDataValue}>{parsedData.v}</Text>
                  <Text style={mainStyles.receivedDataLabel}>Data:</Text>
                  <Text style={mainStyles.receivedDataValue}>
                    {new Date(parsedData.t).toLocaleString()}
                  </Text>
                  <Text style={mainStyles.receivedDataLabel}>Mesas ({parsedData.d.length}):</Text>
                  {parsedData.d.map((table: any, index: number) => (
                    <View key={index}>
                      <Text style={mainStyles.receivedDataValue}>
                        Mesa {table.n} - {table.nm}
                      </Text>
                      <Text style={mainStyles.receivedProductItem}>
                        {table.p.length} pessoa(s), {table.p.reduce((sum: number, p: any) => sum + p.o.length, 0)} pedido(s)
                      </Text>
                    </View>
                  ))}
                </>
              ) : (
                <>
                  <Text style={mainStyles.receivedDataLabel}>Dados Brutos:</Text>
                  <Text style={mainStyles.receivedDataValue}>
                    {JSON.stringify(parsedData, null, 2)}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <View style={mainStyles.receivedDataContainer}>
              <Text style={mainStyles.receivedDataLabel}>Erro:</Text>
              <Text style={mainStyles.receivedDataValue}>
                {parsedData?.error || 'Erro desconhecido'}
              </Text>
              <Text style={mainStyles.receivedDataLabel}>Dados Brutos:</Text>
              <Text style={mainStyles.receivedDataValue}>
                {typeof scannedData === 'string'
                  ? scannedData.substring(0, 200) + (scannedData.length > 200 ? '...' : '')
                  : JSON.stringify(scannedData)
                }
              </Text>
            </View>
          )}
          <View style={mainStyles.buttonRow}>
            <TouchableOpacity style={mainStyles.backButton} onPress={() => setCurrentStep('receive')}>
              <Icon name="arrow-back" size={24} color={COLORS.primary} />
              <Text style={mainStyles.backButtonText}>ESCANEAR NOVAMENTE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mainStyles.cancelButton} onPress={handleClose}>
              <Text style={mainStyles.cancelButtonText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  return null;
}
