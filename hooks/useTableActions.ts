// import { useCallback } from 'react';
// import { OrderItem, Product, Table } from '../types';

// export const useTableActions = (
//   tables: Table[],
//   setTables: (tables: Table[]) => void
// ) => {
//   const updateTable = useCallback((tableId: number, updater: (table: Table) => Table) => {
//     const updatedTables = tables.map(table => 
//       table.id === tableId ? updater(table) : table
//     );
//     setTables(updatedTables);
//   }, [tables, setTables]);

//   const configureTable = useCallback((table: Table, name: string, number: string) => {
//     updateTable(table.id, t => ({
//       ...t,
//       enabled: true,
//       name,
//       number,
//     }));
//   }, [updateTable]);

//   const editTable = useCallback((table: Table, name: string, number: string) => {
//     updateTable(table.id, t => ({ ...t, name, number }));
//   }, [updateTable]);

//   const addPersonToTable = useCallback((tableId: number, person: any) => {
//     updateTable(tableId, table => ({
//       ...table,
//       people: [...table.people, person],
//     }));
//   }, [updateTable]);

//   const assignProductToPerson = useCallback((
//     tableId: number,
//     personIndex: number,
//     product: Product
//   ) => {
//     updateTable(tableId, table => ({
//       ...table,
//       people: table.people.map((person, i) => {
//         if (i !== personIndex) return person;

//         const currentOrders = person.orders || [];
//         const existingOrderIndex = currentOrders.findIndex(
//           order => order.product.name === product.name
//         );

//         let newOrders: OrderItem[] = [...currentOrders];

//         if (existingOrderIndex >= 0) {
//           newOrders[existingOrderIndex] = {
//             ...newOrders[existingOrderIndex],
//             quantity: newOrders[existingOrderIndex].quantity + 1,
//           };
//         } else {
//           newOrders.push({ product, quantity: 1 });
//         }

//         return {
//           ...person,
//           bill: person.bill + product.price,
//           orders: newOrders,
//           paid: false,
//         };
//       }),
//     }));
//   }, [updateTable]);

//   const setPersonPaid = useCallback((
//     tableId: number,
//     personIndex: number,
//     isPaid: boolean
//   ) => {
//     updateTable(tableId, table => ({
//       ...table,
//       people: table.people.map((person, i) => 
//         i === personIndex ? { ...person, paid: isPaid } : person
//       ),
//     }));
//   }, [updateTable]);

//   const removeProduct = useCallback((
//     tableId: number,
//     personIndex: number,
//     productIndex: number
//   ) => {
//     updateTable(tableId, table => ({
//       ...table,
//       people: table.people.map((person, pIndex) => {
//         if (pIndex !== personIndex) return person;
        
//         const updatedOrders = person.orders.filter((_, oIndex) => oIndex !== productIndex);
//         const newBill = updatedOrders.reduce((sum, order) => 
//           sum + order.product.price * order.quantity, 0
//         );
        
//         return {
//           ...person,
//           orders: updatedOrders,
//           bill: newBill,
//           paid: false,
//         };
//       }),
//     }));
//   }, [updateTable]);

//   const removeProducts = useCallback((
//     tableId: number,
//     personIndex: number,
//     orderIndices: number[]
//   ) => {
//     updateTable(tableId, table => ({
//       ...table,
//       people: table.people.map((person, pIndex) => {
//         if (pIndex !== personIndex) return person;
        
//         const updatedOrders = person.orders.filter((_, orderIndex) => 
//           !orderIndices.includes(orderIndex)
//         );
//         const newBill = updatedOrders.reduce((sum, order) => 
//           sum + order.product.price * order.quantity, 0
//         );
        
//         return {
//           ...person,
//           orders: updatedOrders,
//           bill: newBill,
//           paid: false,
//         };
//       }),
//     }));
//   }, [updateTable]);

//   const resetTable = useCallback((tableId: number) => {
//     updateTable(tableId, () => ({
//       id: tableId,
//       enabled: false,
//       name: "",
//       number: "",
//       people: [],
//       products: [],
//     }));
//   }, [updateTable]);

