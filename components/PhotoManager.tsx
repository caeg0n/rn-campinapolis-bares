// components/PhotoManager.tsx
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';

interface PhotoManagerProps {
  visible: boolean;
  onClose: () => void;
  takenPhotos: string[];
  onRemovePhoto: (photoUri: string) => void;
  onClearAll: () => void;
  photoStats: {
    totalPhotos: number;
    totalSizeKB: number;
    maxPhotos: number;
  };
}

export default function PhotoManager({
  visible,
  onClose,
  takenPhotos,
  onRemovePhoto,
  onClearAll,
  photoStats,
}: PhotoManagerProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleRemovePhoto = (photoUri: string) => {
    Alert.alert(
      "Remover Foto",
      "Deseja remover esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive",
          onPress: () => onRemovePhoto(photoUri)
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Limpar Todas as Fotos",
      `Deseja remover todas as ${photoStats.totalPhotos} fotos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover Todas", 
          style: "destructive",
          onPress: onClearAll
        },
      ]
    );
  };

  const renderPhotoItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => setSelectedPhoto(item)}
    >
      <Image source={{ uri: item }} style={styles.photoThumbnail} />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemovePhoto(item)}
      >
        <Icon name="remove-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gerenciar Fotos</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {photoStats.totalPhotos} de {photoStats.maxPhotos} fotos
          </Text>
          <Text style={styles.statsText}>
            Tamanho total: {photoStats.totalSizeKB} KB
          </Text>
        </View>

        {takenPhotos.length > 0 ? (
          <>
            <FlatList
              data={takenPhotos}
              renderItem={renderPhotoItem}
              keyExtractor={(item, index) => `photo-${index}`}
              numColumns={3}
              style={styles.photoList}
            />
            
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <Icon name="delete-sweep" size={24} color="white" />
              <Text style={styles.clearAllText}>Limpar Todas</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="no-photography" size={64} color={COLORS.disabled} />
            <Text style={styles.emptyText}>Nenhuma foto salva</Text>
          </View>
        )}

        {/* Photo Preview Modal */}
        <Modal 
          visible={!!selectedPhoto}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <TouchableOpacity 
            style={styles.previewOverlay}
            onPress={() => setSelectedPhoto(null)}
          >
            <View style={styles.previewContainer}>
              {selectedPhoto && (
                <Image source={{ uri: selectedPhoto }} style={styles.previewImage} />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    margin: 16,
    borderRadius: 8,
  },
  statsText: {
    color: COLORS.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  photoList: {
    flex: 1,
    padding: 8,
  },
  photoItem: {
    flex: 1,
    margin: 4,
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  clearAllText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 18,
    marginTop: 16,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '90%',
    height: '80%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});