// styles/ConfirmationOverlayStyles.ts - Confirmation overlay modal
import { StyleSheet } from 'react-native';
import { COLORS } from '../app/styles';

export const ConfirmationOverlayStyles = StyleSheet.create({
  // Confirmation overlay styles
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 15,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    color: 'rgba(255, 215, 0, 0.8)',
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 20,
  },
  confirmInstruction: {
    fontSize: 12,
    color: '#FFA500',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 16,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelConfirmButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelConfirmButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  proceedConfirmButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  proceedConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});