//   return {
//     configureTable,
//     editTable,
//     addPersonToTable,
//     assignProductToPerson,
//     setPersonPaid,
//     removeProduct,
//     removeProducts,
//     resetTable,
//   };
// };
import { useCallback } from 'react';
import { OrderItem, Person, Product, Table } from '../types';

export const useTableActions = (
  tables: Table[],
  setTables: (tables: Table[]) => void
) => {
  const updateTable = useCallback((tableId: number, updater: (table: Table) => Table) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? updater(table) : table
    );
    setTables(updatedTables);
  }, [tables, setTables]);

  const configureTable = useCallback((table: Table, name: string, number: string) => {
    updateTable(table.id, t => ({
      ...t,
      enabled: true,
      name,
      number,
    }));
  }, [updateTable]);

  const editTable = useCallback((table: Table, name: string, number: string) => {
    updateTable(table.id, t => ({ ...t, name, number }));
  }, [updateTable]);

  const addPersonToTable = useCallback((tableId: number, person: Person) => {
    updateTable(tableId, table => ({
      ...table,
      people: [...table.people, person],
    }));
  }, [updateTable]);

  const assignProductToPerson = useCallback((
    tableId: number,
    personIndex: number,
    product: Product
  ) => {
    updateTable(tableId, table => ({
      ...table,
      people: table.people.map((person, i) => {
        if (i !== personIndex) return person;

        const currentOrders = person.orders || [];
        const existingOrderIndex = currentOrders.findIndex(
          order => order.product.name === product.name
        );

        let newOrders: OrderItem[] = [...currentOrders];

        if (existingOrderIndex >= 0) {
          newOrders[existingOrderIndex] = {
            ...newOrders[existingOrderIndex],
            quantity: newOrders[existingOrderIndex].quantity + 1,
          };
        } else {
          newOrders.push({ product, quantity: 1 });
        }

        return {
          ...person,
          bill: person.bill + product.price,
          orders: newOrders,
          paid: false,
        };
      }),
    }));
  }, [updateTable]);

  const setPersonPaid = useCallback((
    tableId: number,
    personIndex: number,
    isPaid: boolean
  ) => {
    updateTable(tableId, table => ({
      ...table,
      people: table.people.map((person, i) => 
        i === personIndex ? { ...person, paid: isPaid } : person
      ),
    }));
  }, [updateTable]);

  const removeProduct = useCallback((
    tableId: number,
    personIndex: number,
    productIndex: number
  ) => {
    updateTable(tableId, table => ({
      ...table,
      people: table.people.map((person, pIndex) => {
        if (pIndex !== personIndex) return person;
        
        const updatedOrders = person.orders.filter((_, oIndex) => oIndex !== productIndex);
        const newBill = updatedOrders.reduce((sum, order) => 
          sum + order.product.price * order.quantity, 0
        );
        
        return {
          ...person,
          orders: updatedOrders,
          bill: newBill,
          paid: false,
        };
      }),
    }));
  }, [updateTable]);

  const removeProducts = useCallback((
    tableId: number,
    personIndex: number,
    orderIndices: number[]
  ) => {
    updateTable(tableId, table => ({
      ...table,
      people: table.people.map((person, pIndex) => {
        if (pIndex !== personIndex) return person;
        
        const updatedOrders = person.orders.filter((_, orderIndex) => 
          !orderIndices.includes(orderIndex)
        );
        const newBill = updatedOrders.reduce((sum, order) => 
          sum + order.product.price * order.quantity, 0
        );
        
        return {
          ...person,
          orders: updatedOrders,
          bill: newBill,
          paid: false,
        };
      }),
    }));
  }, [updateTable]);

  const resetTable = useCallback((tableId: number) => {
    updateTable(tableId, () => ({
      id: tableId,
      enabled: false,
      name: "",
      number: "",
      people: [],
      products: [],
    }));
  }, [updateTable]);

  return {
    configureTable,
    editTable,
    addPersonToTable,
    assignProductToPerson,
    setPersonPaid,
    removeProduct,
    removeProducts,
    resetTable,
  };
};