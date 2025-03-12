
import { useState } from 'react';
import { sortTable } from '../utils/emailUtils';

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
  const [activeSort, setActiveSort] = useState<{ column: number; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (columnIndex: number) => {
    sortTable(columnIndex, tableId);
    
    // Track active sort state for UI
    setActiveSort(prev => {
      if (prev?.column === columnIndex) {
        // Toggle direction if same column
        return { column: columnIndex, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column: columnIndex, direction: 'asc' };
    });
  };

  return (
    <div className="table-wrapper animate-scale-in">
      <table id={tableId} className="data-table">
        <thead>
          <tr>
            <th 
              onClick={() => handleSort(0)}
              className={activeSort?.column === 0 ? activeSort.direction : ''}
            >
              Empresa
              <span className="ml-1">{
                activeSort?.column === 0 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(1)}
              className={activeSort?.column === 1 ? activeSort.direction : ''}
            >
              Nombre Proyecto
              <span className="ml-1">{
                activeSort?.column === 1 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(2)}
              className={activeSort?.column === 2 ? activeSort.direction : ''}
            >
              Fecha Entrega
              <span className="ml-1">{
                activeSort?.column === 2 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(3)}
              className={activeSort?.column === 3 ? activeSort.direction : ''}
            >
              ID
              <span className="ml-1">{
                activeSort?.column === 3 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(4)}
              className={activeSort?.column === 4 ? activeSort.direction : ''}
            >
              Estado
              <span className="ml-1">{
                activeSort?.column === 4 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(5)}
              className={activeSort?.column === 5 ? activeSort.direction : ''}
            >
              Especialidad
              <span className="ml-1">{
                activeSort?.column === 5 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
            <th 
              onClick={() => handleSort(6)}
              className={activeSort?.column === 6 ? activeSort.direction : ''}
            >
              Proyecto/Estudio
              <span className="ml-1">{
                activeSort?.column === 6 
                  ? activeSort.direction === 'asc' ? '↑' : '↓' 
                  : '⇕'
              }</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={`${companyId}-${row.id}-${index}`}>
              <td>{row.empresa}</td>
              <td>{row.nombreProyecto}</td>
              <td>{row.fechaEntrega}</td>
              <td>{row.id}</td>
              <td>
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
              <td>{row.especialidad}</td>
              <td>{row.proyectoEstudio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
