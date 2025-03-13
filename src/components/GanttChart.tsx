
import { useState, useEffect } from 'react';
import { ProjectData } from '@/types/project';
import StatusBadge from './table/StatusBadge';

interface GanttChartProps {
  projects: ProjectData[];
}

const GanttChart = ({ projects }: GanttChartProps) => {
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  
  // Group projects by nombreProyecto
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.nombreProyecto]) {
      acc[project.nombreProyecto] = [];
    }
    acc[project.nombreProyecto].push(project);
    return acc;
  }, {} as Record<string, ProjectData[]>);
  
  // Find min and max dates for the timeline
  useEffect(() => {
    if (projects.length > 0) {
      const dates = projects
        .filter(p => p.fechaEntrega)
        .map(p => new Date(p.fechaEntrega));
      
      if (dates.length > 0) {
        const min = new Date(Math.min(...dates.map(d => d.getTime())));
        const max = new Date(Math.max(...dates.map(d => d.getTime())));
        
        // Add some padding
        min.setDate(min.getDate() - 7);
        max.setDate(max.getDate() + 7);
        
        setMinDate(min);
        setMaxDate(max);
      }
    }
  }, [projects]);
  
  // Calculate days between min and max date
  const daysBetween = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate array of dates for the timeline
  const timelineDates = Array.from({ length: daysBetween + 1 }, (_, i) => {
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Calculate position of a task on the timeline
  const getTaskPosition = (date: string) => {
    if (!date) return { left: 0, width: 0 };
    
    const taskDate = new Date(date);
    const dayDiff = Math.max(0, Math.ceil((taskDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    const left = (dayDiff / daysBetween) * 100;
    
    return {
      left: `${left}%`,
      width: '24px',
    };
  };
  
  // Function to format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Check if a date matches today
  const isToday = (date: string) => {
    if (!date) return false;
    const today = new Date();
    const taskDate = new Date(date);
    return today.toDateString() === taskDate.toDateString();
  };
  
  return (
    <div className="overflow-x-auto animate-fade-in">
      <div className="min-w-max">
        {/* Header with timeline */}
        <div className="flex border-b border-gray-300">
          <div className="min-w-[600px] flex-shrink-0 bg-[#040c67] text-white p-2">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-1">Nombre Proyecto</div>
              <div className="col-span-1">ID</div>
              <div className="col-span-1">Empresa</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Especialidad</div>
              <div className="col-span-1">Proyecto/Estudio</div>
            </div>
          </div>
          
          <div className="flex-grow relative p-2 bg-[#040c67] text-white overflow-hidden">
            <div className="flex justify-between w-full text-xs">
              <span>{formatDate(minDate)}</span>
              <span>{formatDate(maxDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Projects */}
        {Object.keys(groupedProjects).sort().map((nombreProyecto, groupIndex) => (
          <div key={nombreProyecto} className={`border-b border-gray-200 ${groupIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="font-medium bg-gray-100 px-2 py-1 sticky left-0">
              {nombreProyecto}
            </div>
            
            {groupedProjects[nombreProyecto].map((project, projectIndex) => (
              <div key={`${project.id}-${projectIndex}`} className="flex hover:bg-gray-100">
                <div className="min-w-[600px] flex-shrink-0 p-2">
                  <div className="grid grid-cols-6 gap-2 text-sm">
                    <div className="col-span-1 truncate">{project.nombreProyecto}</div>
                    <div className="col-span-1 truncate">{project.id}</div>
                    <div className="col-span-1 truncate">{project.empresa}</div>
                    <div className="col-span-1">
                      <StatusBadge status={project.estado} />
                    </div>
                    <div className="col-span-1 truncate">{project.especialidad}</div>
                    <div className="col-span-1 truncate">{project.proyectoEstudio}</div>
                  </div>
                </div>
                
                <div className="flex-grow relative p-2 min-h-[42px]">
                  {project.fechaEntrega && (
                    <div 
                      className={`absolute h-6 w-6 rounded-full border border-gray-400 
                        ${isToday(project.fechaEntrega) ? 'bg-cyan-500' : 'bg-white'}
                      `}
                      style={getTaskPosition(project.fechaEntrega)}
                      title={`Fecha de entrega: ${project.fechaEntrega}`}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
