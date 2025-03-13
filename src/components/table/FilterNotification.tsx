
import { Button } from '../ui/button';
import { FilterX } from 'lucide-react';

interface FilterNotificationProps {
  filterCount: number;
  onClearAllFilters: () => void;
}

const FilterNotification = ({ filterCount, onClearAllFilters }: FilterNotificationProps) => {
  return (
    <div className="flex justify-between items-center bg-blue-50 p-2 rounded-t-lg border border-blue-200 filter-indicator">
      <span className="text-sm text-blue-700 font-medium">
        Filtros activos: {filterCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAllFilters}
        className="border-blue-300 text-blue-700 hover:bg-blue-100 filter-button"
      >
        <FilterX className="h-4 w-4 mr-1" />
        Limpiar todos los filtros
      </Button>
    </div>
  );
};

export default FilterNotification;
