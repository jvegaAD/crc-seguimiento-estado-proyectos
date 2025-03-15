
import { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/types/project';
import StatusBadge from './table/StatusBadge';
import { Button } from '@/components/ui/button';
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
}

const GanttChart = ({ projects }: GanttChartProps) => {
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const [zoom, setZoom] = useState<number>(100);
  const [showGuideline, setShowGuideline] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Generate sample tasks from project data
  useEffect(() => {
    if (projects.length > 0) {
      // Group projects by nombreProyecto to create task hierarchies
      const projectGroups = projects.reduce((acc, project) => {
        if (!acc[project.nombreProyecto]) {
          acc[project.nombreProyecto] = [];
        }
        acc[project.nombreProyecto].push(project);
        return acc;
      }, {} as Record<string, ProjectData[]>);
      
      // Transform project data into tasks with subtasks
      const transformedTasks: Task[] = [];
      
      Object.keys(projectGroups).forEach((projectName, index) => {
        // Create parent task
        const mainTask: Task = {
          id: `task-${index}`,
          name: projectName,
          duration: '7,5 días',
          startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          progress: 30,
          subtasks: [],
          collapsed: false,
          level: 0
        };
        
        // Create subtasks based on projects in the group
        const projects = projectGroups[projectName];
        const subtasks: Task[] = projects.map((project, subIndex) => {
          return {
            id: `task-${index}-${subIndex}`,
            name: `${project.especialidad} - ${project.estado}`,
            duration: '1 día',
            startDate: project.fechaEntrega ? new Date(project.fechaEntrega) : 
              new Date(new Date().setDate(new Date().getDate() + subIndex)),
            endDate: project.fechaEntrega ? 
              new Date(new Date(project.fechaEntrega).setDate(new Date(project.fechaEntrega).getDate() + 1)) : 
              new Date(new Date().setDate(new Date().getDate() + subIndex + 1)),
            progress: subIndex * 10 % 100, // Sample progress
            subtasks: [],
            collapsed: false,
            level: 1,
            dependencies: subIndex > 0 ? [`task-${index}-${subIndex-1}`] : undefined
          };
        });
        
        // Add some sample nested subtasks to the first subtask if it exists
        if (subtasks.length > 0) {
          const nestedTasks = [
            {
              id: `task-${index}-0-0`,
              name: 'Identificar objetivos y metas',
              duration: '1 día',
              startDate: subtasks[0].startDate,
              endDate: new Date(subtasks[0].startDate!.getTime() + 24*60*60*1000),
              progress: 50,
              subtasks: [],
              collapsed: false,
              level: 2
            },
            {
              id: `task-${index}-0-1`,
              name: 'Desarrollar estrategias y planes',
              duration: '1 día',
              startDate: new Date(subtasks[0].startDate!.getTime() + 24*60*60*1000),
              endDate: new Date(subtasks[0].startDate!.getTime() + 2*24*60*60*1000),
              progress: 25,
              subtasks: [],
              collapsed: false,
              level: 2,
              dependencies: [`task-${index}-0-0`]
            }
          ];
          
          subtasks[0].subtasks = nestedTasks;
        }
        
        mainTask.subtasks = subtasks;
        transformedTasks.push(mainTask);
      });
      
      setTasks(transformedTasks);
      
      // Find min and max dates for the timeline
      const allStartDates = transformedTasks.flatMap(task => {
        const taskStartDate = task.startDate ? [task.startDate] : [];
        const subtaskStartDates = task.subtasks.flatMap(subtask => {
          return subtask.startDate ? [subtask.startDate] : [];
        });
        return [...taskStartDate, ...subtaskStartDates];
      });
      
      const allEndDates = transformedTasks.flatMap(task => {
        const taskEndDate = task.endDate ? [task.endDate] : [];
        const subtaskEndDates = task.subtasks.flatMap(subtask => {
          return subtask.endDate ? [subtask.endDate] : [];
        });
        return [...taskEndDate, ...subtaskEndDates];
      });
      
      if (allStartDates.length > 0 && allEndDates.length > 0) {
        const min = new Date(Math.min(...allStartDates.map(d => d.getTime())));
        const max = new Date(Math.max(...allEndDates.map(d => d.getTime())));
        
        // Add buffer days before and after
        min.setDate(min.getDate() - 5);
        max.setDate(max.getDate() + 5);
        
        setMinDate(min);
        setMaxDate(max);
      }
    }
  }, [projects]);
  
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
      <>
        <div className={`flex hover:bg-gray-100 border-b border-gray-200 ${!isVisible ? 'hidden' : ''}`}>
          {/* Task info columns */}
          <div className="flex flex-shrink-0 items-center">
            <div className="w-12 text-center text-gray-500">{task.id.split('-')[1]}</div>
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
              className="p-2 w-[350px] truncate overflow-hidden flex items-center"
              style={{ paddingLeft: `${task.level * 20 + 8}px` }}
            >
              {task.name}
            </div>
            <div className="p-2 w-[100px] text-center border-l border-gray-200">{task.duration}</div>
          </div>
          
          {/* Timeline for this task */}
          <div className="flex-1 relative min-h-[38px] flex-shrink-0">
            <div className="absolute top-0 left-0 right-0 bottom-0">
              {task.startDate && task.endDate && (
                <div 
                  className={`absolute top-[8px] h-5 rounded-sm ${
                    task.level === 0 ? 'bg-blue-500' : 
                    task.level === 1 ? 'bg-blue-400' : 'bg-blue-300'
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
      </>
    );
  };
  
  return (
    <div className="border border-gray-300 rounded-lg shadow-xl animate-fade-in">
      {/* Toolbar */}
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-700">Administración de proyectos</span>
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
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs h-8"
          >
            <Users className="w-4 h-4 mr-1" />
            <span>Miembros del grupo</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs h-8"
          >
            <Target className="w-4 h-4 mr-1" />
            <span>Objetivos</span>
          </Button>
        </div>
      </div>
      
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-300 flex text-sm">
        <div className="px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-600">Cuadrícula</div>
        <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">Panel</div>
        <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">Escala de tiempo</div>
        <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">Gráficos</div>
        <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">Personas</div>
        <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">Objetivos</div>
      </div>
      
      <div className="relative">
        <div className="min-w-[1200px] overflow-x-auto" ref={scrollContainerRef}>
          {/* Header with title columns and timeline header */}
          <div className="flex border-b border-gray-300 bg-white sticky top-0 z-10">
            <div className="flex flex-shrink-0 bg-gray-50 border-r border-gray-300">
              <div className="w-12 py-2 font-medium text-center">#</div>
              <div className="w-8"></div>
              <div className="py-2 w-[350px] font-medium border-l border-gray-200">Nombre de tarea</div>
              <div className="py-2 w-[100px] font-medium text-center border-l border-gray-200">Duración</div>
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
                      key={index} 
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
          
          {/* Timeline today guideline */}
          {showGuideline && (
            <div 
              className="absolute top-0 bottom-0 w-[1px] bg-red-500 z-5 pointer-events-none"
              style={{ 
                left: `${(todayPosition * 40 * zoom) / 100 + 470}px`,
                height: `${(tasks.length * 38) + 100}px`
              }}
            ></div>
          )}
          
          {/* Tasks with timeline */}
          <div className="relative">
            {tasks.map(task => renderTaskRow(task))}
            
            {/* Timeline grid background */}
            <div className="absolute top-0 left-[470px] right-0 bottom-0 pointer-events-none">
              <div className="h-full flex">
                {timelineDates.map((date, index) => {
                  const cellWidth = (40 * zoom) / 100;
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <div 
                      key={index} 
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
      </div>
    </div>
  );
};

export default GanttChart;
