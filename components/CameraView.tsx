import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { CameraProps } from '../types';

export default function CameraView({ onClose, onTakePicture }: CameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        setHasPermission(cameraPermission.status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Nova API
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false, // Vamos processar posteriormente
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Processar a imagem para o tamanho correto
        const resizedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            { resize: { width: 150, height: 150 } },
          ],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (resizedImage.base64) {
          onTakePicture(`data:image/jpeg;base64,${resizedImage.base64}`);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Verificando permissões...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Acesso à câmera negado</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onClose}>
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="camera-alt" size={100} color={COLORS.primary} />
        <Text style={styles.title}>Tirar Foto</Text>
        <Text style={styles.subtitle}>Tire uma foto para usar como avatar</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Icon name="camera" size={40} color="black" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 40,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});