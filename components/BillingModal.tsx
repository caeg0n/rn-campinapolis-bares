import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { Person } from '../types';
import { formatCurrency } from '../utils/currencyMask';

interface Props {
  visible: boolean;
  tableNumber: string;
  people: Person[];
  selectedPeople: number[];
  onToggle: (i: number) => void;
  onClose: () => void;
  onClosePerson?: (i: number) => void;
  onSetPersonPaid: (index: number, isPaid: boolean) => void;
  onCloseBill: () => void;
  onRemoveProduct?: (personIndex: number, productIndex: number) => void; // New prop
}

export default function BillingModal({
  visible,
  tableNumber,
  people,
  selectedPeople,
  onToggle,
  onClose,
  onClosePerson,
  onSetPersonPaid,
  onCloseBill,
  onRemoveProduct  // New prop
}: Props) {
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null);
  const [closeBillMode, setCloseBillMode] = useState(false);

  // Pessoas que não estão marcadas como pagas
  const activePeople = people.filter(person => !person.paid);
  
  // Cálculo do total levando em conta apenas pessoas selecionadas
  const total = selectedPeople.reduce((sum, i) => sum + (people[i]?.bill || 0), 0);

  // Total restante a pagar (todas as pessoas não pagas)
  const remainingTotal = activePeople.reduce((sum, p) => sum + p.bill, 0);

  const toggleExpand = (index: number) => {
    if (expandedPerson === index) {
      setExpandedPerson(null);
    } else {
      setExpandedPerson(index);
    }
  };

  // Verificar se a pessoa tem pedidos para mostrar o botão de expandir
  const hasOrders = (person: Person): boolean => {
    return person.orders && person.orders.length > 0;
  };

  const toggleCloseBillMode = () => {
    setCloseBillMode(!closeBillMode);
  };

  // Verifica se uma pessoa está selecionada
  const isSelected = (index: number): boolean => {
    return selectedPeople.includes(index);
  };

  if (closeBillMode) {
    // Modo de fechamento de conta
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={localStyles.modalBox}>
          <Text style={localStyles.modalTitle}>
            FECHAR CONTA DA MESA {tableNumber}
          </Text>
          
          <View style={localStyles.content}>
            {people.map((p, i) => (
              <View key={i}>
                <View style={[
                  localStyles.personRow,
                  p.paid && localStyles.paidRow
                ]}>
                  <View style={localStyles.personInfo}>
                    <Image source={{ uri: p.avatar }} style={localStyles.avatar} />
                    <Text style={[localStyles.personName, p.paid && localStyles.paidName]}>
                      {p.name}
                    </Text>
                    {p.paid && (
                      <Text style={localStyles.paidText}>PAGO</Text>
                    )}
                  </View>
                  <Text style={[localStyles.price, p.paid && localStyles.paidPrice]}>
                    {formatCurrency(p.bill)}
                  </Text>
                  
                  <TouchableOpacity 
                    style={p.paid ? localStyles.unpaidButton : localStyles.paidButton}
                    onPress={() => {
                      onSetPersonPaid(i, !p.paid);
                    }}
                  >
                    <Text style={localStyles.paidButtonText}>
                      {p.paid ? "DESFAZER" : "PG"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          
          <View style={localStyles.remainingContainer}>
            <Text style={localStyles.remainingLabel}>Restante a pagar:</Text>
            <Text style={localStyles.remainingValue}>{formatCurrency(remainingTotal)}</Text>
          </View>
          
          <TouchableOpacity style={localStyles.voltarButton} onPress={toggleCloseBillMode}>
            <View style={localStyles.voltarContent}>
              <Icon name="receipt" size={20} color="black" style={localStyles.voltarIcon} />
              <Text style={localStyles.voltarText}>VOLTAR</Text>
            </View>
          </TouchableOpacity>
          
          {/* Botão de finalizar mesa - só aparece quando todas as contas estão pagas */}
          {remainingTotal === 0 && (
            <TouchableOpacity 
              style={localStyles.finishButton}
              onPress={onCloseBill}
            >
              <View style={localStyles.voltarContent}>
                <Icon name="check-circle" size={20} color="black" style={localStyles.voltarIcon} />
                <Text style={localStyles.voltarText}>FINALIZAR MESA</Text>
              </View>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={localStyles.cancelButton} onPress={onClose}>
            <Text style={localStyles.cancelText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    );
  } else {
    // Modo de visualização normal da conta
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={localStyles.modalBox}>
          <Text style={localStyles.modalTitle}>
            CONTA DA MESA {tableNumber}
          </Text>
          
          <View style={localStyles.content}>
            {activePeople.length === 0 ? (
              <Text style={localStyles.emptyMessage}>
                Todas as contas estão pagas. Você pode finalizar a mesa.
              </Text>
            ) : (
              activePeople.map((p, i) => {
                // Encontrar o índice original na lista completa
                const originalIndex = people.findIndex(person => person === p);
                return (
                  <View key={originalIndex}>
                    <View style={localStyles.personRow}>
                      <TouchableOpacity 
                        style={localStyles.checkbox}
                        onPress={() => onToggle(originalIndex)}
                      >
                        {isSelected(originalIndex) ? (
                          <Icon name="check-box" size={24} color={COLORS.primary} />
                        ) : (
                          <Icon name="check-box-outline-blank" size={24} color={COLORS.primary} />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={localStyles.personInfo}
                        onPress={() => toggleExpand(originalIndex)}
                      >
                        <Image source={{ uri: p.avatar }} style={localStyles.avatar} />
                        <Text style={localStyles.personName}>{p.name}</Text>
                      </TouchableOpacity>
                      
                      <View style={localStyles.personActions}>
                        {hasOrders(p) && (
                          <TouchableOpacity 
                            onPress={() => toggleExpand(originalIndex)}
                            style={localStyles.expandButton}
                          >
                            <Icon 
                              name={expandedPerson === originalIndex ? "arrow-drop-up" : "arrow-drop-down"} 
                              size={24} 
                              color={COLORS.primary} 
                            />
                          </TouchableOpacity>
                        )}
                        <Text style={[
                          localStyles.price, 
                          !isSelected(originalIndex) && localStyles.priceUnselected
                        ]}>
                          {formatCurrency(p.bill)}
                        </Text>
                      </View>
                    </View>

                    {expandedPerson === originalIndex && hasOrders(p) && (
                      <View style={localStyles.productsList}>
                        {p.orders.map((order, idx) => (
                          <View key={idx} style={localStyles.productRow}>
                            <View style={localStyles.productInfo}>
                              <Text style={localStyles.productQuantity}>{order.quantity}x</Text>
                              <Text style={localStyles.productName}>{order.product.name}</Text>
                            </View>
                            <View style={localStyles.productActions}>
                              <Text style={localStyles.productPrice}>
                                {formatCurrency(order.product.price * order.quantity)}
                              </Text>
                              {onRemoveProduct && (
                                <TouchableOpacity 
                                  style={localStyles.removeProductButton}
                                  onPress={() => onRemoveProduct(originalIndex, idx)}
                                >
                                  <Icon name="delete" size={18} color="#ff4444" />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
          
          <View style={localStyles.totalContainer}>
            <Text style={localStyles.totalLabel}>
              TOTAL ({selectedPeople.length} {selectedPeople.length === 1 ? 'pessoa' : 'pessoas'}):
            </Text>
            <Text style={localStyles.totalValue}>{formatCurrency(total)}</Text>
          </View>
          
          <TouchableOpacity style={localStyles.closeBillButton} onPress={toggleCloseBillMode}>
            <View style={localStyles.voltarContent}>
              <Icon name="payment" size={20} color="black" style={localStyles.voltarIcon} />
              <Text style={localStyles.voltarText}>FECHAR CONTA</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={localStyles.cancelButton} onPress={onClose}>
            <Text style={localStyles.cancelText}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    );
  }
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
  content: {
    marginBottom: 15,
    maxHeight: '60%',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
  },
  paidRow: {
    backgroundColor: 'rgba(0, 128, 0, 0.1)',
    borderRadius: 4,
  },
  checkbox: {
    marginRight: 10,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  personActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButton: {
    padding: 4,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 10,
  },
  personName: {
    color: COLORS.primary,
    fontSize: 14,
  },
  paidName: {
    color: '#00c853',
  },
  paidText: {
    fontSize: 12,
    color: '#00c853',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  price: {
    color: COLORS.primary,
    fontSize: 14,
    marginLeft: 5,
  },
  paidPrice: {
    color: '#00c853',
  },
  priceUnselected: {
    color: 'rgba(255, 215, 0, 0.5)', // Opacidade reduzida para preços de pessoas não selecionadas
  },
  paidButton: {
    backgroundColor: 'green',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  unpaidButton: {
    backgroundColor: 'rgba(255, 99, 71, 0.8)', // Vermelho acinzentado para desfazer
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  paidButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productsList: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    marginLeft: 34, // Alinhado com o avatar
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productQuantity: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 12,
    marginRight: 8,
  },
  productName: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 12,
    flex: 1,
  },
  productPrice: {
    color: 'rgba(255, 215, 0, 0.8)',
    fontSize: 12,
    marginRight: 10,
  },
  removeProductButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  remainingContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  remainingLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  remainingValue: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  totalLabel: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalValue: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  voltarButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeBillButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  finishButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  voltarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voltarIcon: {
    marginRight: 8,
  },
  voltarText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
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
  },
  emptyMessage: {
    color: COLORS.primary,
    textAlign: 'center',
    padding: 10,
  },
});