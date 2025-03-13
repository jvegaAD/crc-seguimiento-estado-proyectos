
import { useEffect, useState, useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown, X, Check, Filter } from 'lucide-react';
import { ProjectData, SortConfig } from '@/types/project';

interface TableHeaderProps {
  columnKey: keyof ProjectData;
  label: string;
  sortConfig: SortConfig;
  onSort: (key: keyof ProjectData) => void;
  filterValue: string[] | undefined;
  onFilter: (values: string[]) => void;
  onClearFilter: () => void;
  data: ProjectData[];
}

const TableHeader = ({
  columnKey,
  label,
  sortConfig,
  onSort,
  filterValue = [],
  onFilter,
  onClearFilter,
  data
}: TableHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique values for the column
  const uniqueValues = Array.from(
    new Set(
      data
        .map(item => String(item[columnKey]))
        .filter(Boolean)
    )
  ).sort();

  // Filtered values based on search
  const filteredValues = uniqueValues.filter(value => 
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle selection for a value
  const toggleValueSelection = (value: string) => {
    const newFilterValue = filterValue ? [...filterValue] : [];
    
    if (newFilterValue.includes(value)) {
      onFilter(newFilterValue.filter(v => v !== value));
    } else {
      onFilter([...newFilterValue, value]);
    }
  };

  return (
    <th key={columnKey} className="p-2 border bg-primary text-primary-foreground">
      <div className="space-y-2">
        <div onClick={() => onSort(columnKey)} className="flex items-center justify-between cursor-pointer hover:opacity-80">
          {label}
          <div className="flex flex-col">
            <ChevronUp className={`h-3 w-3 ${sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'text-white' : 'text-primary-foreground/70'}`} />
            <ChevronDown className={`h-3 w-3 ${sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 'text-white' : 'text-primary-foreground/70'}`} />
          </div>
        </div>
        
        <div className="relative filter-container" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full text-[12px] font-sans bg-white text-gray-700 
              rounded-md px-3 py-1 my-1 mx-1 border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
              transition-all"
          >
            <span className="truncate">
              {filterValue && filterValue.length > 0 
                ? `${filterValue.length} seleccionado${filterValue.length > 1 ? 's' : ''}`
                : `Filtrar ${label}`}
            </span>
            <Filter className="h-3 w-3 text-gray-500" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-2 sticky top-0 bg-white border-b">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-[12px] font-sans bg-white text-gray-700 
                  rounded-md px-3 py-1 border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                  transition-all"
                />
              </div>
              
              <div className="p-1">
                {filteredValues.length > 0 ? (
                  filteredValues.map((value) => (
                    <div
                      key={value}
                      onClick={() => toggleValueSelection(value)}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 text-[12px] text-gray-700"
                    >
                      <div className={`flex-shrink-0 w-4 h-4 mr-2 border rounded ${
                        filterValue.includes(value) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {filterValue.includes(value) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="truncate">{value}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-[12px] text-gray-500">No hay resultados</div>
                )}
              </div>
              
              <div className="p-2 border-t flex justify-between bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onFilter([]);
                    setIsDropdownOpen(false);
                  }}
                  className="text-[12px] text-gray-700 hover:bg-gray-200"
                >
                  Limpiar
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-[12px] bg-blue-500 hover:bg-blue-600"
                >
                  Aplicar
                </Button>
              </div>
            </div>
          )}
          
          {filterValue && filterValue.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-blue-800/20 filter-button" 
              onClick={(e) => {
                e.stopPropagation();
                onClearFilter();
              }}
            >
              <X className="h-3 w-3 text-gray-500" />
            </Button>
          )}
        </div>
        
        {filterValue && filterValue.length > 0 && (
          <div className="text-xs bg-blue-800 text-white px-2 py-1 rounded-md filter-indicator">
            Filtro activo
          </div>
        )}
      </div>
    </th>
  );
};

export default TableHeader;
