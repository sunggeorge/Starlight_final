import { useState, useMemo } from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface SortableItem {
  id?: number;
  date?: string;
  amount?: number;
  user?: { first_name: string; last_name: string };
  servicePerson?: { name: string };
}

export function useSort<T extends SortableItem>(items: T[], defaultKey: keyof T) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
      key: defaultKey as string,
      direction: 'asc',
    });
  
    const sortedItems = useMemo(() => {
      return [...items].sort((a, b) => {
        if (!sortConfig) return 0;
  
        let aValue: any = a[sortConfig.key as keyof T];
        let bValue: any = b[sortConfig.key as keyof T];
  
        if (sortConfig.key === 'customer') {
          aValue = a.user ? `${a.user.first_name} ${a.user.last_name}` : '';
          bValue = b.user ? `${b.user.first_name} ${b.user.last_name}` : '';
        } else if (sortConfig.key === 'amount') {
          aValue = a.amount ?? 0;
          bValue = b.amount ?? 0;
        }
  
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [items, sortConfig]); 
  
    const requestSort = (key: keyof T) => {
      setSortConfig((prevConfig) => ({
        key: key as string,
        direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
      }));
    };
  
    return { sortedItems, requestSort, sortConfig };
  }
  
