
import { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/types/project';
import StatusBadge from './table/StatusBadge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  ZoomIn, 
  ZoomOut, 
  CalendarRange, 
  Users, 
  Target
} from 'lucide-react';

interface GanttChartProps {
  projects: ProjectData[];
}

// Task type to represent project tasks
interface Task {
  id: string;
  name: string;
  duration: string;  // "X dias"
  startDate?: Date;
  endDate?: Date;
  progress: number;  // 0-100
  subtasks: Task[];
  collapsed: boolean;
  level: number;
  dependencies?: string[]; // IDs of tasks this task depends on
  empresa?: string;
  especialidad?: string;
  proyectoEstudio?: string;
  estado?: string;
  fechaEntrega?: string;
  originalId?: string;
}

const GanttChart = ({ projects }: GanttChartProps) => {
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [zoom, setZoom] = useState<number>(100);
  const [showGuideline, setShowGuideline] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [uniqueProjects, setUniqueProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Extract unique project names and get date ranges
  useEffect(() => {
    if (projects.length > 0) {
      // Get unique project names
      const projectNames = [...new Set(projects.map(p => p.nombreProyecto))];
      setUniqueProjects(projectNames);
      
      // Set the first project as selected by default
      if (projectNames.length > 0 && !selectedProject) {
        setSelectedProject(projectNames[0]);
      }
      
      // For the selected project, find min and max dates for the timeline
      if (selectedProject) {
        const projectData = projects.filter(p => p.nombreProyecto === selectedProject);
        const projectDates = projectData.map(p => p.fechaEntrega ? new Date(p.fechaEntrega) : null).filter(Boolean) as Date[];
        
        if (projectDates.length > 0) {
          const min = new Date(Math.min(...projectDates.map(d => d.getTime())));
          const max = new Date(Math.max(...projectDates.map(d => d.getTime())));
          
          // Add buffer days before and after
          min.setDate(min.getDate() - 5);
          max.setDate(max.getDate() + 5);
          
          setMinDate(min);
          setMaxDate(max);
        }
      }
    }
  }, [projects, selectedProject]);
  
  // Generate tasks for selected project
  useEffect(() => {
    if (!selectedProject || projects.length === 0) return;
    
    // Filter projects for the selected project name
    const projectTasks = projects.filter(p => p.nombreProyecto === selectedProject);
    
    // Create a main task for the project
    const mainTask: Task = {
      id: `project-${selectedProject.replace(/\s+/g, '-')}`,
      name: selectedProject,
      duration: '--- días',
      progress: 0,
      subtasks: [],
      collapsed: false,
      level: 0
    };
    
    // Create subtasks for each item in the filtered projects
    const subtasks: Task[] = projectTasks.map((project, index) => {
      // Parse the date
      const entregaDate = project.fechaEntrega ? new Date(project.fechaEntrega) : undefined;
      
      return {
        id: `task-${index}`,
        originalId: project.id ? project.id.toString() : undefined,
        name: project.especialidad || "",
        empresa: project.empresa || "",
        especialidad: project.especialidad || "",
        proyectoEstudio: project.proyectoEstudio || "",
        estado: project.estado || "",
        fechaEntrega: project.fechaEntrega || "",
        duration: '1 día',
        startDate: entregaDate,
        endDate: entregaDate ? new Date(new Date(entregaDate).setDate(entregaDate.getDate() + 1)) : undefined,
        progress: 50,
        subtasks: [],
        collapsed: false,
        level: 1
      };
    });
    
    mainTask.subtasks = subtasks;
    setTasks([mainTask]);
    
  }, [selectedProject, projects]);
  
  // Toggle task collapse/expand
  const toggleTask = (taskId: string) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, collapsed: !task.collapsed };
        }
        
        // Check if this task has the subtask with the given ID
        const updatedSubtasks = toggleSubtasks(task.subtasks, taskId);
        if (updatedSubtasks !== task.subtasks) {
          return { ...task, subtasks: updatedSubtasks };
        }
        
        return task;
      });
    });
  };
  
  // Helper function to toggle subtasks recursively
  const toggleSubtasks = (subtasks: Task[], taskId: string): Task[] => {
    return subtasks.map(subtask => {
      if (subtask.id === taskId) {
        return { ...subtask, collapsed: !subtask.collapsed };
      }
      
      if (subtask.subtasks.length > 0) {
        const updatedNestedSubtasks = toggleSubtasks(subtask.subtasks, taskId);
        if (updatedNestedSubtasks !== subtask.subtasks) {
          return { ...subtask, subtasks: updatedNestedSubtasks };
        }
      }
      
      return subtask;
    });
  };
  
  // Calculate days between min and max date
  const daysBetween = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate array of dates for the timeline
  const timelineDates = Array.from({ length: daysBetween + 1 }, (_, i) => {
    const date = new Date(minDate);
    date.setDate(date.getDate() + i);
    return date;
  });
  
  // Zoom in timeline
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 20, 200));
  };
  
  // Zoom out timeline
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 20, 50));
  };
  
  // Go to today
  const goToToday = () => {
    const today = new Date();
    const todayPosition = timelineDates.findIndex(date => 
      date.getDate() === today.getDate() && 
      date.getMonth() === today.getMonth() && 
      date.getFullYear() === today.getFullYear()
    );
    
    if (todayPosition !== -1 && scrollContainerRef.current) {
      const cellWidth = (40 * zoom) / 100;
      scrollContainerRef.current.scrollLeft = todayPosition * cellWidth - 300;
    }
  };
  
  // Function to format date as DD/MM
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  };
  
  // Month and year for header
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Function to format date as DD MMM
  const formatDayMonth = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  };
  
  // Calculate today's position on timeline
  const todayPosition = (() => {
    const today = new Date();
    const diffTime = today.getTime() - minDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(diffDays, daysBetween));
  })();
  
  // Calculate task position and width on the timeline
  const getTaskPosition = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return { left: 0, width: 0 };
    
    const startDiffDays = Math.max(0, Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    const endDiffDays = Math.max(0, Math.ceil((endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const cellWidth = (40 * zoom) / 100;
    const left = startDiffDays * cellWidth;
    const width = Math.max(cellWidth, (endDiffDays - startDiffDays) * cellWidth);
    
    return {
      left: `${left}px`,
      width: `${width}px`,
    };
  };
  
  // Function to render an individual task row
  const renderTaskRow = (task: Task, isVisible: boolean = true) => {
    const taskStyle = getTaskPosition(task.startDate, task.endDate);
    const isCollapsible = task.subtasks.length > 0;
    
    return (
      <div key={task.id}>
        <div className={`flex hover:bg-gray-100 border-b border-gray-200 ${!isVisible ? 'hidden' : ''}`}>
          {/* Task info columns */}
          <div className="flex flex-shrink-0 items-center">
            <div className="w-12 text-center text-gray-500">{task.originalId || ""}</div>
            <div className="w-8 flex justify-center">
              <button 
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200" 
                onClick={() => toggleTask(task.id)}
                disabled={!isCollapsible}
              >
                {isCollapsible ? (
                  task.collapsed ? 
                    <ChevronRight className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                ) : null}
              </button>
            </div>
            <div 
              className="p-2 w-[220px] truncate overflow-hidden flex items-center"
              style={{ paddingLeft: `${task.level * 20 + 8}px` }}
            >
              {task.name}
            </div>
            {task.level > 0 && (
              <>
                <div className="p-2 w-[120px] truncate overflow-hidden">{task.empresa || ""}</div>
                <div className="p-2 w-[120px] truncate overflow-hidden">{task.especialidad || ""}</div>
                <div className="p-2 w-[120px] truncate overflow-hidden">{task.proyectoEstudio || ""}</div>
                <div className="p-2 w-[100px] text-center">
                  {task.estado && <StatusBadge status={task.estado} />}
                </div>
                <div className="p-2 w-[100px] text-center">{task.fechaEntrega || ""}</div>
              </>
            )}
          </div>
          
          {/* Timeline for this task */}
          <div className="flex-1 relative min-h-[38px] flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {task.startDate && task.endDate && (
                <div 
                  className={`absolute top-[8px] h-5 rounded-sm ${
                    task.level === 0 ? 'bg-blue-500' : 'bg-cyan-400'
                  }`}
                  style={{
                    ...taskStyle,
                    opacity: 0.8
                  }}
                >
                  <div 
                    className="h-full bg-blue-700" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              )}
              
              {/* Draw dependency lines */}
              {task.dependencies?.map(depId => {
                // Find the dependent task
                let dependentTask: Task | undefined;
                for (const t of tasks) {
                  if (t.id === depId) {
                    dependentTask = t;
                    break;
                  }
                  for (const st of t.subtasks) {
                    if (st.id === depId) {
                      dependentTask = st;
                      break;
                    }
                    for (const nst of st.subtasks) {
                      if (nst.id === depId) {
                        dependentTask = nst;
                        break;
                      }
                    }
                  }
                }
                
                if (dependentTask?.endDate && task.startDate) {
                  const fromPos = getTaskPosition(dependentTask.startDate, dependentTask.endDate);
                  const fromRight = parseInt(fromPos.left) + parseInt(fromPos.width);
                  const toLeft = parseInt(taskStyle.left);
                  
                  return (
                    <svg
                      key={`dep-${depId}-${task.id}`}
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      <path
                        d={`M ${fromRight} 15 C ${fromRight + 20} 15, ${toLeft - 20} 15, ${toLeft} 15`}
                        stroke="#9CA3AF"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="3,3"
                      />
                      <circle cx={toLeft} cy={15} r={3} fill="#9CA3AF" />
                    </svg>
                  );
                }
                
                return null;
              })}
            </div>
          </div>
        </div>
        
        {/* Render subtasks recursively */}
        {!task.collapsed && task.subtasks.map(subtask => renderTaskRow(subtask, isVisible))}
      </div>
    );
  };
  
  return (
    <div className="border border-gray-300 rounded-lg shadow-xl animate-fade-in flex flex-col h-full overflow-hidden">
      {/* Project selector */}
      <div className="bg-gray-50 p-3 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <div className="font-medium text-gray-700">Seleccionar proyecto:</div>
          <div className="flex flex-wrap gap-2">
            {uniqueProjects.map(project => (
              <Button
                key={project}
                variant={selectedProject === project ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProject(project)}
                className="text-xs"
              >
                {project}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700">Carta Gantt: {selectedProject}</span>
          <span className="text-sm text-gray-500">
            {minDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} - 
            {maxDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-sm mr-2">Zoom</span>
            <div className="w-32 h-4 bg-gray-300 rounded relative">
              <div 
                className="absolute h-full bg-blue-500 rounded"
                style={{ width: `${zoom/2}%` }}
              ></div>
              <input 
                type="range" 
                min="50" 
                max="200" 
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="w-full h-full absolute opacity-0 cursor-pointer" 
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomOut}
            className="text-xs h-8"
          >
            <ZoomOut className="w-4 h-4 mr-1" />
            <span>-</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={zoomIn}
            className="text-xs h-8"
          >
            <ZoomIn className="w-4 h-4 mr-1" />
            <span>+</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="text-xs h-8"
          >
            <CalendarRange className="w-4 h-4 mr-1" />
            <span>Ir a la fecha</span>
          </Button>
        </div>
      </div>
      
      <div className="relative flex-grow flex flex-col overflow-hidden">
        {/* Fixed top header with columns */}
        <div className="flex border-b border-gray-300 bg-white sticky top-0 z-10">
          <div className="flex flex-shrink-0 bg-gray-50 border-r border-gray-300">
            <div className="w-12 py-2 font-medium text-center">ID</div>
            <div className="w-8"></div>
            <div className="py-2 w-[220px] font-medium">Nombre de Tarea</div>
            <div className="py-2 w-[120px] font-medium">Empresa</div>
            <div className="py-2 w-[120px] font-medium">Especialidad</div>
            <div className="py-2 w-[120px] font-medium">Proyecto/Estudio</div>
            <div className="py-2 w-[100px] font-medium text-center">Estado</div>
            <div className="py-2 w-[100px] font-medium text-center">Fecha Entrega</div>
          </div>
          
          {/* Timeline header */}
          <div className="bg-white flex-1">
            <div className="flex" style={{ height: '24px' }}>
              {/* Monthly headers */}
              {timelineDates.filter((_, i) => i === 0 || timelineDates[i-1].getMonth() !== timelineDates[i].getMonth()).map((date, i, filteredDates) => {
                const nextMonthIndex = i + 1 < filteredDates.length 
                  ? timelineDates.findIndex(d => 
                      d.getMonth() === filteredDates[i+1].getMonth() && 
                      d.getFullYear() === filteredDates[i+1].getFullYear()) 
                  : timelineDates.length;
                const currentMonthIndex = timelineDates.findIndex(d => 
                  d.getMonth() === date.getMonth() && 
                  d.getFullYear() === date.getFullYear());
                const width = ((nextMonthIndex - currentMonthIndex) * 40 * zoom) / 100;
                
                return (
                  <div 
                    key={`month-${i}`} 
                    className="border-r border-gray-300 text-xs font-medium flex items-center justify-center bg-gray-50 text-gray-700"
                    style={{ 
                      width: `${width}px`,
                      minWidth: `${width}px`
                    }}
                  >
                    {formatMonthYear(date)}
                  </div>
                );
              })}
            </div>
            
            <div className="flex">
              {/* Daily headers */}
              {timelineDates.map((date, index) => {
                const cellWidth = (40 * zoom) / 100;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                  <div 
                    key={`day-${index}`} 
                    className={`flex-shrink-0 border-r border-gray-200 text-center text-xs py-1
                      ${isWeekend ? 'bg-gray-50' : ''}
                      ${isToday ? 'bg-blue-50 font-medium' : ''}
                    `}
                    style={{ 
                      width: `${cellWidth}px`, 
                      minWidth: `${cellWidth}px` 
                    }}
                  >
                    <div>{date.getDate()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Scrollable content area */}
        <ScrollArea className="flex-grow overflow-auto" ref={scrollContainerRef}>
          <div className="relative" style={{ 
            width: `${800 + timelineDates.length * ((40 * zoom) / 100)}px`,
            minHeight: `${Math.max(400, tasks.reduce((height, task) => height + (1 + task.subtasks.length) * 38, 0))}px`
          }}>
            {/* Timeline today guideline */}
            {showGuideline && (
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-5 pointer-events-none"
                style={{ 
                  left: `${(todayPosition * 40 * zoom) / 100 + 800}px`
                }}
              ></div>
            )}
            
            {/* Tasks with timeline */}
            <div className="relative">
              {tasks.map(task => renderTaskRow(task))}
              
              {/* Timeline grid background */}
              <div className="absolute top-0 left-[800px] right-0 bottom-0 pointer-events-none">
                <div className="h-full flex">
                  {timelineDates.map((date, index) => {
                    const cellWidth = (40 * zoom) / 100;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    
                    return (
                      <div 
                        key={`grid-${index}`} 
                        className={`border-r border-gray-100 ${isWeekend ? 'bg-gray-50/30' : ''}`}
                        style={{ 
                          width: `${cellWidth}px`,
                          height: `${tasks.length * 38}px`
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Fixed scrollbar at bottom */}
        <div className="h-12 border-t border-gray-200 bg-gray-50 flex items-center px-4 sticky bottom-0 left-0 right-0">
          <div className="w-full relative h-4 bg-gray-200 rounded">
            <div className="absolute top-0 left-0 h-full bg-blue-400 rounded"
                style={{ width: `100%` }}></div>
            <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
              <span className="text-xs text-gray-700 font-medium">
                {minDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-xs text-gray-700 font-medium">
                {maxDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
