// components/PersonModal.tsx - With scrollable people list
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { COLORS } from '../app/styles';
import { PersonModalStyles } from '../styles/PersonModalStyles';
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
        PersonModalStyles.avatarOption,
        previewAvatar === item && PersonModalStyles.selectedAvatarOption
      ]}
      onPress={() => handlePreviewAvatar(item)}
    >
      <Image source={{ uri: item }} style={PersonModalStyles.avatarOptionImage} />
      {previewAvatar === item && (
        <View style={PersonModalStyles.selectedIndicator}>
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
        <View style={PersonModalStyles.selectionModalBox}>
          <Text style={styles.modalTitle}>Escolher Avatar</Text>
          
          {/* Preview Section */}
          <View style={PersonModalStyles.previewSection}>
            <Image 
              source={{ uri: previewAvatar || customAvatar || avatar }} 
              style={PersonModalStyles.previewAvatar} 
            />
            <Text style={PersonModalStyles.previewText}>Preview</Text>
          </View>
          
          {/* Tab Selector */}
          <View style={PersonModalStyles.tabContainer}>
            <TouchableOpacity 
              style={[
                PersonModalStyles.tab, 
                selectedTab === 'online' && PersonModalStyles.activeTab
              ]}
              onPress={() => setSelectedTab('online')}
            >
              <Icon name="public" size={20} color={selectedTab === 'online' ? 'black' : COLORS.primary} />
              <Text style={[
                PersonModalStyles.tabText,
                selectedTab === 'online' && PersonModalStyles.activeTabText
              ]}>
                Online ({onlineAvatars.length})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                PersonModalStyles.tab, 
                selectedTab === 'taken' && PersonModalStyles.activeTab
              ]}
              onPress={() => setSelectedTab('taken')}
            >
              <Icon name="photo-library" size={20} color={selectedTab === 'taken' ? 'black' : COLORS.primary} />
              <Text style={[
                PersonModalStyles.tabText,
                selectedTab === 'taken' && PersonModalStyles.activeTabText
              ]}>
                Fotos ({availableTakenPhotos.length})
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content - FlatList without ScrollView wrapper */}
          <View style={PersonModalStyles.listContainer}>
            {selectedTab === 'online' ? (
              <FlatList
                data={onlineAvatars}
                numColumns={4}
                keyExtractor={(item, index) => `online-${index}`}
                renderItem={renderAvatarItem}
                style={PersonModalStyles.flatList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              availableTakenPhotos.length > 0 ? (
                <FlatList
                  data={availableTakenPhotos}
                  numColumns={4}
                  keyExtractor={(item, index) => `taken-${index}`}
                  renderItem={renderAvatarItem}
                  style={PersonModalStyles.flatList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={PersonModalStyles.emptySection}>
                  <Icon name="no-photography" size={64} color={COLORS.disabled} />
                  <Text style={PersonModalStyles.emptyText}>Nenhuma foto tirada ainda</Text>
                  <Text style={PersonModalStyles.emptySubtext}>Tire uma foto primeiro usando a câmera</Text>
                </View>
              )
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={PersonModalStyles.actionButtonsRow}>
            <TouchableOpacity 
              style={[styles.btn, PersonModalStyles.confirmButton]}
              onPress={handleConfirmAvatar}
              disabled={!previewAvatar}
            >
              <Text style={styles.btnText}>CONFIRMAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cancelBtn, PersonModalStyles.cancelButton]} 
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

        {/* SEÇÃO SCROLLAVEL: Mostrar pessoas já adicionadas à mesa */}
        {people.length > 0 && (
          <View style={PersonModalStyles.currentPeopleSection}>
            <Text style={PersonModalStyles.currentPeopleTitle}>Clientes Atuais na Mesa ({people.length}):</Text>
            <ScrollView 
              style={PersonModalStyles.currentPeopleScrollContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={PersonModalStyles.currentPeopleList}>
                {people.map((p, i) => (
                  <View key={i} style={PersonModalStyles.currentPersonRow}>
                    <Image source={{ uri: p.avatar }} style={PersonModalStyles.currentPersonAvatar} />
                    <Text style={PersonModalStyles.currentPersonName}>{p.name}</Text>
                    {p.paid && (
                      <Icon name="check-circle" size={16} color="#4caf50" style={PersonModalStyles.paidIcon} />
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        <Image 
          source={{ uri: customAvatar || avatar }} 
          style={styles.avatar} 
        />
        
        <View style={PersonModalStyles.avatarButtonsRow}>
          <TouchableOpacity 
            style={PersonModalStyles.avatarButton} 
            onPress={handleOpenAvatarSelection}
          >
            <Icon name="collections" size={16} color={COLORS.primary} style={PersonModalStyles.buttonIcon} />
            <Text style={PersonModalStyles.buttonText}>ESCOLHER AVATAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={PersonModalStyles.avatarButton} 
            onPress={handleOpenCamera}
          >
            <Icon name="camera-alt" size={16} color={COLORS.primary} style={PersonModalStyles.buttonIcon} />
            <Text style={PersonModalStyles.buttonText}>TIRAR FOTO</Text>
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
          style={[styles.btn, !name && PersonModalStyles.disabledButton]} 
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