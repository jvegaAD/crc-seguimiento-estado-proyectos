
import { useState, useEffect, memo } from 'react';
import { ProjectData } from '@/types/project';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusFilterProps {
  projects: ProjectData[];
  onFilterChange: (selectedStatuses: string[]) => void;
}

// Pastel colors for status buttons
const STATUS_COLORS = [
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#F1F0FB', // Soft Gray
];

const StatusFilter = ({ projects, onFilterChange }: StatusFilterProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Get unique statuses from all projects
  const uniqueStatuses = [...new Set(projects.map(project => project.estado))].filter(Boolean).sort();
  
  const toggleStatus = (status: string) => {
    const newSelectedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    setSelectedStatuses(newSelectedStatuses);
  };
  
  const selectAll = () => {
    setSelectedStatuses([...uniqueStatuses]);
  };
  
  const deselectAll = () => {
    setSelectedStatuses([]);
  };
  
  // Update parent component when selection changes
  useEffect(() => {
    onFilterChange(selectedStatuses);
  }, [selectedStatuses, onFilterChange]);
  
  if (uniqueStatuses.length === 0) return null;

  // Assign a consistent color to each status
  const getStatusColor = (status: string) => {
    const index = status.charCodeAt(0) % STATUS_COLORS.length;
    return STATUS_COLORS[index];
  };

  return (
    <div className="mb-8 animate-fade-in w-full pl-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO ESTADO</h2>
          
          <div className="flex justify-center gap-2 mb-3 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs hover:bg-[#040c67] hover:text-white"
            >
              Seleccionar todos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deselectAll}
              className="text-xs hover:bg-[#040c67] hover:text-white"
            >
              Deseleccionar todos
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {uniqueStatuses.map(status => {
              const isSelected = selectedStatuses.includes(status);
              const bgColor = getStatusColor(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`
                    px-3 py-1.5 rounded-lg transition-all duration-200 text-sm
                    flex items-center justify-center text-center hover:scale-105
                    border ${isSelected ? 'border-transparent' : 'border-gray-300'} 
                    ${isSelected 
                      ? 'bg-[#040c67] text-primary-foreground shadow-md' 
                      : 'border-gray-300 shadow-sm hover:shadow-md'}
                  `}
                  style={{
                    backgroundColor: isSelected ? '#040c67' : bgColor,
                    color: isSelected ? 'white' : '#333'
                  }}
                >
                  <div className="flex items-center gap-1">
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    <span>{status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(StatusFilter);
