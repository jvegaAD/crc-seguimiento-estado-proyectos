
import { ProjectData } from '@/types/project';
import { useTableData } from '@/hooks/useTableData';
import TableHeader from './table/TableHeader';
import StatusBadge from './table/StatusBadge';
import FilterNotification from './table/FilterNotification';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from './ui/table';

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

  // Updated column headers with new widths
  const columnHeaders: { key: keyof ProjectData; label: string; width: string }[] = [
    { key: 'empresa', label: 'Empresa', width: '100px' },
    { key: 'nombreProyecto', label: 'Nombre Proyecto', width: '80px' },
    { key: 'fechaEntrega', label: 'Fecha Entrega', width: '80px' },
    { key: 'id', label: 'ID', width: '30px' },
    { key: 'estado', label: 'Estado', width: '80px' },
    { key: 'especialidad', label: 'Especialidad', width: '100px' },
    { key: 'proyectoEstudio', label: 'Proyecto/Estudio', width: '130px' },
    { key: 'fechaInicio', label: 'Fecha Inicio', width: '80px' },
    { key: 'fechaTermino', label: 'Fecha Término', width: '80px' },
    { key: 'tarea', label: 'Tarea', width: '120px' },
    { key: 'observacion', label: 'Observación', width: '300px' }
  ];

  return (
    <div className="animate-scale-in shadow-xl border border-gray-300 rounded-lg">
      {hasActiveFilters && (
        <FilterNotification 
          filterCount={Object.keys(filters).length} 
          onClearAllFilters={clearAllFilters} 
        />
      )}
      
      <div className="scrollbar-visible w-full overflow-x-auto rounded-lg" style={{ maxHeight: '480px' }}>
        <Table id={tableId} className="w-max border-collapse table-fixed">
          <ShadcnTableHeader className="sticky top-0 bg-[#040c67] text-white z-10">
            <TableRow>
              {columnHeaders.map(({ key, label, width }) => (
                <TableHead 
                  key={key}
                  className="text-white h-12 font-medium whitespace-nowrap text-left"
                  style={{ width, minWidth: width }}
                >
                  <TableHeader
                    columnKey={key}
                    label={label}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    filterValue={filters[key]}
                    onFilter={(values) => handleFilter(key, values)}
                    onClearFilter={() => clearFilter(key)}
                    data={data}
                  />
                </TableHead>
              ))}
            </TableRow>
          </ShadcnTableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnHeaders.length} className="p-4 text-center">
                  No se encontraron resultados con los filtros aplicados
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, index) => (
                <TableRow 
                  key={`${companyId}-${row.id}-${index}`}
                  className="hover:bg-muted/50"
                >
                  {columnHeaders.map(({ key, width }) => (
                    <TableCell 
                      key={`${companyId}-${row.id}-${index}-${String(key)}`} 
                      className="p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width, minWidth: width, maxWidth: width }}
                    >
                      {key === 'estado' ? (
                        <StatusBadge status={String(row[key])} />
                      ) : (
                        String(row[key])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTable;
