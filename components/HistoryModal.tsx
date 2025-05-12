import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { HistoryItem } from '../types';
import { formatCurrency } from '../utils/currencyMask';

interface Props {
  visible: boolean;
  history: HistoryItem[];
  onClose: () => void;
}

export default function HistoryModal({
  visible,
  history,
  onClose
}: Props) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedPerson, setExpandedPerson] = useState<{tableId: string, personIndex: number} | null>(null);
  
  // Agrupar histórico por data
  const groupedHistory = history.reduce((acc, item) => {
    const dateStr = new Date(item.date).toLocaleDateString('pt-BR');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);
  
  // Converter para array para o FlatList
  const groupedHistoryArray = Object.entries(groupedHistory)
    .map(([date, items]) => ({
      date,
      items,
      id: date
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Mais recentes primeiro
  
  const toggleExpand = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };
  
  const togglePersonExpand = (tableId: string, personIndex: number) => {
    if (expandedPerson && expandedPerson.tableId === tableId && expandedPerson.personIndex === personIndex) {
      setExpandedPerson(null);
    } else {
      setExpandedPerson({ tableId, personIndex });
    }
  };
  
  const calculateTotalForDay = (items: HistoryItem[]): number => {
    return items.reduce((sum, item) => {
      return sum + item.people.reduce((personSum, person) => personSum + person.bill, 0);
    }, 0);
  };

  return (
    <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
      <View style={localStyles.modalBox}>
        <Text style={localStyles.modalTitle}>HISTÓRICO DE VENDAS</Text>
        
        {history.length === 0 ? (
          <Text style={localStyles.emptyMessage}>
            Nenhum histórico disponível.
          </Text>
        ) : (
          <FlatList
            data={groupedHistoryArray}
            keyExtractor={(item) => item.id}
            style={localStyles.list}
            renderItem={({ item }) => (
              <View style={localStyles.daySection}>
                <TouchableOpacity 
                  onPress={() => toggleExpand(item.id)}
                  style={localStyles.dateHeader}
                >
                  <Text style={localStyles.dateText}>{item.date}</Text>
                  <View style={localStyles.dateRight}>
                    <Text style={localStyles.totalText}>
                      {formatCurrency(calculateTotalForDay(item.items))}
                    </Text>
                    <Icon 
                      name={expandedItem === item.id ? "arrow-drop-up" : "arrow-drop-down"} 
                      size={24} 
                      color={COLORS.primary} 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedItem === item.id && (
                  <View style={localStyles.tablesList}>
                    {item.items.map((tableItem, index) => (
                      <View key={index} style={localStyles.tableItem}>
                        <Text style={localStyles.tableHeader}>
                          Mesa {tableItem.tableNumber} - {tableItem.tableName}
                        </Text>
                        
                        {tableItem.people.map((person, personIndex) => (
                          <View key={personIndex}>
                            <TouchableOpacity 
                              style={localStyles.personRow}
                              onPress={() => togglePersonExpand(tableItem.id, personIndex)}
                              disabled={!person.orders || person.orders.length === 0}
                            >
                              <View style={localStyles.personInfo}>
                                <Image source={{ uri: person.avatar }} style={localStyles.avatar} />
                                <Text style={localStyles.personName}>{person.name}</Text>
                              </View>
                              <View style={localStyles.personActions}>
                                {person.orders && person.orders.length > 0 && (
                                  <Icon 
                                    name={expandedPerson && expandedPerson.tableId === tableItem.id && expandedPerson.personIndex === personIndex 
                                      ? "arrow-drop-up" 
                                      : "arrow-drop-down"} 
                                    size={20} 
                                    color={COLORS.primary} 
                                    style={localStyles.expandIcon}
                                  />
                                )}
                                <Text style={localStyles.personBill}>
                                  {formatCurrency(person.bill)}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            
                            {expandedPerson && 
                             expandedPerson.tableId === tableItem.id && 
                             expandedPerson.personIndex === personIndex && 
                             person.orders && 
                             person.orders.length > 0 && (
                              <View style={localStyles.productsList}>
                                {person.orders.map((order, orderIndex) => (
                                  <View key={orderIndex} style={localStyles.productItem}>
                                    <View style={localStyles.productInfo}>
                                      <Text style={localStyles.productQuantity}>{order.quantity}x</Text>
                                      <Text style={localStyles.productName}>{order.product.name}</Text>
                                    </View>
                                    <Text style={localStyles.productPrice}>
                                      {formatCurrency(order.product.price * order.quantity)}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        ))}
                        
                        {/* Exibir produtos atribuídos apenas à mesa */}
                        {tableItem.tableProducts && tableItem.tableProducts.length > 0 && (
                          <View style={localStyles.tableProductsSection}>
                            <Text style={localStyles.tableProductsHeader}>Produtos da Mesa:</Text>
                            {tableItem.tableProducts.map((product, productIndex) => (
                              <View key={productIndex} style={localStyles.tableProductItem}>
                                <Text style={localStyles.tableProductName}>{product.name}</Text>
                                <Text style={localStyles.tableProductPrice}>
                                  {formatCurrency(product.price)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                        
                        <View style={localStyles.tableTotal}>
                          <Text style={localStyles.tableTotalLabel}>Total:</Text>
                          <Text style={localStyles.tableTotalValue}>
                            {formatCurrency(tableItem.people.reduce((sum, p) => sum + p.bill, 0))}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
        )}
        
        <TouchableOpacity style={localStyles.closeButton} onPress={onClose}>
          <Text style={localStyles.closeText}>FECHAR</Text>
        </TouchableOpacity>
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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  list: {
    maxHeight: '80%',
  },
  emptyMessage: {
    color: COLORS.primary,
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  daySection: {
    marginBottom: 15,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 10,
    borderRadius: 4,
  },
  dateText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  tablesList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tableItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    paddingBottom: 10,
  },
  tableHeader: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    marginRight: 5,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  personName: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 14,
  },
  personBill: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 14,
  },
  productsList: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
    borderRadius: 4,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productQuantity: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: 12,
    marginRight: 8,
  },
  productName: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: 12,
  },
  productPrice: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: 12,
  },
  tableProductsSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  tableProductsHeader: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  tableProductName: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: 12,
  },
  tableProductPrice: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: 12,
  },
  tableTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  tableTotalLabel: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 10,
  },
  tableTotalValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 15,
  },
  closeText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
});