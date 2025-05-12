// components/TakenPhotosModal.tsx - Componente simples para ver fotos
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';

interface TakenPhotosModalProps {
  visible: boolean;
  onClose: () => void;
  takenPhotos: string[];
  onClearAll?: () => void;
}

export default function TakenPhotosModal({
  visible,
  onClose,
  takenPhotos,
  onClearAll,
}: TakenPhotosModalProps) {
  const renderPhotoItem = ({ item }: { item: string }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item }} style={styles.photoImage} />
    </View>
  );

  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Fotos Tiradas ({takenPhotos.length})</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {takenPhotos.length > 0 ? (
          <FlatList
            data={takenPhotos}
            renderItem={renderPhotoItem}
            keyExtractor={(item, index) => `photo-${index}`}
            numColumns={3}
            style={styles.photoList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="no-photography" size={64} color={COLORS.disabled} />
            <Text style={styles.emptyText}>Nenhuma foto tirada ainda</Text>
          </View>
        )}

        {takenPhotos.length > 0 && onClearAll && (
          <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
            <Icon name="delete" size={24} color="white" />
            <Text style={styles.clearButtonText}>Limpar Todas</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  photoList: {
    maxHeight: 400,
  },
  photoItem: {
    flex: 1 / 3,
    margin: 4,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 10,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});