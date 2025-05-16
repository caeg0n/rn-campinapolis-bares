import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_PRODUCTS, TOTAL_TABLES } from '../constants';
import { Product, Table } from '../types';

export const useAppState = () => {
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

  // Initialize tables if empty
  useState(() => {
    if (!tables.length) {
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
    }
  });

  return {
    tables,
    storedProducts,
    setTables,
    setProducts,
  };
};