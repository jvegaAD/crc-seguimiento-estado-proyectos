
import { useState, useEffect, memo } from 'react';
import { ProjectData } from '@/types/project';
import { Check } from 'lucide-react';

interface StatusFilterProps {
  projects: ProjectData[];
  onFilterChange: (selectedStatuses: string[]) => void;
}

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
  
  // Update parent component when selection changes
  useEffect(() => {
    onFilterChange(selectedStatuses);
  }, [selectedStatuses, onFilterChange]);
  
  if (uniqueStatuses.length === 0) return null;

  return (
    <div className="mb-8 animate-fade-in w-1/2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO ESTADO</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {uniqueStatuses.map(status => {
              const isSelected = selectedStatuses.includes(status);
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
                      : 'bg-[#F1F0FB] hover:bg-[#E8E7F5] border-gray-300 shadow-sm hover:shadow-md'}
                  `}
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
