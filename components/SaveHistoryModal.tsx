import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { COLORS } from '../app/styles';
import { Table } from '../types';

interface Props {
  visible: boolean;
  table: Table | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SaveHistoryModal({ 
  visible, 
  table,
  onConfirm, 
  onCancel 
}: Props) {
  return (
    <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
      <View style={localStyles.modalBox}>
        <Text style={localStyles.modalTitle}>
          Salvar Mesa {table?.number} no Histórico
        </Text>
        
        <Text style={localStyles.message}>
          A mesa está completamente paga. Deseja salvar os dados no histórico antes de resetar?
        </Text>
        
        <View style={localStyles.buttonRow}>
          <TouchableOpacity 
            style={localStyles.confirmButton} 
            onPress={onConfirm}
          >
            <Text style={localStyles.confirmText}>SIM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={localStyles.cancelButton} 
            onPress={onCancel}
          >
            <Text style={localStyles.cancelText}>NÃO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
}

const localStyles = StyleSheet.create({
  modalBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
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
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  confirmText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});