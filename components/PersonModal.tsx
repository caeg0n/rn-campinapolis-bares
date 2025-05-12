// PersonModal.tsx - With current people display fixed
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { COLORS } from '../app/styles';
import { Person } from '../types';
import CameraView from './CameraView';

interface Props {
  visible: boolean;
  avatar: string;
  name: string;
  onChangeAvatar: () => void;
  onChangeName: (name: string) => void;
  onCustomAvatar?: (base64Image: string) => void;
  onSave: () => void;
  onCancel: () => void;
  people: Person[];
  takenPhotos?: string[]; // Array de fotos tiradas anteriormente (opcional)
}

export default function PersonModal({
  visible,
  avatar,
  name,
  onChangeAvatar,
  onChangeName,
  onCustomAvatar,
  onSave,
  onCancel,
  people,
  takenPhotos = [], // Valor padrão como array vazio
}: Props) {
  const [showCamera, setShowCamera] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'online' | 'taken'>('online');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Log para debug
  useEffect(() => {
    console.log('PersonModal recebeu fotos:', takenPhotos.length);
  }, [takenPhotos]);

  // Fotos tiradas e fotos já salvas das pessoas
  const availableTakenPhotos = useMemo(() => {
    const existingPhotos = people
      .filter(person => person.avatar.startsWith('data:image'))
      .map(person => person.avatar);
    
    // Remover duplicatas e combinar com fotos tiradas
    const allPhotos = [...new Set([...takenPhotos, ...existingPhotos])];
    console.log('Fotos disponíveis:', allPhotos.length); // Log para debug
    return allPhotos;
  }, [people, takenPhotos]);

  // Gerar URLs de avatares online aleatórios
  const generateOnlineAvatars = () => {
    const avatarUrls = [];
    for (let i = 1; i <= 20; i++) {
      const randomId = Math.floor(Math.random() * 70) + 1;
      avatarUrls.push(`https://i.pravatar.cc/100?img=${randomId}`);
    }
    return avatarUrls;
  };

  const onlineAvatars = useMemo(() => generateOnlineAvatars(), []);

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleTakePicture = (base64Image: string) => {
    console.log('Foto tirada, tamanho:', base64Image.length); // Log para debug
    setCustomAvatar(base64Image);
    
    // IMPORTANTE: Chamar onCustomAvatar IMEDIATAMENTE
    if (onCustomAvatar) {
      onCustomAvatar(base64Image);
    }
    
    setShowCamera(false);
  };

  const handleOpenAvatarSelection = () => {
    setShowAvatarSelection(true);
    setSelectedTab('online');
    setPreviewAvatar(null);
  };

  const handleCloseAvatarSelection = () => {
    setShowAvatarSelection(false);
    setPreviewAvatar(null);
  };

  const handlePreviewAvatar = (avatarUri: string) => {
    setPreviewAvatar(avatarUri);
  };

  const handleConfirmAvatar = () => {
    if (previewAvatar) {
      setCustomAvatar(previewAvatar);
      if (onCustomAvatar) {
        onCustomAvatar(previewAvatar);
      }
      setShowAvatarSelection(false);
      setPreviewAvatar(null);
    } else {
      Alert.alert('Selecione um Avatar', 'Por favor, selecione um avatar antes de confirmar.');
    }
  };

  const handleSave = () => {
    onSave();
  };

  // Render avatar item for FlatList
  const renderAvatarItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity 
      style={[
        localStyles.avatarOption,
        previewAvatar === item && localStyles.selectedAvatarOption
      ]}
      onPress={() => handlePreviewAvatar(item)}
    >
      <Image source={{ uri: item }} style={localStyles.avatarOptionImage} />
      {previewAvatar === item && (
        <View style={localStyles.selectedIndicator}>
          <Icon name="check-circle" size={20} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  // If camera is open, show the camera view instead of the modal
  if (showCamera) {
    return <CameraView onClose={handleCloseCamera} onTakePicture={handleTakePicture} />;
  }

  // Avatar selection modal
  if (showAvatarSelection) {
    return (
      <RNModal isVisible={true} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
        <View style={localStyles.selectionModalBox}>
          <Text style={styles.modalTitle}>Escolher Avatar</Text>
          
          {/* Preview Section */}
          <View style={localStyles.previewSection}>
            <Image 
              source={{ uri: previewAvatar || customAvatar || avatar }} 
              style={localStyles.previewAvatar} 
            />
            <Text style={localStyles.previewText}>Preview</Text>
          </View>
          
          {/* Tab Selector */}
          <View style={localStyles.tabContainer}>
            <TouchableOpacity 
              style={[
                localStyles.tab, 
                selectedTab === 'online' && localStyles.activeTab
              ]}
              onPress={() => setSelectedTab('online')}
            >
              <Icon name="public" size={20} color={selectedTab === 'online' ? 'black' : COLORS.primary} />
              <Text style={[
                localStyles.tabText,
                selectedTab === 'online' && localStyles.activeTabText
              ]}>
                Online ({onlineAvatars.length})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                localStyles.tab, 
                selectedTab === 'taken' && localStyles.activeTab
              ]}
              onPress={() => setSelectedTab('taken')}
            >
              <Icon name="photo-library" size={20} color={selectedTab === 'taken' ? 'black' : COLORS.primary} />
              <Text style={[
                localStyles.tabText,
                selectedTab === 'taken' && localStyles.activeTabText
              ]}>
                Fotos ({availableTakenPhotos.length})
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content - FlatList without ScrollView wrapper */}
          <View style={localStyles.listContainer}>
            {selectedTab === 'online' ? (
              <FlatList
                data={onlineAvatars}
                numColumns={4}
                keyExtractor={(item, index) => `online-${index}`}
                renderItem={renderAvatarItem}
                style={localStyles.flatList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              availableTakenPhotos.length > 0 ? (
                <FlatList
                  data={availableTakenPhotos}
                  numColumns={4}
                  keyExtractor={(item, index) => `taken-${index}`}
                  renderItem={renderAvatarItem}
                  style={localStyles.flatList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={localStyles.emptySection}>
                  <Icon name="no-photography" size={64} color={COLORS.disabled} />
                  <Text style={localStyles.emptyText}>Nenhuma foto tirada ainda</Text>
                  <Text style={localStyles.emptySubtext}>Tire uma foto primeiro usando a câmera</Text>
                </View>
              )
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={localStyles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.btn, localStyles.confirmButton]}
              onPress={handleConfirmAvatar}
              disabled={!previewAvatar}
            >
              <Text style={styles.btnText}>CONFIRMAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cancelBtn, localStyles.cancelButton]} 
              onPress={handleCloseAvatarSelection}
            >
              <Text style={styles.cancelBtnText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    );
  }

  return (
    <RNModal isVisible={visible} backdropColor={COLORS.secondary} backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Adicionar Cliente</Text>

        {/* SEÇÃO RECUPERADA: Mostrar pessoas já adicionadas à mesa */}
        {people.length > 0 && (
          <View style={localStyles.currentPeopleSection}>
            <Text style={localStyles.currentPeopleTitle}>Clientes Atuais na Mesa:</Text>
            <View style={localStyles.currentPeopleList}>
              {people.map((p, i) => (
                <View key={i} style={localStyles.currentPersonRow}>
                  <Image source={{ uri: p.avatar }} style={localStyles.currentPersonAvatar} />
                  <Text style={localStyles.currentPersonName}>{p.name}</Text>
                  {p.paid && (
                    <Icon name="check-circle" size={16} color="#4caf50" style={localStyles.paidIcon} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <Image 
          source={{ uri: customAvatar || avatar }} 
          style={styles.avatar} 
        />
        
        <View style={localStyles.avatarButtonsRow}>
          <TouchableOpacity 
            style={localStyles.avatarButton} 
            onPress={handleOpenAvatarSelection}
          >
            <Icon name="collections" size={16} color={COLORS.primary} style={localStyles.buttonIcon} />
            <Text style={localStyles.buttonText}>ESCOLHER AVATAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={localStyles.avatarButton} 
            onPress={handleOpenCamera}
          >
            <Icon name="camera-alt" size={16} color={COLORS.primary} style={localStyles.buttonIcon} />
            <Text style={localStyles.buttonText}>TIRAR FOTO</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome do Cliente*"
          placeholderTextColor={COLORS.disabled}
          value={name}
          onChangeText={onChangeName}
        />

        <TouchableOpacity 
          style={[styles.btn, !name && localStyles.disabledButton]} 
          onPress={handleSave}
          disabled={!name}
        >
          <Text style={styles.btnText}>ADICIONAR CLIENTE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}

const localStyles = StyleSheet.create({
  avatarButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 8,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    flex: 0.48,
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectionModalBox: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    maxHeight: '90%',
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  previewText: {
    color: COLORS.primary,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.primary,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'black',
  },
  listContainer: {
    height: 300, // Fixed height instead of ScrollView
  },
  flatList: {
    flex: 1,
  },
  avatarOption: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedAvatarOption: {
    borderColor: COLORS.primary,
    transform: [{ scale: 0.95 }],
  },
  avatarOptionImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 2,
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.disabled,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  confirmButton: {
    flex: 0.48,
  },
  cancelButton: {
    flex: 0.48,
  },
  // ESTILOS RECUPERADOS: Para mostrar clientes atuais
  currentPeopleSection: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currentPeopleTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  currentPeopleList: {
    maxHeight: 120,
  },
  currentPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  currentPersonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  currentPersonName: {
    color: COLORS.primary,
    fontSize: 14,
    flex: 1,
  },
  paidIcon: {
    marginLeft: 8,
  },
});