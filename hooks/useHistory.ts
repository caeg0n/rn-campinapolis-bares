import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { HISTORY_STORAGE_KEY } from '../constants';
import { HistoryItem, Table } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (historyData) {
          setHistory(JSON.parse(historyData));
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    };
    loadHistory();
  }, []);

  const saveToHistory = useCallback(async (table: Table): Promise<void> => {
    const historyItem: HistoryItem = {
      id: `${table.id}_${Date.now()}`,
      date: Date.now(),
      tableId: table.id,
      tableNumber: table.number,
      tableName: table.name,
      people: JSON.parse(JSON.stringify(table.people)),
      tableProducts: [...table.products],
    };

    const updatedHistory = [...history, historyItem];
    setHistory(updatedHistory);

    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  }, [history]);

  return {
    history,
    saveToHistory,
  };
};