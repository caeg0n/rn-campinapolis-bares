// export interface Product {
//   name: string;
//   price: number;
// }

// export interface OrderItem {
//   product: Product;
//   quantity: number;
// }

// export interface Person {
//   name: string;
//   avatar: string; // This can be a URL or base64 string
//   bill: number;
//   orders: OrderItem[];
//   paid?: boolean;  // propriedade para marcar se a pessoa pagou
// }

// export interface Table {
//   id: number;
//   enabled: boolean;
//   name: string;
//   number: string;
//   people: Person[];
//   products: Product[]; // produtos atribuídos apenas à mesa
// }

// // Interface atualizada para o histórico
// export interface HistoryItem {
//   id: string;
//   date: number; // timestamp
//   tableId: number;
//   tableNumber: string;
//   tableName: string;
//   people: Person[]; // Inclui todas as informações da pessoa, inclusive orders
//   tableProducts: Product[]; // Produtos atribuídos apenas à mesa (sem pessoa específica)
// }

// // Interfaces para a funcionalidade de câmera
// export interface CameraProps {
//   onClose: () => void;
//   onTakePicture: (base64Image: string) => void;
// }

// export interface ImageDimensions {
//   width: number;
//   height: number;
// }

// // Interface para o PersonModal com fotos tiradas
// export interface PersonModalProps {
//   visible: boolean;
//   avatar: string;
//   name: string;
//   onChangeAvatar: () => void;
//   onChangeName: (name: string) => void;
//   onCustomAvatar?: (base64Image: string) => void;
//   onSave: () => void;
//   onCancel: () => void;
//   people: Person[];
//   takenPhotos?: string[]; // Array de fotos base64 tiradas anteriormente
// }
export interface Product {
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  importedViaQR?: boolean; // Flag to indicate if the order was imported via QR code
}

export interface Person {
  name: string;
  avatar: string; // This can be a URL or base64 string
  bill: number;
  orders: OrderItem[];
  paid?: boolean;  // propriedade para marcar se a pessoa pagou
}

export interface Table {
  id: number;
  enabled: boolean;
  name: string;
  number: string;
  people: Person[];
  products: Product[]; // produtos atribuídos apenas à mesa
}

// Interface atualizada para o histórico
export interface HistoryItem {
  id: string;
  date: number; // timestamp
  tableId: number;
  tableNumber: string;
  tableName: string;
  people: Person[]; // Inclui todas as informações da pessoa, inclusive orders
  tableProducts: Product[]; // Produtos atribuídos apenas à mesa (sem pessoa específica)
}

// Interfaces para a funcionalidade de câmera
export interface CameraProps {
  onClose: () => void;
  onTakePicture: (base64Image: string) => void;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

// Interface para o PersonModal com fotos tiradas
export interface PersonModalProps {
  visible: boolean;
  avatar: string;
  name: string;
  onChangeAvatar: () => void;
  onChangeName: (name: string) => void;
  onCustomAvatar?: (base64Image: string) => void;
  onSave: () => void;
  onCancel: () => void;
  people: Person[];
  takenPhotos?: string[]; // Array de fotos base64 tiradas anteriormente
}