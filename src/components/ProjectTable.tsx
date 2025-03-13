
import { ProjectData } from '@/types/project';
import { useTableData } from '@/hooks/useTableData';
import TableHeader from './table/TableHeader';
import StatusBadge from './table/StatusBadge';
import FilterNotification from './table/FilterNotification';

interface ProjectTableProps {
  companyId: string;
  tableId: string;
  data: ProjectData[];
}

const ProjectTable = ({ companyId, tableId, data }: ProjectTableProps) => {
  const {
    sortConfig,
    filters,
    hasActiveFilters,
    filteredAndSortedData,
    handleSort,
    handleFilter,
    clearFilter,
    clearAllFilters
  } = useTableData(data);

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
      {hasActiveFilters && (
        <FilterNotification 
          filterCount={Object.keys(filters).length} 
          onClearAllFilters={clearAllFilters} 
        />
      )}
      
      <table id={tableId} className="w-full border-collapse">
        <thead>
          <tr>
            {columnHeaders.map(({ key, label }) => (
              <TableHeader
                key={key}
                columnKey={key}
                label={label}
                sortConfig={sortConfig}
                onSort={handleSort}
                filterValue={filters[key]}
                onFilter={(values) => handleFilter(key, values)}
                onClearFilter={() => clearFilter(key)}
                data={data}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.length === 0 ? (
            <tr>
              <td colSpan={columnHeaders.length} className="p-4 text-center border">
                No se encontraron resultados con los filtros aplicados
              </td>
            </tr>
          ) : (
            filteredAndSortedData.map((row, index) => (
              <tr 
                key={`${companyId}-${row.id}-${index}`}
                className="border-b hover:bg-muted/50"
              >
                <td className="p-2 border">{row.empresa}</td>
                <td className="p-2 border">{row.nombreProyecto}</td>
                <td className="p-2 border">{row.fechaEntrega}</td>
                <td className="p-2 border">{row.id}</td>
                <td className="p-2 border">
                  <StatusBadge status={row.estado} />
                </td>
                <td className="p-2 border">{row.especialidad}</td>
                <td className="p-2 border">{row.proyectoEstudio}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
