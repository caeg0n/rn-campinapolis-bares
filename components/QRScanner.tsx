// components/QRScanner.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { Logger } from '../utils/logger';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string>('');
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return; // Prevent multiple scans
    
    const endTimer = Logger.startTimer('QR_CODE_SCAN');
    
    setScanned(true);
    setLastScannedData(data);
    
    // Log scan event
    Logger.qrScanStart({
      length: data.length,
      preview: data.substring(0, 50)
    });
    
    Logger.info('QR_SCANNER', `Barcode type: ${type}`);
    Logger.debug('QR_SCANNER', 'Full raw data:', data);
    
    // Check if it's a SYNC QR code
    if (data.startsWith('SYNC:')) {
      Logger.qrValidation({
        valid: true,
        details: { type: 'SYNC', compressedDataLength: data.length - 5 }
      });
      
      try {
        // Pass to parent component for processing
        Logger.info('QR_SCANNER', 'Passing data to parent component for processing');
        onScan(data);
        Logger.qrScanSuccess({ type: 'SYNC', processed: true });
        endTimer();
      } catch (error) {
        Logger.qrScanError(error, data);
        endTimer();
        
        Alert.alert(
          'Erro de QR Code',
          'Erro ao processar o QR Code. Verifique os logs para mais detalhes.',
          [
            {
              text: 'Ver Dados Brutos',
              onPress: () => showRawDataDialog(data)
            },
            {
              text: 'OK',
              onPress: () => setScanned(false)
            }
          ]
        );
      }
    } else {
      Logger.qrValidation({
        valid: false,
        reason: 'Invalid format - not a SYNC QR code',
        details: { 
          actualPrefix: data.substring(0, 10),
          expectedPrefix: 'SYNC:',
          dataLength: data.length
        }
      });
      
      endTimer();
      
      Alert.alert(
        'QR Code Inválido',
        'Este QR Code não é do tipo SYNC. Apenas QR codes gerados por este aplicativo são aceitos.',
        [
          {
            text: 'Ver Dados',
            onPress: () => showRawDataDialog(data)
          },
          {
            text: 'Tentar Novamente',
            onPress: () => resetScan()
          }
        ]
      );
    }
    
    // Auto-reset scan after 3 seconds if no action taken
    scanTimeoutRef.current = setTimeout(() => {
      Logger.info('QR_SCANNER', 'Auto-resetting scanner after timeout');
      setScanned(false);
    }, 3000);
  };

  const resetScan = () => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    setScanned(false);
    setLastScannedData('');
    Logger.info('QR_SCANNER', 'Scanner manually reset - ready for new scan');
  };

  const showRawDataDialog = (data: string) => {
    Logger.info('QR_SCANNER', 'Displaying raw QR data to user');
    Logger.debug('QR_SCANNER', 'Raw data being shown:', data);
    
    Alert.alert(
      'Dados Brutos do QR Code',
      `Tamanho: ${data.length} caracteres\n\nDados: ${data}`,
      [
        {
          text: 'Copiar para Log',
          onPress: () => {
            Logger.info('QR_SCANNER', '=== USER REQUESTED RAW DATA LOG ===');
            Logger.info('QR_SCANNER', `Length: ${data.length}`);
            Logger.info('QR_SCANNER', 'Raw data:', data);
            Logger.info('QR_SCANNER', '=== END RAW DATA LOG ===');
          }
        },
        { text: 'OK' }
      ]
    );
  };

  const showRawData = () => showRawDataDialog(lastScannedData);

  if (!permission) {
    Logger.info('QR_SCANNER', 'Camera permissions still loading');
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Verificando permissões da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    Logger.warning('QR_SCANNER', 'Camera permission not granted');
    return (
      <View style={styles.container}>
        <Icon name="camera-alt" size={64} color={COLORS.primary} />
        <Text style={styles.text}>Permissão da câmera necessária</Text>
        <Text style={styles.subtext}>
          Este app precisa acessar a câmera para escanear QR codes
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={() => {
            Logger.info('QR_SCANNER', 'User requesting camera permission');
            requestPermission();
          }}
        >
          <Text style={styles.permissionButtonText}>PERMITIR ACESSO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>FECHAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  Logger.info('QR_SCANNER', 'Camera ready - scanning for QR codes');

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleContainer}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructionText}>
            Posicione o QR Code na área destacada
          </Text>
          <Text style={styles.debugInfo}>
            Debug mode: Todos os scans são logados
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="white" />
            <Text style={styles.closeButtonText}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {scanned && (
        <View style={styles.scannedOverlay}>
          <Icon name="check-circle" size={64} color="#4CAF50" />
          <Text style={styles.scannedText}>QR Code escaneado!</Text>
          <Text style={styles.scannedSubtext}>
            {lastScannedData.length} caracteres lidos
          </Text>
          
          <View style={styles.scanActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={showRawData}
            >
              <Icon name="visibility" size={20} color="white" />
              <Text style={styles.actionButtonText}>VER DADOS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={resetScan}
            >
              <Icon name="refresh" size={20} color="black" />
              <Text style={styles.scanAgainText}>ESCANEAR NOVAMENTE</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.logHint}>
            Verifique o console para logs detalhados
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  subtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  debugInfo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannedText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  scannedSubtext: {
    color: 'white',
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  scanActions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scanAgainText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});