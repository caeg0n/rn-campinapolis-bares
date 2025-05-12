import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styles, { COLORS } from '../app/styles';
import { Table } from '../types';

interface Props {
  item: Table;
  glowAnim: Animated.Value;
  onPress: (t: Table) => void;
  onLongPress: (t: Table) => void;
  isSelected?: boolean;
  showSelected?: boolean;
}

export default function TableCell({ 
  item, 
  glowAnim, 
  onPress, 
  onLongPress,
  isSelected = false, 
  showSelected = true 
}: Props) {
  // Verificar se todas as pessoas da mesa pagaram
  const allPaid = item.people.length > 0 && item.people.every(person => person.paid);
  
  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [allPaid ? '#00c853' : COLORS.primary, '#FFFFFF'],
  });
  
  const bgColor = item.enabled 
    ? (isSelected 
      ? '#FFB700' 
      : allPaid 
        ? '#00c853' // Verde para mesas com todas as contas pagas
        : COLORS.primary) 
    : COLORS.disabled;
  
  const textColor = item.enabled ? COLORS.secondary : '#FFFFFF';

  const selectedStyle = isSelected && showSelected && item.enabled
    ? {
        borderWidth: 3,
        borderColor: '#FF5500',
        shadowColor: '#FF5500',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 10,
      }
    : {};

  return (
    <TouchableOpacity 
      style={styles.cell} 
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      activeOpacity={0.7}
      delayLongPress={800}
    >
      <Animated.View 
        style={[
          styles.cellInner, 
          item.enabled && { borderColor, borderWidth: 2 }, 
          selectedStyle
        ]}
      >
        <View style={[styles.cellBg, { backgroundColor: bgColor }]}> 
          <Text style={[styles.cellText, { color: textColor }]}>             
            {item.enabled ? item.number : "Mesa vazia"}
          </Text>
          {item.enabled && item.name && (
            <Text style={[styles.cellSub, { color: textColor }]}>{item.name}</Text>
          )}
          {isSelected && item.enabled && (
            <View style={localStyles.selectedIndicator}>
              <Text style={localStyles.selectedText}>SELECIONADA</Text>
            </View>
          )}
          {allPaid && item.enabled && (
            <View style={localStyles.paidIndicator}>
              <Text style={localStyles.paidText}>PAGO</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  selectedIndicator: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  selectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  paidIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  paidText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});