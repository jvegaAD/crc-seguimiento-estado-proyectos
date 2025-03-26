
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
    { key: 'proyectoEstudio', label: 'Proyecto/Estudio' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
    { key: 'fechaTermino', label: 'Fecha Término' },
    { key: 'tarea', label: 'Tarea' },
    { key: 'observacion', label: 'Observación' }
  ];

  return (
    <div className="table-wrapper animate-scale-in overflow-x-auto shadow-xl border border-gray-300 rounded-lg">
      {hasActiveFilters && (
        <FilterNotification 
          filterCount={Object.keys(filters).length} 
          onClearAllFilters={clearAllFilters} 
        />
      )}
      
      <table id={tableId} className="w-full border-collapse border border-gray-300">
        <thead className="bg-[#040c67] text-white">
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
              <td colSpan={columnHeaders.length} className="p-4 text-center border border-gray-300">
                No se encontraron resultados con los filtros aplicados
              </td>
            </tr>
          ) : (
            filteredAndSortedData.map((row, index) => (
              <tr 
                key={`${companyId}-${row.id}-${index}`}
                className="border-b border-gray-300 hover:bg-muted/50"
              >
                <td className="p-2 border border-gray-300">{row.empresa}</td>
                <td className="p-2 border border-gray-300">{row.nombreProyecto}</td>
                <td className="p-2 border border-gray-300">{row.fechaEntrega}</td>
                <td className="p-2 border border-gray-300">{row.id}</td>
                <td className="p-2 border border-gray-300">
                  <StatusBadge status={row.estado} />
                </td>
                <td className="p-2 border border-gray-300">{row.especialidad}</td>
                <td className="p-2 border border-gray-300">{row.proyectoEstudio}</td>
                <td className="p-2 border border-gray-300">{row.fechaInicio}</td>
                <td className="p-2 border border-gray-300">{row.fechaTermino}</td>
                <td className="p-2 border border-gray-300">{row.tarea}</td>
                <td className="p-2 border border-gray-300">{row.observacion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
