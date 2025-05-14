// styles/PersonModalStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../app/styles';

export const PersonModalStyles = StyleSheet.create({
  // ... existing styles ...
  
  currentPeopleSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  
  currentPeopleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  
  currentPeopleScrollContainer: {
    maxHeight: 120, // Limit height to show about 3-4 people
  },
  
  currentPeopleList: {
    gap: 8,
  },
  
  currentPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
  },
  
  currentPersonAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  
  currentPersonName: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  paidIcon: {
    marginLeft: 8,
  },
  
  paidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  paidText: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  
  selectionModalBox: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  
  previewSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  
  previewText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  
  tabText: {
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  
  activeTabText: {
    color: 'black',
  },
  
  listContainer: {
    flex: 1,
    minHeight: 200,
  },
  
  flatList: {
    flex: 1,
  },
  
  emptySection: {
    alignItems: 'center',
    padding: 40,
  },
  
  emptyText: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  
  emptySubtext: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  
  avatarOption: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  
  selectedAvatarOption: {
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  
  avatarOptionImage: {
    width: 60,
    height: 60,
  },
  
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 2,
  },
  
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  
  confirmButton: {
    flex: 1,
  },
  
  cancelButton: {
    flex: 1,
  },
  
  avatarButtonsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  
  avatarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  
  buttonIcon: {
    marginRight: 8,
  },
  
  buttonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  disabledButton: {
    opacity: 0.5,
  },
});