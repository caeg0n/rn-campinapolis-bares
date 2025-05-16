import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from '../app/styles';
import { BillingModalStyles as styles } from '../styles/BillingModalStyles';
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
  onRemoveProduct?: (personIndex: number, productIndex: number) => void;
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
  onRemoveProduct
}: Props) {
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null);
  const [closeBillMode, setCloseBillMode] = useState(false);

  // Check if person was imported via QR (has any imported orders)
  const isImportedPerson = (person: Person): boolean => {
    return person.orders?.some(order => order.importedViaQR === true) ?? false;
  };

  // Check if order was imported via QR code
  const isImportedOrder = (order: any): boolean => {
    return order.importedViaQR === true;
  };

  // Separate people into local and imported
  const localPeople = people.filter(person => !person.paid && !isImportedPerson(person));
  const importedPeople = people.filter(person => !person.paid && isImportedPerson(person));
  
  // Cálculo do total levando em conta apenas pessoas selecionadas
  const total = selectedPeople.reduce((sum, i) => sum + (people[i]?.bill || 0), 0);

  // Total restante a pagar (todas as pessoas não pagas)
  const remainingTotal = [...localPeople, ...importedPeople].reduce((sum, p) => sum + p.bill, 0);

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

  // Render person section
  const renderPersonSection = (sectionPeople: Person[], sectionTitle: string, iconName: string, iconColor: string) => {
    if (sectionPeople.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Icon name={iconName} size={20} color={iconColor} />
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <Text style={styles.sectionCount}>({sectionPeople.length})</Text>
        </View>
        
        {sectionPeople.map((person, index) => {
          // Find original index in the complete people array
          const originalIndex = people.findIndex(p => p === person);
          
          return (
            <View key={originalIndex} style={styles.sectionPerson}>
              <View style={styles.personRow}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => onToggle(originalIndex)}
                >
                  {isSelected(originalIndex) ? (
                    <Icon name="check-box" size={24} color={COLORS.primary} />
                  ) : (
                    <Icon name="check-box-outline-blank" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.personInfo}
                  onPress={() => toggleExpand(originalIndex)}
                >
                  <Image source={{ uri: person.avatar }} style={styles.avatar} />
                  <View style={styles.personNameContainer}>
                    <Text style={styles.personName}>{person.name}</Text>
                    {isImportedPerson(person) && (
                      <View style={styles.importBadge}>
                        <Icon name="qr-code" size={12} color="#4CAF50" />
                        <Text style={styles.importBadgeText}>IMPORTADO</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                
                <View style={styles.personActions}>
                  {hasOrders(person) && (
                    <TouchableOpacity 
                      onPress={() => toggleExpand(originalIndex)}
                      style={styles.expandButton}
                    >
                      <Icon 
                        name={expandedPerson === originalIndex ? "arrow-drop-up" : "arrow-drop-down"} 
                        size={24} 
                        color={COLORS.primary} 
                      />
                    </TouchableOpacity>
                  )}
                  <Text style={[
                    styles.price, 
                    !isSelected(originalIndex) && styles.priceUnselected
                  ]}>
                    {formatCurrency(person.bill)}
                  </Text>
                </View>
              </View>

              {expandedPerson === originalIndex && hasOrders(person) && (
                <View style={styles.productsList}>
                  {person.orders.map((order, idx) => (
                    <View key={idx} style={[
                      styles.productRow,
                      isImportedOrder(order) && styles.importedProductRow
                    ]}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productQuantity}>{order.quantity}x</Text>
                        <Text style={styles.productName}>{order.product.name}</Text>
                        {isImportedOrder(order) && (
                          <View style={styles.productImportBadge}>
                            <Icon name="qr-code" size={10} color="#4CAF50" />
                            <Text style={styles.productImportText}>QR</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.productActions}>
                        <Text style={styles.productPrice}>
                          {formatCurrency(order.product.price * order.quantity)}
                        </Text>
                        {onRemoveProduct && (
                          <TouchableOpacity 
                            style={styles.removeProductButton}
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
        })}
      </View>
    );
  };

  if (closeBillMode) {
    // Modo de fechamento de conta
    return (
      <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            FECHAR CONTA DA MESA {tableNumber}
          </Text>
          
          <View style={styles.content}>
            {people.map((p, i) => (
              <View key={i}>
                <View style={[
                  styles.personRow,
                  p.paid && styles.paidRow
                ]}>
                  <View style={styles.personInfo}>
                    <Image source={{ uri: p.avatar }} style={styles.avatar} />
                    <View style={styles.personNameContainer}>
                      <Text style={[styles.personName, p.paid && styles.paidName]}>
                        {p.name}
                      </Text>
                      {isImportedPerson(p) && (
                        <View style={styles.closeBillImportBadge}>
                          <Icon name="qr-code" size={10} color="#4CAF50" />
                          <Text style={styles.closeBillImportText}>IMPORTADO</Text>
                        </View>
                      )}
                      {p.paid && (
                        <Text style={styles.paidText}>PAGO</Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.price, p.paid && styles.paidPrice]}>
                    {formatCurrency(p.bill)}
                  </Text>
                  
                  <TouchableOpacity 
                    style={p.paid ? styles.unpaidButton : styles.paidButton}
                    onPress={() => {
                      onSetPersonPaid(i, !p.paid);
                    }}
                  >
                    <Text style={styles.paidButtonText}>
                      {p.paid ? "DESFAZER" : "PG"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.remainingContainer}>
            <Text style={styles.remainingLabel}>Restante a pagar:</Text>
            <Text style={styles.remainingValue}>{formatCurrency(remainingTotal)}</Text>
          </View>
          
          <TouchableOpacity style={styles.voltarButton} onPress={toggleCloseBillMode}>
            <View style={styles.voltarContent}>
              <Icon name="receipt" size={20} color="black" style={styles.voltarIcon} />
              <Text style={styles.voltarText}>VOLTAR</Text>
            </View>
          </TouchableOpacity>
          
          {/* Botão de finalizar mesa - só aparece quando todas as contas estão pagas */}
          {remainingTotal === 0 && (
            <TouchableOpacity 
              style={styles.finishButton}
              onPress={onCloseBill}
            >
              <View style={styles.voltarContent}>
                <Icon name="check-circle" size={20} color="black" style={styles.voltarIcon} />
                <Text style={styles.voltarText}>FINALIZAR MESA</Text>
              </View>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    );
  }

  // Modo de visualização normal da conta com seções separadas
  return (
    <RNModal isVisible={visible} backdropColor="black" backdropOpacity={0.8}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>
          CONTA DA MESA {tableNumber}
        </Text>
        
        <View style={styles.content}>
          {localPeople.length === 0 && importedPeople.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Todas as contas estão pagas. Você pode finalizar a mesa.
            </Text>
          ) : (
            <>
              {/* Section for local people */}
              {renderPersonSection(localPeople, "Clientes da Mesa", "person", COLORS.primary)}
              
              {/* Section for imported people */}
              {renderPersonSection(importedPeople, "Clientes Importados", "qr-code", "#4CAF50")}
            </>
          )}
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>
            TOTAL ({selectedPeople.length} {selectedPeople.length === 1 ? 'pessoa' : 'pessoas'}):
          </Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        
        <TouchableOpacity style={styles.closeBillButton} onPress={toggleCloseBillMode}>
          <View style={styles.voltarContent}>
            <Icon name="payment" size={20} color="black" style={styles.voltarIcon} />
            <Text style={styles.voltarText}>FECHAR CONTA</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>FECHAR</Text>
        </TouchableOpacity>
      </View>
    </RNModal>
  );
}