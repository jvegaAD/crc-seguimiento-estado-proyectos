
import { useState, useEffect, memo } from 'react';
import { ProjectData } from '@/types/project';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectNameFilterProps {
  projects: ProjectData[];
  onFilterChange: (selectedProjects: string[]) => void;
}

// More vibrant pastel colors for project buttons
const PASTEL_COLORS = [
  '#FFB6C1', // Light Pink
  '#87CEFA', // Light Sky Blue
  '#98FB98', // Pale Green
  '#FFA07A', // Light Salmon
  '#DDA0DD', // Plum
  '#FFDAB9', // Peach Puff
  '#B0E0E6', // Powder Blue
  '#FFFACD', // Lemon Chiffon
  '#E6E6FA', // Lavender
  '#F0E68C', // Khaki
  '#FFE4B5', // Moccasin
  '#AFEEEE', // Pale Turquoise
];

const ProjectNameFilter = ({ projects, onFilterChange }: ProjectNameFilterProps) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  // Get unique project names from all projects
  const uniqueProjectNames = [...new Set(projects.map(project => project.nombreProyecto))]
    .filter(Boolean)
    .sort();
  
  const toggleProject = (projectName: string) => {
    const newSelectedProjects = selectedProjects.includes(projectName)
      ? selectedProjects.filter(p => p !== projectName)
      : [...selectedProjects, projectName];
    
    setSelectedProjects(newSelectedProjects);
  };
  
  const selectAll = () => {
    setSelectedProjects([...uniqueProjectNames]);
  };
  
  const deselectAll = () => {
    setSelectedProjects([]);
  };
  
  // Update parent component when selection changes
  useEffect(() => {
    onFilterChange(selectedProjects);
  }, [selectedProjects, onFilterChange]);
  
  if (uniqueProjectNames.length === 0) return null;

  // Assign a consistent color to each project name
  const getProjectColor = (projectName: string) => {
    const index = projectName.charCodeAt(0) % PASTEL_COLORS.length;
    return PASTEL_COLORS[index];
  };

  return (
    <div className="mb-8 animate-fade-in w-full pr-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO PROYECTO</h2>
          
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
          
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 subtle-scroll w-full">
            {uniqueProjectNames.map(projectName => {
              const isSelected = selectedProjects.includes(projectName);
              const bgColor = getProjectColor(projectName);
              return (
                <button
                  key={projectName}
                  onClick={() => toggleProject(projectName)}
                  className={`
                    px-3 py-1.5 rounded-lg transition-all duration-200 text-sm
                    flex items-center justify-start text-left hover:scale-105
                    border ${isSelected ? 'border-transparent' : 'border-gray-300'} 
                    ${isSelected 
                      ? 'bg-[#040c67] text-primary-foreground shadow-md' 
                      : `border-gray-300 shadow-sm hover:shadow-md`}
                  `}
                  style={{
                    backgroundColor: isSelected ? '#040c67' : bgColor,
                    color: isSelected ? 'white' : '#333'
                  }}
                >
                  <div className="flex items-center gap-1">
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    <span className="truncate">{projectName}</span>
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

export default memo(ProjectNameFilter);
