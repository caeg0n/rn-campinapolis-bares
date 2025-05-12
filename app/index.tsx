import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNModal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import BillingModal from "../components/BillingModal";
import BottomMenu from "../components/BottomMenu";
import ConfigModal from "../components/ConfigModal";
import FloatingActions from "../components/FloatingActions";
import HistoryModal from "../components/HistoryModal";
import PersonModal from "../components/PersonModal";
import ProductFormModal from "../components/ProductFormModal";
import ProductModal from "../components/ProductModal";
import ResetTableModal from "../components/ResetTableModal";
import SaveHistoryModal from "../components/SaveHistoryModal";
import TableCell from "../components/TableCell";
import { usePersistentPhotos } from "../hooks/usePersistentPhotos";
import { HistoryItem, OrderItem, Product, Table } from "../types";
import { formatCurrency } from "../utils/currencyMask";
import styles, { COLORS } from "./styles";

const TOTAL_TABLES = 16;
const AVATAR_PLACEHOLDER = "https://i.pravatar.cc/100?img=";
const HISTORY_STORAGE_KEY = "table_history";
const TAKEN_PHOTOS_STORAGE_KEY = "taken_photos";

// Produtos padrão
const DEFAULT_PRODUCTS = [
  { name: "Cerveja", price: 5 },
  { name: "Vinho", price: 8 },
  { name: "Coquetel", price: 12 },
  { name: "Refrigerante", price: 3 },
  { name: "Água", price: 2 },
];

// Verificar se todas as pessoas de uma mesa pagaram
const isTableFullyPaid = (table: Table): boolean => {
  return table.people.length > 0 && table.people.every((person) => person.paid);
};

