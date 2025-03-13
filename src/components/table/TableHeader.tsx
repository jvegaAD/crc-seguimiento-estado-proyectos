
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { ProjectData, SortConfig } from '@/types/project';

interface TableHeaderProps {
  columnKey: keyof ProjectData;
  label: string;
  sortConfig: SortConfig;
  onSort: (key: keyof ProjectData) => void;
  filterValue: string;
  onFilter: (value: string) => void;
  onClearFilter: () => void;
}

const TableHeader = ({
  columnKey,
  label,
  sortConfig,
  onSort,
  filterValue,
  onFilter,
  onClearFilter
}: TableHeaderProps) => {
  return <th key={columnKey} className="p-2 border bg-primary text-primary-foreground">
      <div className="space-y-2">
        <div onClick={() => onSort(columnKey)} className="flex items-center justify-between cursor-pointer hover:opacity-80">
          {label}
          <div className="flex flex-col">
            <ChevronUp className={`h-3 w-3 ${sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 'text-white' : 'text-primary-foreground/70'}`} />
            <ChevronDown className={`h-3 w-3 ${sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 'text-white' : 'text-primary-foreground/70'}`} />
          </div>
        </div>
        <div className="flex gap-1 relative filter-input">
          <Input placeholder={`Filtrar ${label}`} value={filterValue || ''} onChange={e => onFilter(e.target.value)} className="text-[9px] font-sans bg-white text-foreground\\\\n rounded-lg px-px py-0 my-px mx-0" />
          {filterValue && <Button variant="ghost" size="icon" className="h-6 w-6 absolute right-0 hover:bg-blue-800/20 filter-button" onClick={onClearFilter}>
              <X className="h-3 w-3 text-white" />
            </Button>}
        </div>
        {filterValue && <div className="text-xs bg-blue-800 text-white px-2 py-1 rounded-md filter-indicator">
            Filtro activo
          </div>}
      </div>
    </th>;
};

export default TableHeader;
