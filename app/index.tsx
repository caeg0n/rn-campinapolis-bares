import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNModal from "react-native-modal";

// Components
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
import SelectiveSyncModal from "../components/SelectiveSyncModal";
import TableCell from "../components/TableCell";

// Hooks
import { useAppState } from "../hooks/useAppState";
import { useHistory } from "../hooks/useHistory";
import { useModalManager } from "../hooks/useModalManager";
import { usePersistentPhotos } from "../hooks/usePersistentPhotos";
import { usePersonForm } from "../hooks/usePersonForm";
import { usePhotoManager } from "../hooks/usePhotoManager";
import { useTableActions } from "../hooks/useTableActions";
import { useAnimatedGlow, useTableSelection } from "../hooks/useTableSelection";

// Utils and Types
import { OrderItem, Product, Table } from "../types";
import {
  getNonPaidPeopleIndices,
  isTableFullyPaid,
  markAllAsPaid
} from "../utils/tableUtils";
import styles, { COLORS } from "./styles";

export default function App() {
  // Core state management
  const { tables, storedProducts, setTables, setProducts } = useAppState();
  const { current, setCurrent } = useTableSelection();
  const glowAnim = useAnimatedGlow(tables);
  const modals = useModalManager();
  
  // Feature hooks
  const personForm = usePersonForm();
  const { history, saveToHistory } = useHistory();
  const { takenPhotos, addPhoto } = usePhotoManager();
  const tableActions = useTableActions(tables, setTables);
  const { isLoading: photosLoading } = usePersistentPhotos();

  // Local state
  const [configName, setConfigName] = useState("");
  const [configNumber, setConfigNumber] = useState("");
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [tableToReset, setTableToReset] = useState<Table | null>(null);
  const [tableToSaveHistory, setTableToSaveHistory] = useState<Table | null>(null);
  const [products, setProductsState] = useState<Product[]>(storedProducts);

  // Effects
  useEffect(() => {
    setProductsState(storedProducts);
  }, [storedProducts]);

  useEffect(() => {
    if (current?.id) {
      const updatedTable = tables.find(t => t.id === current.id);
      if (updatedTable) setCurrent(updatedTable);
    }
  }, [tables]);

  // Table handlers
  const handleTablePress = (table: Table) => {
    if (!table.enabled) {
      setConfigName(table.name);
      setConfigNumber(table.number);
      setCurrent(table);
      modals.openModal('config');
      return;
    }
    setCurrent(current?.id === table.id ? null : table);
  };

  const handleTableLongPress = (table: Table) => {
    if (!table.enabled) return;
    
    if (isTableFullyPaid(table)) {
      setTableToSaveHistory(table);
      modals.openModal('saveHistory');
    } else {
      setTableToReset(table);
      modals.openModal('resetTable');
    }
  };

  // Configuration handlers
  const saveConfig = () => {
    if (!configNumber || !current) return;
    tableActions.configureTable(current, configName, configNumber);
    modals.closeModal('config');
  };

  const saveEdit = () => {
    if (!current) return;
    tableActions.editTable(current, configName, configNumber);
    modals.closeModal('edit');
  };

  // Person handlers
  const openPerson = () => {
    personForm.resetForm();
    modals.openModal('person');
  };

  const savePerson = () => {
    if (!current) return;
    const person = personForm.createPerson();
    if (!person) return;
    
    // Add photo if it's a custom one
    if (personForm.customAvatar?.startsWith("data:image")) {
      addPhoto(personForm.customAvatar);
    }
    
    tableActions.addPersonToTable(current.id, person);
    modals.closeModal('person');
  };

  // Product handlers
  const startAssignProduct = (product: Product) => {
    if (!current) return;
    setPendingProduct(product);
    modals.openModal('assign');
  };

  const assignProductToPerson = (personIndex: number) => {
    if (!current || !pendingProduct) return;
    tableActions.assignProductToPerson(current.id, personIndex, pendingProduct);
    modals.closeModal('assign');
    setPendingProduct(null);
  };

  // Billing handlers
  const openBilling = () => {
    if (!current) return;
    const freshTable = tables.find(t => t.id === current.id);
    if (freshTable) {
      setSelectedPeople(getNonPaidPeopleIndices(freshTable));
    }
    modals.openModal('billing');
  };

  const handleCloseBill = () => {
    if (!current) return;
    
    if (current.people.every(person => person.paid)) {
      setTableToSaveHistory(current);
      modals.openModal('saveHistory');
    } else {
      const updatedTables = tables.map(t => 
        t.id === current.id ? markAllAsPaid(t) : t
      );
      setTables(updatedTables);
    }
    modals.closeModal('billing');
  };

  // History handlers
  const saveTableToHistory = async () => {
    if (!tableToSaveHistory) return;
    await saveToHistory(tableToSaveHistory);
    tableActions.resetTable(tableToSaveHistory.id);
    modals.closeModal('saveHistory');
    setTableToSaveHistory(null);
    if (current?.id === tableToSaveHistory.id) setCurrent(null);
  };

  const cancelSaveHistory = () => {
    modals.closeModal('saveHistory');
    setTableToSaveHistory(null);
  };

  // Reset handlers
  const handleResetTable = () => {
    const tableToResetNow = tableToSaveHistory || tableToReset;
    if (!tableToResetNow) return;
    
    tableActions.resetTable(tableToResetNow.id);
    modals.closeModal('resetTable');
    setTableToReset(null);
    setTableToSaveHistory(null);
    
    if (current?.id === tableToResetNow.id) setCurrent(null);
  };

  // Product management
  const handleSaveProduct = (product: Product) => {
    const existingIndex = products.findIndex(p => p.name === product.name);
    const updatedProducts = existingIndex >= 0
      ? [...products.slice(0, existingIndex), product, ...products.slice(existingIndex + 1)]
      : [...products, product];
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts(products.filter(p => p.name !== product.name));
  };

  // Other handlers
  const openEdit = () => {
    if (!current) return;
    setConfigName(current.name);
    setConfigNumber(current.number);
    modals.openModal('edit');
  };

  const toggle = (i: number) => {
    setSelectedPeople(prev => 
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  // Import products from QR code
  const handleImportProducts = (tableNumber: string, personName: string, orders: OrderItem[]) => {
    console.log('Importing products:', { tableNumber, personName, orders });
    
    // Find the table with the matching number
    const targetTable = tables.find(table => table.enabled && table.number === tableNumber);
    if (!targetTable) {
      console.error('No enabled table found with number:', tableNumber);
      return;
    }

    const updatedTables = tables.map(table => {
      if (table.id !== targetTable.id) return table;

      // Find or create the person
      let personIndex = table.people.findIndex(person => person.name === personName);
      
      if (personIndex === -1) {
        // Person doesn't exist, create new person
        const newPerson = {
          name: personName,
          avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70 + 1)}`,
          bill: 0,
          orders: [],
          paid: false
        };
        table.people.push(newPerson);
        personIndex = table.people.length - 1;
      }

      // Add the orders to the person
      const updatedPeople = table.people.map((person, index) => {
        if (index !== personIndex) return person;

        // Add imported orders to existing orders
        const newOrders = [...(person.orders || []), ...orders];
        
        // Calculate new bill
        const newBill = newOrders.reduce((sum, order) => {
          return sum + (order.product.price * order.quantity);
        }, 0);

        return {
          ...person,
          orders: newOrders,
          bill: newBill,
          paid: false // Mark as unpaid when new products are added
        };
      });

      return {
        ...table,
        people: updatedPeople
      };
    });

    setTables(updatedTables);
    console.log('Products imported successfully');
  };

  // Loading state
  if (photosLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
        keyExtractor={t => t.id.toString()}
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

      {/* Configuration Modals */}
      <ConfigModal
        visible={modals.config}
        current={current}
        configName={configName}
        configNumber={configNumber}
        onChangeName={setConfigName}
        onChangeNumber={setConfigNumber}
        onSave={saveConfig}
        onCancel={() => modals.closeModal('config')}
      />

      <ConfigModal
        visible={modals.edit}
        current={current}
        configName={configName}
        configNumber={configNumber}
        onChangeName={setConfigName}
        onChangeNumber={setConfigNumber}
        onSave={saveEdit}
        onCancel={() => modals.closeModal('edit')}
      />

      {/* Person Modal */}
      <PersonModal
        visible={modals.person}
        avatar={personForm.newPersonAvatar}
        name={personForm.newPersonName}
        onChangeAvatar={() => personForm.setNewPersonAvatar(
          `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70 + 1)}`
        )}
        onChangeName={personForm.setNewPersonName}
        onCustomAvatar={personForm.handlePhotoTaken}
        onSave={savePerson}
        onCancel={() => modals.closeModal('person')}
        people={current?.people || []}
        takenPhotos={takenPhotos}
      />

      {/* Product Modals */}
      <ProductModal
        visible={modals.product}
        products={products}
        onSelect={startAssignProduct}
        onCancel={() => modals.closeModal('product')}
      />

      <ProductFormModal
        visible={modals.productForm}
        products={products}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        onCancel={() => modals.closeModal('productForm')}
      />

      {/* Billing Modal */}
      <BillingModal
        visible={modals.billing}
        tableNumber={current?.number || ""}
        people={current ? tables.find(t => t.id === current.id)?.people || [] : []}
        selectedPeople={selectedPeople}
        onToggle={toggle}
        onClose={() => modals.closeModal('billing')}
        onSetPersonPaid={(index, isPaid) => {
          if (!current) return;
          tableActions.setPersonPaid(current.id, index, isPaid);
        }}
        onCloseBill={handleCloseBill}
        onRemoveProduct={(personIndex, productIndex) => {
          if (!current) return;
          tableActions.removeProduct(current.id, personIndex, productIndex);
        }}
      />

      {/* Action Modals */}
      <RNModal
        isVisible={modals.assign}
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
            style={styles.cancelBtn}
            onPress={() => modals.closeModal('assign')}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </RNModal>

      {/* History and Reset Modals */}
      <ResetTableModal
        visible={modals.resetTable}
        table={tableToReset}
        onConfirm={handleResetTable}
        onCancel={() => modals.closeModal('resetTable')}
      />

      <SaveHistoryModal
        visible={modals.saveHistory}
        table={tableToSaveHistory}
        onConfirm={saveTableToHistory}
        onCancel={cancelSaveHistory}
      />

      <HistoryModal
        visible={modals.history}
        history={history}
        onClose={() => modals.closeModal('history')}
      />

      <SelectiveSyncModal
        visible={modals.syncMenu}
        onClose={() => modals.closeModal('syncMenu')}
        tables={tables}
        onRemoveProduct={(tableId, personIndex, orderIndices) =>
          tableActions.removeProducts(tableId, personIndex, orderIndices)
        }
        onImportProducts={handleImportProducts}
      />

      {/* Action Buttons */}
      {current?.enabled ? (
        <FloatingActions
          onAddPerson={openPerson}
          onAddProduct={() => modals.openModal('product')}
          onBilling={openBilling}
          onEditTable={openEdit}
        />
      ) : (
        <BottomMenu
          onManageProducts={() => modals.openModal('productForm')}
          onViewHistory={() => modals.openModal('history')}
          onSync={() => modals.openModal('syncMenu')}
        />
      )}
    </SafeAreaView>
  );
}