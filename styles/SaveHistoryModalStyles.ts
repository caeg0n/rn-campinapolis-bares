import { StyleSheet } from 'react-native';
import { COLORS } from '../app/styles';

export const SaveHistoryModalStyles = StyleSheet.create({
  modalBox: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  message: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  confirmButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50', // Green color for the SIM button
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white', // White text for better contrast with green background
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
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
  }
});