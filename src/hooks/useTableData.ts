
import { useMemo, useState } from 'react';
import { ProjectData, SortConfig } from '@/types/project';

export function useTableData(data: ProjectData[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  const [filters, setFilters] = useState<Partial<Record<keyof ProjectData, string>>>({});

  const handleSort = (key: keyof ProjectData) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key: keyof ProjectData, value: string) => {
    setFilters(current => ({
      ...current,
      [key]: value
    }));
  };

  const clearFilter = (key: keyof ProjectData) => {
    setFilters(current => {
      const newFilters = { ...current };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key as keyof ProjectData];
      if (filterValue) {
        processedData = processedData.filter(item =>
          String(item[key as keyof ProjectData])
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        const aValue = String(a[sortConfig.key!]).toLowerCase();
        const bValue = String(b[sortConfig.key!]).toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return processedData;
  }, [data, filters, sortConfig]);

  return {
    sortConfig,
    filters,
    hasActiveFilters,
    filteredAndSortedData,
    handleSort,
    handleFilter,
    clearFilter,
    clearAllFilters
  };
}
