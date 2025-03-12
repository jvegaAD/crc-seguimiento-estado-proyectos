
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface ProjectData {
  empresa: string;
  nombreProyecto: string;
  fechaEntrega: string;
  id: string;
  estado: string;
  especialidad: string;
  proyectoEstudio: string;
}

interface ProjectTableProps {
  companyId: string;
  tableId: string;
  data: ProjectData[];
}

const ProjectTable = ({ companyId, tableId, data }: ProjectTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectData | null;
    direction: 'asc' | 'desc';
  }>({
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

  const columnHeaders: { key: keyof ProjectData; label: string }[] = [
    { key: 'empresa', label: 'Empresa' },
    { key: 'nombreProyecto', label: 'Nombre Proyecto' },
    { key: 'fechaEntrega', label: 'Fecha Entrega' },
    { key: 'id', label: 'ID' },
    { key: 'estado', label: 'Estado' },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'proyectoEstudio', label: 'Proyecto/Estudio' }
  ];

  return (
    <div className="table-wrapper animate-scale-in overflow-x-auto">
      <table id={tableId} className="w-full border-collapse">
        <thead>
          <tr>
            {columnHeaders.map(({ key, label }) => (
              <th key={key} className="p-2 border bg-secondary">
                <div className="space-y-2">
                  <div 
                    onClick={() => handleSort(key)}
                    className="flex items-center justify-between cursor-pointer hover:opacity-80"
                  >
                    {label}
                    <div className="flex flex-col">
                      <ChevronUp 
                        className={`h-3 w-3 ${
                          sortConfig.key === key && sortConfig.direction === 'asc' 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`}
                      />
                      <ChevronDown 
                        className={`h-3 w-3 ${
                          sortConfig.key === key && sortConfig.direction === 'desc' 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Input
                      placeholder={`Filtrar ${label}`}
                      value={filters[key] || ''}
                      onChange={(e) => handleFilter(key, e.target.value)}
                      className="h-8 text-xs"
                    />
                    {filters[key] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => clearFilter(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((row, index) => (
            <tr 
              key={`${companyId}-${row.id}-${index}`}
              className="border-b hover:bg-muted/50"
            >
              <td className="p-2 border">{row.empresa}</td>
              <td className="p-2 border">{row.nombreProyecto}</td>
              <td className="p-2 border">{row.fechaEntrega}</td>
              <td className="p-2 border">{row.id}</td>
              <td className="p-2 border">
                <span 
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.estado === 'OK' ? 'bg-green-100 text-green-800' :
                    row.estado === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                    row.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {row.estado}
                </span>
              </td>
              <td className="p-2 border">{row.especialidad}</td>
              <td className="p-2 border">{row.proyectoEstudio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