export default function App() {
  const tables: Table[] = useSelector((state: any) => state.tables);
  const storedProducts: Product[] = useSelector(
    (state: any) => state.products || DEFAULT_PRODUCTS
  );
  const dispatch = useDispatch();

  const setTables = useCallback(
    (payload: Table[]) => dispatch({ type: "SET_TABLES", payload }),
    [dispatch]
  );

  const setProducts = useCallback(
    (payload: Product[]) => dispatch({ type: "SET_PRODUCTS", payload }),
    [dispatch]
  );

  const [current, setCurrent] = useState<Table | null>(null);
  const [configVisible, setConfigVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [personVisible, setPersonVisible] = useState(false);
  const [productVisible, setProductVisible] = useState(false);
  const [productFormVisible, setProductFormVisible] = useState(false);
  const [billingVisible, setBillingVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [resetTableVisible, setResetTableVisible] = useState(false);
  const [saveHistoryVisible, setSaveHistoryVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [tableToReset, setTableToReset] = useState<Table | null>(null);
  const [tableToSaveHistory, setTableToSaveHistory] = useState<Table | null>(
    null
  );
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [configName, setConfigName] = useState("");
  const [configNumber, setConfigNumber] = useState("");
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonAvatar, setNewPersonAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [products, setProductsState] = useState<Product[]>(storedProducts);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [takenPhotos, setTakenPhotos] = useState<string[]>([]);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const {
    isLoading: photosLoading,
    error: photosError,
    addPhoto,
    removePhoto,
    clearAllPhotos,
    getPhotoStats,
  } = usePersistentPhotos();

  // Carregar histórico do AsyncStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (historyData) {
          const parsedHistory = JSON.parse(historyData);
          setHistory(parsedHistory);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    loadHistory();
  }, []);

  // Atualiza os produtos locais quando os produtos no store mudarem
  useEffect(() => {
    setProductsState(storedProducts);
  }, [storedProducts]);

  // Atualiza a mesa atual quando as mesas mudarem
  useEffect(() => {
    if (current && current.id) {
      const updatedTable = tables.find((t) => t.id === current.id);
      if (updatedTable) {
        setCurrent(updatedTable);
      }
    }
  }, [tables]);

  // Verifica se todas as pessoas têm o array orders inicializado
  useEffect(() => {
    if (tables.length > 0) {
      let needsUpdate = false;

      const updatedTables = tables.map((table) => {
        if (table.people && table.people.length > 0) {
          const updatedPeople = table.people.map((person) => {
            if (!person.orders) {
              needsUpdate = true;
              return { ...person, orders: [], paid: false };
            }
            if (person.paid === undefined) {
              needsUpdate = true;
              return { ...person, paid: false };
            }
            return person;
          });

          if (needsUpdate) {
            return { ...table, people: updatedPeople };
          }
        }
        return table;
      });

      if (needsUpdate) {
        console.log(
          "Atualizando mesas para garantir que todas as pessoas tenham orders[] e paid"
        );
        setTables(updatedTables);
      }
    }
  }, [tables]);

  useEffect(() => {
    if (!tables.length && !initialized) {
      setTables(
        Array.from({ length: TOTAL_TABLES }).map((_, idx) => ({
          id: idx + 1,
          enabled: false,
          name: "",
          number: "",
          people: [],
          products: [],
        }))
      );
      setInitialized(true);
    }
  }, [tables.length, initialized]);

  useEffect(() => {
    if (tables.some((t) => t.enabled)) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [tables, glowAnim]);

  useEffect(() => {
    const loadTakenPhotos = async () => {
      try {
        const photosData = await AsyncStorage.getItem(TAKEN_PHOTOS_STORAGE_KEY);
        if (photosData) {
          const parsedPhotos = JSON.parse(photosData);
          console.log("Fotos carregadas:", parsedPhotos.length); // Log para debug
          setTakenPhotos(parsedPhotos);
        }
      } catch (error) {
        console.error("Erro ao carregar fotos:", error);
      }
    };
    loadTakenPhotos();
  }, []);

  const saveTakenPhotosToStorage = async (photos: string[]) => {
    try {
      await AsyncStorage.setItem(
        TAKEN_PHOTOS_STORAGE_KEY,
        JSON.stringify(photos)
      );
      console.log("Fotos salvas:", photos.length); // Log para debug
    } catch (error) {
      console.error("Erro ao salvar fotos:", error);
    }
  };

  const handleTablePress = (table: Table) => {
    // Se a mesa não estiver habilitada, abre a configuração
    if (!table.enabled) {
      setConfigName(table.name);
      setConfigNumber(table.number);
      setCurrent(table);
      setConfigVisible(true);
      return;
    }

    // Se a mesa estiver habilitada
    if (current && current.id === table.id) {
      // Se for a mesa já selecionada, desmarca
      setCurrent(null);
    } else {
      // Seleciona a mesa
      setCurrent(table);
    }
  };

  const handlePhotoTaken = (base64Image: string) => {
    setCustomAvatar(base64Image);

    // IMPORTANTE: Adicionar à lista de fotos IMEDIATAMENTE
    setTakenPhotos((prev) => {
      const newPhotos = [...prev];
      if (!newPhotos.includes(base64Image)) {
        newPhotos.push(base64Image);
        // Salvar no AsyncStorage imediatamente
        saveTakenPhotosToStorage(newPhotos);
      }
      return newPhotos;
    });
  };

  const handleTableLongPress = (table: Table) => {
    if (!table.enabled) return;

    // Se a mesa estiver totalmente paga, perguntar se quer salvar no histórico
    if (isTableFullyPaid(table)) {
      setTableToSaveHistory(table);
      setSaveHistoryVisible(true);
    } else {
      // Caso contrário, apenas mostra o modal de reset
      setTableToReset(table);
      setResetTableVisible(true);
    }
  };

  // Salvar mesa no histórico
  const saveTableToHistory = async () => {
    if (!tableToSaveHistory) return;

    // Cria uma cópia completa dos dados da mesa, incluindo todos os detalhes das pessoas
    // e seus produtos (orders)
    const historyItem: HistoryItem = {
      id: `${tableToSaveHistory.id}_${Date.now()}`,
      date: Date.now(),
      tableId: tableToSaveHistory.id,
      tableNumber: tableToSaveHistory.number,
      tableName: tableToSaveHistory.name,
      people: JSON.parse(JSON.stringify(tableToSaveHistory.people)), // Cópia profunda para garantir que todos os dados sejam preservados
      tableProducts: [...tableToSaveHistory.products], // Produtos atribuídos à mesa
    };

    // Adicionar ao histórico local
    const updatedHistory = [...history, historyItem];
    setHistory(updatedHistory);

    // Salvar no AsyncStorage
    try {
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }

    // Resetar a mesa
    const tableToResetNow = tableToSaveHistory;

    const updated = tables.map((t) =>
      t.id === tableToResetNow.id
        ? {
            ...t,
            enabled: false,
            name: "",
            number: "",
            people: [],
            products: [],
          }
        : t
    );

    setTables(updated);

    // Fechar o modal
    setSaveHistoryVisible(false);
    setTableToSaveHistory(null);

    // Se a mesa resetada era a atual, desmarca
    if (current && current.id === tableToResetNow.id) {
      setCurrent(null);
    }
  };

  const cancelSaveHistory = () => {
    setSaveHistoryVisible(false);
    setTableToSaveHistory(null);
  };

  const handleResetTable = () => {
    // Usar a variável diretamente, sem 'this'
    const tableToResetNow = tableToSaveHistory || tableToReset;
    if (!tableToResetNow) return;

    const updated = tables.map((t) =>
      t.id === tableToResetNow.id
        ? {
            ...t,
            enabled: false,
            name: "",
            number: "",
            people: [],
            products: [],
          }
        : t
    );

    setTables(updated);
    setResetTableVisible(false);
    setTableToReset(null);
    setTableToSaveHistory(null);

    // Se a mesa resetada era a atual, desmarca
    if (current && current.id === tableToResetNow.id) {
      setCurrent(null);
    }
  };

  const handleSetPersonPaid = (
    tableId: number,
    personIndex: number,
    isPaid: boolean
  ) => {
    console.log(
      `Alterando estado de pagamento: mesa=${tableId}, pessoa=${personIndex}, pago=${isPaid}`
    );
    const updated = tables.map((t) => {
      if (t.id !== tableId) return t;
      const people = t.people.map((p, i) => {
        if (i !== personIndex) return p;
        return { ...p, paid: isPaid };
      });

      return { ...t, people };
    });
    setTables(updated);
    if (current && current.id === tableId) {
      const updatedCurrent = { ...current };
      updatedCurrent.people = updatedCurrent.people.map((p, i) => {
        if (i !== personIndex) return p;
        return { ...p, paid: isPaid };
      });
      setCurrent(updatedCurrent);
    }
  };

  const handleCloseBill = () => {
    if (!current) return;

    // Verifica se todas as pessoas estão marcadas como pagas
    const allPaid = current.people.every((person) => person.paid);

    if (allPaid) {
      // Se todos já estão pagos, perguntar se quer salvar no histórico
      setTableToSaveHistory(current);
      setSaveHistoryVisible(true);
    } else {
      // Marca todas as pessoas como pagas
      const updated = tables.map((t) => {
        if (t.id !== current.id) return t;

        const people = t.people.map((p) => ({ ...p, paid: true }));

        return { ...t, people };
      });

      setTables(updated);
    }

    // Fecha o modal de conta
    setBillingVisible(false);
  };

  const handleViewHistory = () => {
    setHistoryVisible(true);
  };

  const saveConfig = () => {
    if (!configNumber || !current) return;
    const updated = tables.map((t) =>
      t.id === current.id
        ? { ...t, enabled: true, name: configName, number: configNumber }
        : t
    );
    setTables(updated);
    setConfigVisible(false);
  };

  const openEdit = () => {
    if (!current) return;
    setConfigName(current.name);
    setConfigNumber(current.number);
    setEditVisible(true);
  };

  const saveEdit = () => {
    if (!current) return;
    const updated = tables.map((t) =>
      t.id === current.id ? { ...t, name: configName, number: configNumber } : t
    );
    setTables(updated);
    setEditVisible(false);
  };

  const clearTakenPhotos = async () => {
    try {
      await AsyncStorage.removeItem(TAKEN_PHOTOS_STORAGE_KEY);
      setTakenPhotos([]);
    } catch (error) {
      console.error("Erro ao limpar fotos:", error);
    }
  };

  const handleClearPhotos = () => {
    Alert.alert("Limpar Fotos", "Deseja remover todas as fotos tiradas?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sim", onPress: clearTakenPhotos },
    ]);
  };

  const openPerson = () => {
    setNewPersonName("");
    setNewPersonAvatar(AVATAR_PLACEHOLDER + Math.floor(Math.random() * 70 + 1));
    setCustomAvatar(null); // Reset custom avatar when opening modal
    setPersonVisible(true);
  };

  const savePerson = () => {
    if (!newPersonName || !current) return;
    // Use the custom avatar if available, otherwise use the generated one
    const avatarToUse = customAvatar || newPersonAvatar;
    // Se for uma foto tirada (base64), adicionar à lista de fotos IMEDIATAMENTE
    if (customAvatar && customAvatar.startsWith("data:image")) {
      // Primeiro atualizar o estado
      setTakenPhotos((prev) => {
        const newPhotos = [...prev];
        // Evitar duplicatas
        if (!newPhotos.includes(customAvatar)) {
          newPhotos.push(customAvatar);
          // Salvar imediatamente no AsyncStorage
          saveTakenPhotosToStorage(newPhotos);
        }
        return newPhotos;
      });
    }
    const updated = tables.map((t) =>
      t.id === current.id
        ? {
            ...t,
            people: [
              ...t.people,
              {
                name: newPersonName,
                avatar: avatarToUse,
                bill: 0.0,
                orders: [],
                paid: false,
              },
            ],
          }
        : t
    );
    setTables(updated);
    setPersonVisible(false);
  };

  const handleManagePhotos = () => {
    const stats = getPhotoStats();

    Alert.alert(
      "Gerenciar Fotos",
      `Total: ${stats.totalPhotos} fotos\nTamanho: ${stats.totalSizeKB} KB`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Todas",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmar",
              "Deseja realmente remover todas as fotos tiradas?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", onPress: clearAllPhotos },
              ]
            );
          },
        },
      ]
    );
  };

  const startAssignProduct = (prod: Product) => {
    if (!current) return;
    console.log(
      `Produto selecionado: ${prod.name} - ${formatCurrency(prod.price)}`
    );
    setPendingProduct(prod);
    setAssignVisible(true);
  };
  const assignProductToPerson = (index: number) => {
    if (!current || !pendingProduct) return;

    const updated = tables.map((t) => {
      if (t.id !== current.id) return t;

      const people = t.people.map((p, i) => {
        if (i !== index) return p;

        // Garante que orders existe
        const currentOrders = p.orders || [];

        // Verificar se a pessoa já tem este produto
        const existingOrderIndex = currentOrders.findIndex(
          (order) => order.product.name === pendingProduct.name
        );

        let newOrders: OrderItem[] = [...currentOrders];

        if (existingOrderIndex >= 0) {
          // Incrementar a quantidade se o produto já existe
          newOrders[existingOrderIndex] = {
            ...newOrders[existingOrderIndex],
            quantity: newOrders[existingOrderIndex].quantity + 1,
          };
        } else {
          // Adicionar novo produto se não existe
          newOrders.push({
            product: pendingProduct,
            quantity: 1,
          });
        }

        return {
          ...p,
          bill: p.bill + pendingProduct.price,
          orders: newOrders,
          paid: false, // Quando adiciona produto, marca como não pago
        };
      });

      return { ...t, people };
    });

    setTables(updated);
    setAssignVisible(false);
    setPendingProduct(null);
  };

  const assignProductToTableOnly = () => {
    if (!current || !pendingProduct) return;
    const updated = tables.map((t) =>
      t.id === current.id
        ? { ...t, products: [...t.products, pendingProduct] }
        : t
    );
    setTables(updated);
    setAssignVisible(false);
    setPendingProduct(null);
  };

  const openBilling = () => {
    if (!current) return;

    // Certifica-se de que estamos usando os dados mais recentes do store
    const freshTable = tables.find((t) => t.id === current.id);
    if (freshTable) {
      // Seleciona apenas pessoas não pagas
      const nonPaidIndices = freshTable.people
        .map((person, index) => ({ person, index }))
        .filter((item) => !item.person.paid)
        .map((item) => item.index);

      setSelectedPeople(nonPaidIndices);
    }
    setBillingVisible(true);
  };

  const toggle = (i: number): void =>
    setSelectedPeople((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const handleManageProducts = () => {
    setProductFormVisible(true);
  };

  const handleSaveProduct = (product: Product) => {
    const existingIndex = products.findIndex((p) => p.name === product.name);

    let updatedProducts: Product[];

    if (existingIndex >= 0) {
      // Atualizar produto existente
      updatedProducts = [
        ...products.slice(0, existingIndex),
        product,
        ...products.slice(existingIndex + 1),
      ];
    } else {
      // Adicionar novo produto
      updatedProducts = [...products, product];
    }

    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (product: Product) => {
    const updatedProducts = products.filter((p) => p.name !== product.name);
    setProducts(updatedProducts);
  };

  if (photosLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: COLORS.primary }}>Carregando fotos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>GERENCIADOR DE MESAS DE BAR</Text>
      </View>

      <FlatList
        data={tables}
        keyExtractor={(t) => t.id.toString()}
        renderItem={({ item }) => (
          <TableCell
            item={item}
            glowAnim={glowAnim}
            onPress={handleTablePress}
            onLongPress={handleTableLongPress}
            isSelected={current?.id === item.id}
            showSelected={true}
          />
        )}
        numColumns={4}
        contentContainerStyle={styles.grid}
      />

      <ConfigModal
        visible={configVisible}
        current={current}
        configName={configName}
        configNumber={configNumber}
        onChangeName={setConfigName}
        onChangeNumber={setConfigNumber}
        onSave={saveConfig}
        onCancel={() => setConfigVisible(false)}
      />

      <ConfigModal
        visible={editVisible}
        current={current}
        configName={configName}
        configNumber={configNumber}
        onChangeName={setConfigName}
        onChangeNumber={setConfigNumber}
        onSave={saveEdit}
        onCancel={() => setEditVisible(false)}
      />

      <PersonModal
        visible={personVisible}
        avatar={newPersonAvatar}
        name={newPersonName}
        onChangeAvatar={() =>
          setNewPersonAvatar(
            AVATAR_PLACEHOLDER + Math.floor(Math.random() * 70 + 1)
          )
        }
        onChangeName={setNewPersonName}
        onCustomAvatar={handlePhotoTaken} // Usar a nova função
        onSave={savePerson}
        onCancel={() => setPersonVisible(false)}
        people={current?.people || []}
        takenPhotos={takenPhotos}
      />

      <ProductModal
        visible={productVisible}
        products={products}
        onSelect={startAssignProduct}
        onCancel={() => setProductVisible(false)}
      />

      <ProductFormModal
        visible={productFormVisible}
        products={products}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        onCancel={() => setProductFormVisible(false)}
      />

      <BillingModal
        visible={billingVisible}
        tableNumber={current?.number || ""}
        people={
          current ? tables.find((t) => t.id === current.id)?.people || [] : []
        }
        selectedPeople={selectedPeople}
        onToggle={toggle}
        onClose={() => setBillingVisible(false)}
        onSetPersonPaid={(index, isPaid) => {
          if (!current) return;
          handleSetPersonPaid(current.id, index, isPaid);
        }}
        onCloseBill={handleCloseBill}
      />

      <ResetTableModal
        visible={resetTableVisible}
        table={tableToReset}
        onConfirm={handleResetTable}
        onCancel={() => setResetTableVisible(false)}
      />

      <SaveHistoryModal
        visible={saveHistoryVisible}
        table={tableToSaveHistory}
        onConfirm={saveTableToHistory}
        onCancel={cancelSaveHistory}
      />

      <HistoryModal
        visible={historyVisible}
        history={history}
        onClose={() => setHistoryVisible(false)}
      />

      <RNModal
        isVisible={assignVisible}
        backdropColor={COLORS.secondary}
        backdropOpacity={0.8}
      >
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Atribuir para...</Text>
          {current?.people.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.toggle}
              onPress={() => assignProductToPerson(i)}
            >
              <View style={styles.toggleRow}>
                <Image source={{ uri: p.avatar }} style={styles.smallAvatar} />
                <Text style={styles.toggleText}>{p.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.btn}
            onPress={assignProductToTableOnly}
          >
            <Text style={styles.btnText}>Apenas para a Mesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setAssignVisible(false)}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </RNModal>

      {current?.enabled ? (
        <FloatingActions
          onAddPerson={openPerson}
          onAddProduct={() => setProductVisible(true)}
          onBilling={openBilling}
          onEditTable={openEdit}
        />
      ) : (
        <BottomMenu
          onManageProducts={handleManageProducts}
          onViewHistory={handleViewHistory}
        />
      )}
    </SafeAreaView>
  );
}
