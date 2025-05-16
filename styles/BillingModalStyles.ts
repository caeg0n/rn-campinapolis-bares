// styles/BillingModalStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../app/styles';

export const BillingModalStyles = StyleSheet.create({
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
  
  // Section styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
    flex: 1,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  sectionPerson: {
    marginBottom: 5,
  },
  
  // Person row styles
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
  personNameContainer: {
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
    marginTop: 2,
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
    color: 'rgba(255, 215, 0, 0.5)',
  },
  
  // Import badges
  importBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  importBadgeText: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  closeBillImportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  closeBillImportText: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  
  // Button styles
  paidButton: {
    backgroundColor: 'green',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  unpaidButton: {
    backgroundColor: 'rgba(255, 99, 71, 0.8)',
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
  
  // Product list styles
  productsList: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
    marginLeft: 34,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  importedProductRow: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginVertical: 2,
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
  productImportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  productImportText: {
    color: '#4CAF50',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  
  // Footer styles
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