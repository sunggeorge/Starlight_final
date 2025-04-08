import { useState, useMemo } from 'react';

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export function useSort<T>(items: T[], defaultKey: string) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: 'asc',
  });

  const sortedItems = useMemo(() => {
    const getValue = (item: any, key: string) => {
      return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), item);
    };

    const sortableItems = [...items];

    sortableItems.sort((a, b) => {
      const aVal = getValue(a, sortConfig.key);
      const bVal = getValue(b, sortConfig.key);

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  return { sortedItems, requestSort, sortConfig };
}
