// import { Dimensions, StyleSheet } from 'react-native';

// const { width } = Dimensions.get('window');
// const cellSize = (width - 32 - 32) / 4;

// export const COLORS = {
//   primary: '#FFD700', // Yellow
//   secondary: '#000000', // Black
//   text: '#FFD700',
//   background: '#0D0D0D',
//   card: '#1A1A1A',
//   highlight: '#FFD700',
//   disabled: '#333333',
//   accent: '#FFD700',
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.background },
//   header: {
//     backgroundColor: COLORS.primary,
//     padding: 16,
//     alignItems: 'center',
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.secondary,
//   },
//   grid: { padding: 16, alignItems: 'center' },
//   cell: { width: cellSize, height: cellSize, margin: 8 },
//   cellInner: {
//     flex: 1,
//     borderRadius: 8,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.card,
//   },
//   cellBg: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cellText: { fontSize: 22, fontWeight: 'bold' },
//   cellSub: { fontSize: 14, marginTop: 4 },
//   modalBox: {
//     backgroundColor: COLORS.card,
//     padding: 20,
//     borderRadius: 8,
//     margin: 20,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: COLORS.primary,
//     textAlign: 'center',
//     textTransform: 'uppercase',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 4,
//     padding: 12,
//     marginVertical: 8,
//     color: COLORS.primary,
//     backgroundColor: COLORS.secondary,
//   },
//   btn: {
//     backgroundColor: COLORS.primary,
//     padding: 14,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   btnText: {
//     color: COLORS.secondary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelBtn: {
//     backgroundColor: 'transparent',
//     padding: 14,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   cancelBtnText: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   link: {
//     color: COLORS.primary,
//     marginVertical: 8,
//     textAlign: 'center',
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginVertical: 12,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     alignSelf: 'center',
//   },
//   smallAvatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 8,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: COLORS.secondary,
//     margin: 8,
//     padding: 12,
//     alignItems: 'center',
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: COLORS.primary,
//   },
//   cardPrice: {
//     fontSize: 16,
//     color: COLORS.primary,
//     marginTop: 8,
//     fontWeight: 'bold',
//   },
//   toggle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.primary,
//     alignItems: 'center',
//   },
//   toggleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   selected: {
//     backgroundColor: COLORS.secondary,
//     borderRadius: 4,
//   },
//   toggleText: {
//     fontSize: 16,
//     color: COLORS.primary,
//   },
//   togglePrice: {
//     fontSize: 16,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//   },
//   totalContainer: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 4,
//     marginTop: 16,
//   },
//   total: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.secondary,
//     textAlign: 'center',
//   },
//   fabRow: {
//     position: 'absolute',
//     bottom: 24,
//     right: 24,
//     flexDirection: 'row',
//   },
//   fab: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 28,
//     padding: 16,
//     marginLeft: 12,
//     elevation: 5,
//   },
// });

// export default styles;
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const cellSize = (width - 32 - 32) / 4;

export const COLORS = {
  primary: '#FFD700', // Yellow
  secondary: '#000000', // Black
  text: '#FFD700',
  background: '#0D0D0D',
  card: '#1A1A1A',
  highlight: '#FFD700',
  disabled: '#333333',
  accent: '#FFD700',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  grid: { padding: 16, alignItems: 'center' },
  cell: { width: cellSize, height: cellSize, margin: 8 },
  cellInner: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  cellBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  cellText: { 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  cellSub: { 
    fontSize: 14, 
    marginTop: 4,
    textAlign: 'center'
  },
  modalBox: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 8,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
    color: COLORS.primary,
    backgroundColor: COLORS.secondary,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    marginVertical: 8,
    textAlign: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignSelf: 'center',
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    margin: 8,
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
  },
  cardPrice: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 8,
    fontWeight: 'bold',
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  togglePrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  fabRow: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
  },
  fab: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    padding: 16,
    marginLeft: 12,
    elevation: 5,
  },
});

export default styles;