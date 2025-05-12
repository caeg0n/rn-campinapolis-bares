import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStore } from 'redux';
import { HistoryItem, Product, Table } from './types';

// Produtos padrão
const DEFAULT_PRODUCTS = [
  { name: "Cerveja", price: 5 },
  { name: "Vinho", price: 8 },
  { name: "Coquetel", price: 12 },
  { name: "Refrigerante", price: 3 },
  { name: "Água", price: 2 },
];

interface AppState {
  tables: Table[];
  products: Product[];
  history: HistoryItem[];
}

const INITIAL_STATE: AppState = {
  tables: [],
  products: DEFAULT_PRODUCTS,
  history: [],
};

type Action = 
  | { type: 'SET_TABLES', payload: Table[] }
  | { type: 'SET_PRODUCTS', payload: Product[] }
  | { type: 'SET_HISTORY', payload: HistoryItem[] }
  | { type: 'ADD_HISTORY_ITEM', payload: HistoryItem };

function reducer(state = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case 'SET_TABLES':
      const tablesState = { ...state, tables: action.payload };
      AsyncStorage.setItem('tables', JSON.stringify(action.payload));
      return tablesState;
    
    case 'SET_PRODUCTS':
      const productsState = { ...state, products: action.payload };
      AsyncStorage.setItem('products', JSON.stringify(action.payload));
      return productsState;
      
    case 'SET_HISTORY':
      const historyState = { ...state, history: action.payload };
      AsyncStorage.setItem('table_history', JSON.stringify(action.payload));
      return historyState;
      
    case 'ADD_HISTORY_ITEM':
      const updatedHistory = [...state.history, action.payload];
      const newHistoryState = { ...state, history: updatedHistory };
      AsyncStorage.setItem('table_history', JSON.stringify(updatedHistory));
      return newHistoryState;
      
    default:
      return state;
  }
}

const store = createStore(reducer);

// Carrega os dados do AsyncStorage no início
async function loadInitialData() {
  try {
    // Carregar mesas
    const tablesData = await AsyncStorage.getItem('tables');
    if (tablesData) {
      try {
        const parsed = JSON.parse(tablesData);
        store.dispatch({ type: 'SET_TABLES', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved table state:', e);
      }
    }
    
    // Carregar produtos
    const productsData = await AsyncStorage.getItem('products');
    if (productsData) {
      try {
        const parsed = JSON.parse(productsData);
        store.dispatch({ type: 'SET_PRODUCTS', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved products state:', e);
      }
    }
    
    // Carregar histórico
    const historyData = await AsyncStorage.getItem('table_history');
    if (historyData) {
      try {
        const parsed = JSON.parse(historyData);
        store.dispatch({ type: 'SET_HISTORY', payload: parsed });
      } catch (e) {
        console.error('Failed to parse saved history state:', e);
      }
    }
  } catch (e) {
    console.error('Error loading data from AsyncStorage:', e);
  }
}

loadInitialData();

export default store;