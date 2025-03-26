
import { useState, useEffect, memo } from 'react';
import { ProjectData } from '@/types/project';
import { Check } from 'lucide-react';

interface ProjectNameFilterProps {
  projects: ProjectData[];
  onFilterChange: (selectedProjects: string[]) => void;
}

// Pastel colors for project buttons
const PASTEL_COLORS = [
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#F1F0FB', // Soft Gray
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
    <div className="mb-8 animate-fade-in w-1/2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO PROYECTO</h2>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 subtle-scroll">
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
