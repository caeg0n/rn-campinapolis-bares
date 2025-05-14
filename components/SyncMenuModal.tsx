// components/SyncMenuModal.tsx - With JSON compression
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNModal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { Table } from '../types';
import { JSONCompressor } from '../utils/compressionPako';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SyncMenuModalProps {
  visible: boolean;
  onClose: () => void;
  tables: Table[];
}

export default function SyncMenuModal({
  visible,
  onClose,
  tables
}: SyncMenuModalProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState('');
  const [tablesSummary, setTablesSummary] = useState<{ 
    count: number; 
    originalSize: number;
    compressedSize: number;
    compressionRatio: string;
  }>({ count: 0, originalSize: 0, compressedSize: 0, compressionRatio: '0%' });

  const createAllTablesData = (tables: Table[]) => {
    const enabledTables = tables.filter(table => table.enabled);
    
    // Create a compact data structure for all tables
    const allTablesData = {
      v: '1.0', // version
      t: Date.now(), // timestamp
      d: enabledTables.map(table => ({
        n: table.number, // number
        nm: table.name, // name
        p: table.people.map(person => ({
          n: person.name,
          b: Math.round(person.bill * 100) / 100, // round to 2 decimals
          o: person.orders.map(order => ({
            p: order.product.name,
            q: order.quantity,
            pr: Math.round(order.product.price * 100) / 100
          })),
          pd: person.paid ? 1 : 0 // convert boolean to number
        })),
        pr: table.products.map(p => ({
          n: p.name,
          pr: Math.round(p.price * 100) / 100
        }))
      }))
    };
    
    // Compress the JSON by removing unnecessary whitespace
    return JSON.stringify(allTablesData);
  };

  const handleSend = () => {
    const enabledTables = tables.filter(table => table.enabled);
    
    if (enabledTables.length === 0) {
      Alert.alert('Aviso', 'Não há mesas ativas para sincronizar.');
      return;
    }

    const originalData = createAllTablesData(tables);
    
    // Test compression
    const compressionResult = JSONCompressor.getCompressionRatio(originalData);
    console.log('Compression stats:', compressionResult);
    
    // Compress the data
    const compressedData = JSONCompressor.compressJSON(originalData);
    
    // Check if compressed data is still too large for QR code
    if (compressedData.length > 4000) {
      Alert.alert(
        'Dados grandes para QR Code',
        `Mesmo comprimido, o QR code terá ${compressedData.length} caracteres (original: ${originalData.length}). 
        Redução: ${compressionResult.savings}
        QR codes muito grandes podem ser difíceis de escanear. Deseja continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Continuar', 
            onPress: () => {
              // Add compression marker to identify compressed data
              const finalData = `COMPRESSED:${compressedData}`;
              setQrData(finalData);
              setTablesSummary({ 
                count: enabledTables.length, 
                originalSize: originalData.length,
                compressedSize: compressedData.length,
                compressionRatio: compressionResult.savings
              });
              setShowQR(true);
            }
          }
        ]
      );
    } else {
      // Add compression marker to identify compressed data
      const finalData = `COMPRESSED:${compressedData}`;
      setQrData(finalData);
      setTablesSummary({ 
        count: enabledTables.length, 
        originalSize: originalData.length,
        compressedSize: compressedData.length,
        compressionRatio: compressionResult.savings
      });
      setShowQR(true);
    }
  };

  const handleReceive = () => {
    Alert.alert('Em Desenvolvimento', 'A funcionalidade de receber dados será implementada em breve.');
  };

  if (showQR) {
    // Log QR code information to console
    console.log('QR Code Original Size:', tablesSummary.originalSize, 'characters');
    console.log('QR Code Compressed Size:', tablesSummary.compressedSize, 'characters');
    console.log('Compression Ratio:', tablesSummary.compressionRatio);
    console.log('Tables included:', tablesSummary.count);
    
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.9}>
        <View style={styles.qrModalContainer}>
          <Text style={styles.qrTitle}>Dados de Todas as Mesas</Text>
          <Text style={styles.qrSubtitle}>
            {tablesSummary.count} mesa(s) ativa(s)
          </Text>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={Math.min(screenWidth * 0.8, 350)}
              color="black"
              backgroundColor="white"
            />
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="table-rows" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>{tablesSummary.count} mesa(s) incluída(s)</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon 
                name={tablesSummary.compressedSize < 1000 ? "check-circle" : "warning"} 
                size={20} 
                color={tablesSummary.compressedSize < 1000 ? "#4CAF50" : "#FFA500"} 
              />
              <Text style={styles.infoText}>
                {tablesSummary.compressedSize < 1000 ? 
                  'Tamanho ideal para escaneamento' : 
                  'QR Code grande - aproxime bem a câmera'
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => {
                setShowQR(false);
                setQrData('');
                onClose();
              }}
            >
              <Text style={styles.confirmButtonText}>CONCLUIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  // Preview how much data will be in the QR code
  const enabledTables = tables.filter(table => table.enabled);
  const totalPeople = enabledTables.reduce((acc, table) => acc + table.people.length, 0);
  const totalOrders = enabledTables.reduce((acc, table) => 
    acc + table.people.reduce((pAcc, person) => pAcc + person.orders.length, 0), 0
  );

  return (
    <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>SINCRONIZAÇÃO</Text>
        
        <Text style={styles.modalInfoText}>
          A sincronização criará um único QR Code contendo todas as mesas ativas.
        </Text>

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Dados que serão incluídos:</Text>
          <Text style={styles.previewItem}>• {enabledTables.length} mesa(s) ativa(s)</Text>
          <Text style={styles.previewItem}>• {totalPeople} cliente(s) total</Text>
          <Text style={styles.previewItem}>• {totalOrders} pedido(s) registrado(s)</Text>
          <Text style={styles.previewNote}>
            * Fotos dos clientes não serão incluídas
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleSend}>
            <Icon name="qr-code" size={50} color={COLORS.primary} />
            <Text style={styles.optionText}>ENVIAR</Text>
            <Text style={styles.optionDescription}>
              Gerar QR Code único com todas as mesas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} onPress={handleReceive}>
            <Icon name="qr-code-scanner" size={50} color={COLORS.primary} />
            <Text style={styles.optionText}>RECEBER</Text>
            <Text style={styles.optionDescription}>
              Escanear QR Code para receber dados
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>FECHAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInfoText: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  previewContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  previewItem: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 5,
  },
  previewNote: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  optionButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    width: '45%',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
  },
  optionDescription: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  qrModalContainer: {
    backgroundColor: '#111111',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxHeight: '95%',
    width: '95%',
    alignSelf: 'center',
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 20,
    opacity: 0.8,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoGrid: {
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
  },
  infoText: {
    color: COLORS.primary,
    fontSize: 14,
    marginLeft: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});