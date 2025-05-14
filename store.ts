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
  { name: "Burgcamp", price: 26 },
  { name: "X-Tudo Duplo", price: 35 },
  { name: "X-Tudo", price: 24 },
  { name: "X-Bagunça", price: 20 },
  { name: "X-Bacon", price: 20 },
  { name: "X-Salada", price: 18 },
  { name: "X-Salada Especial", price: 20 },
  { name: "X-Kids", price: 15 },
  { name: "Bauru", price: 15 },
  { name: "Filé Mignon", price: 24 },
  { name: "Filé Frango", price: 22 },
  { name: "Paulista", price: 26 },
  { name: "Pantaneiro", price: 26 },
  { name: "Hambúrguer (extra)", price: 4 },
  { name: "Calabresa (extra)", price: 4 },
  { name: "Bacon (extra)", price: 4 },
  { name: "Salsicha (extra)", price: 4 },
  { name: "Ovo (extra)", price: 4 },
  { name: "Catupiry (extra)", price: 4 },
  { name: "Abacaxi (extra)", price: 4 },
  { name: "Maionese Verde (extra)", price: 1 },
  { name: "Batata Frita 300g", price: 20 },
  { name: "Batata Frita Especial 300g", price: 30 },
  { name: "Mandioca Frita 300g", price: 25 },
  { name: "Costela Tambaqui 450g", price: 56 },
  { name: "Camafreu 450g", price: 85 },
  { name: "Panceta 350g", price: 60 },
  { name: "Bolinho de Costela 350g", price: 60 },
  { name: "Torresmo 100g", price: 25 },
  { name: "Frango a Passarinho 500g", price: 40 },
  { name: "Filé Tilápia 500g", price: 70 },
  { name: "Isca de Frango 300g", price: 55 },
  { name: "Arroz", price: 10 },
  { name: "Feijão Tropeiro", price: 10 },
  { name: "Maionese", price: 10 },
  { name: "Mandioca", price: 8 },
  { name: "Vinagrete", price: 10 },
  { name: "Coca-Cola (lata)", price: 5 },
  { name: "Coca-Cola Zero (lata)", price: 5 },
  { name: "Guaraná Antarctica (lata)", price: 5 },
  { name: "Fanta Laranja (lata)", price: 5 },
  { name: "Refrigerante 1,5 L", price: 14 },
  { name: "Suco 1 L", price: 12 },
  { name: "Suco 100 % Uva 1 L", price: 18 },
  { name: "Água de Coco 1 L", price: 20 },
  { name: "Água sem gás", price: 4 },
  { name: "Água com gás", price: 5 },
  { name: "Suco 200 ml", price: 5 },
  { name: "H2O", price: 8 },
  { name: "H2O Limonete", price: 8 },
  { name: "Cerveja lata (Brahma/Antarctica/Skol)", price: 5 },
  { name: "Cerveja lata Original", price: 6 },
  { name: "Long Neck Coronita/Budweiser", price: 10 },
  { name: "Long Neck Skol Beats/Estella Artois", price: 12 },
  { name: "Long Neck Heineken", price: 12 },
  { name: "Garrafa 600 ml (Brahma/Antarctica/Skol)", price: 12 },
  { name: "Garrafa 600 ml Original", price: 14 },
  { name: "Garrafa 600 ml Heineken", price: 18 },
  { name: "Chopp Brahma", price: 10 },
  { name: "Mansão Maromba e Gelo (combo)", price: 60 },
  { name: "Red Label (combo)", price: 300 },
  { name: "Old Parr (combo)", price: 350 },
  { name: "Dose Campari", price: 15 },
  { name: "Dose White Horse", price: 15 },
  { name: "Dose Red Label", price: 20 },
  { name: "Dose Old Parr", price: 30 },
  { name: "Ice", price: 14 },
  { name: "Copo com Gelo", price: 0.5 },
  { name: "Copo Especial", price: 2 },
  { name: "CDB", price: 3 },
  { name: "Cozumel", price: 5 },
  { name: "Trident", price: 4 },
  { name: "Halls", price: 4 },
  { name: "Balde de Gelo", price: 12 },
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