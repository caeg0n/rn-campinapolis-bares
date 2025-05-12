// components/ResetTableModal.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import styles, { COLORS } from '../app/styles';
import { Table } from '../types';

interface Props {
  visible: boolean;
  table: Table | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetTableModal({ 
  visible, 
  table,
  onConfirm, 
  onCancel 
}: Props) {
  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Resetar Mesa {table?.number}</Text>
        
        <Text style={localStyles.message}>
          Tem certeza que deseja resetar esta mesa? A mesa será desativada e todas as informações de clientes, produtos e configurações serão perdidas.
        </Text>
        
        <View style={localStyles.buttonRow}>
          <TouchableOpacity 
            style={[styles.btn, localStyles.confirmButton]} 
            onPress={onConfirm}
          >
            <Text style={styles.btnText}>SIM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cancelBtn, localStyles.cancelButton]} 
            onPress={onCancel}
          >
            <Text style={styles.cancelBtnText}>NÃO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
}

const localStyles = StyleSheet.create({
  message: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  confirmButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FF5555',
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  }
});