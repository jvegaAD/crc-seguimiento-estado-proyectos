
import { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/types/project';
import StatusBadge from './table/StatusBadge';
import { ScrollArea } from './ui/scroll-area';

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
  
  // Function to format date as DD/MM
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };
  
  // Function to format date as DD/MM/YYYY
  const formatFullDate = (date: Date) => {
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
  
  // Reference to the timeline area for scrolling
  const timelineRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="overflow-hidden border border-gray-300 rounded-lg shadow-xl animate-fade-in">
      <div className="flex flex-col">
        {/* Header with title columns */}
        <div className="flex">
          <div className="grid grid-cols-6 gap-0 bg-[#040c67] text-white font-medium">
            <div className="p-2 w-[180px] border-r border-gray-500">Nombre Proyecto</div>
            <div className="p-2 w-[100px] border-r border-gray-500">ID</div>
            <div className="p-2 w-[120px] border-r border-gray-500">Empresa</div>
            <div className="p-2 w-[100px] border-r border-gray-500">Estado</div>
            <div className="p-2 w-[120px] border-r border-gray-500">Especialidad</div>
            <div className="p-2 w-[150px]">Proyecto/Estudio</div>
          </div>
          
          {/* Timeline header */}
          <div className="bg-[#040c67] text-white flex-1 overflow-hidden">
            <ScrollArea orientation="horizontal" className="w-full overflow-auto">
              <div className="flex min-w-[800px]" ref={timelineRef}>
                {timelineDates.map((date, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-[40px] p-1 text-center border-r border-gray-500 text-xs"
                    title={formatFullDate(date)}
                  >
                    {formatShortDate(date)}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Projects with timeline */}
        <div className="overflow-auto max-h-[calc(100vh-300px)]">
          {Object.keys(groupedProjects).sort().map((nombreProyecto, groupIndex) => (
            <div key={nombreProyecto} className={`border-b border-gray-200 ${groupIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="font-medium bg-gray-100 px-2 py-1 border-b border-gray-300 sticky left-0">
                {nombreProyecto}
              </div>
              
              {groupedProjects[nombreProyecto].map((project, projectIndex) => (
                <div key={`${project.id}-${projectIndex}`} className="flex hover:bg-gray-100 border-b border-gray-200">
                  {/* Project info columns */}
                  <div className="grid grid-cols-6 gap-0 flex-shrink-0">
                    <div className="p-2 truncate w-[180px] border-r border-gray-200">{project.nombreProyecto}</div>
                    <div className="p-2 truncate w-[100px] border-r border-gray-200">{project.id}</div>
                    <div className="p-2 truncate w-[120px] border-r border-gray-200">{project.empresa}</div>
                    <div className="p-2 w-[100px] border-r border-gray-200">
                      <StatusBadge status={project.estado} />
                    </div>
                    <div className="p-2 truncate w-[120px] border-r border-gray-200">{project.especialidad}</div>
                    <div className="p-2 truncate w-[150px] border-r border-gray-200">{project.proyectoEstudio}</div>
                  </div>
                  
                  {/* Timeline for this project */}
                  <div className="flex-1 relative min-h-[42px] flex-shrink-0">
                    <ScrollArea orientation="horizontal" className="w-full overflow-auto">
                      <div className="flex min-w-[800px] h-full relative">
                        {timelineDates.map((date, dateIndex) => (
                          <div 
                            key={dateIndex} 
                            className="flex-shrink-0 w-[40px] h-full border-r border-gray-200"
                          />
                        ))}
                        
                        {project.fechaEntrega && (
                          <div 
                            className={`absolute top-[8px] h-6 w-6 rounded-full border-2 border-gray-400 flex items-center justify-center
                              ${isToday(project.fechaEntrega) ? 'bg-cyan-500' : 'bg-white'}
                            `}
                            style={getTaskPosition(project.fechaEntrega)}
                            title={`Fecha de entrega: ${project.fechaEntrega}`}
                          />
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
