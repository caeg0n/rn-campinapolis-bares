import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { SaveHistoryModalStyles } from '../styles/SaveHistoryModalStyles';
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
      <View style={SaveHistoryModalStyles.modalBox}>
        <Text style={SaveHistoryModalStyles.modalTitle}>
          Salvar Mesa {table?.number} no Histórico
        </Text>
        
        <Text style={SaveHistoryModalStyles.message}>
          A mesa está completamente paga. Deseja salvar os dados no histórico antes de resetar?
        </Text>
        
        <View style={SaveHistoryModalStyles.buttonRow}>
          <TouchableOpacity 
            style={SaveHistoryModalStyles.confirmButton} 
            onPress={onConfirm}
          >
            <Text style={SaveHistoryModalStyles.confirmText}>SIM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={SaveHistoryModalStyles.cancelButton} 
            onPress={onCancel}
          >
            <Text style={SaveHistoryModalStyles.cancelText}>NÃO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
}