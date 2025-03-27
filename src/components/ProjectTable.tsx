
import { ProjectData } from '@/types/project';
import { useTableData } from '@/hooks/useTableData';
import TableHeader from './table/TableHeader';
import StatusBadge from './table/StatusBadge';
import FilterNotification from './table/FilterNotification';
import { ScrollArea } from './ui/scroll-area';
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
    <div className="animate-scale-in shadow-xl border border-gray-300 rounded-lg">
      {hasActiveFilters && (
        <FilterNotification 
          filterCount={Object.keys(filters).length} 
          onClearAllFilters={clearAllFilters} 
        />
      )}
      
      <ScrollArea className="h-[calc(100vh-350px)] rounded-lg">
        <div className="min-w-max">
          <Table id={tableId}>
            <ShadcnTableHeader className="sticky top-0 bg-[#040c67] text-white z-10">
              <TableRow>
                {columnHeaders.map(({ key, label }) => (
                  <TableHead 
                    key={key}
                    className="text-white h-12 font-medium"
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
                    <TableCell className="p-2">{row.empresa}</TableCell>
                    <TableCell className="p-2">{row.nombreProyecto}</TableCell>
                    <TableCell className="p-2">{row.fechaEntrega}</TableCell>
                    <TableCell className="p-2">{row.id}</TableCell>
                    <TableCell className="p-2">
                      <StatusBadge status={row.estado} />
                    </TableCell>
                    <TableCell className="p-2">{row.especialidad}</TableCell>
                    <TableCell className="p-2">{row.proyectoEstudio}</TableCell>
                    <TableCell className="p-2">{row.fechaInicio}</TableCell>
                    <TableCell className="p-2">{row.fechaTermino}</TableCell>
                    <TableCell className="p-2">{row.tarea}</TableCell>
                    <TableCell className="p-2">{row.observacion}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectTable;
