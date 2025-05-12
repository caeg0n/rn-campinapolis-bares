// components/BottomMenu.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../app/styles";

interface Props {
  onManageProducts: () => void;
  onViewHistory: () => void;
  onViewPhotos?: () => void; // Nova prop para ver fotos
  photoCount?: number; // Opcional: mostrar número de fotos
}

export default function BottomMenu({ 
  onManageProducts, 
  onViewHistory, 
  onViewPhotos,
  photoCount = 0 
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={onManageProducts}>
        <Icon name="restaurant-menu" size={28} color={COLORS.primary} />
        <Text style={styles.menuText}>Gerenciar Produtos</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={onViewHistory}>
        <Icon name="history" size={28} color={COLORS.primary} />
        <Text style={styles.menuText}>Histórico</Text>
      </TouchableOpacity>

      {onViewPhotos && (
        <TouchableOpacity style={styles.menuItem} onPress={onViewPhotos}>
          <View style={styles.iconContainer}>
            <Icon name="photo-library" size={28} color={COLORS.primary} />
            {photoCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{photoCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.menuText}>Fotos</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  menuText: {
    color: COLORS.primary,
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});