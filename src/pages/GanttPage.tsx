
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import GanttChart from '../components/GanttChart';
import NavigationMenu from '../components/NavigationMenu';
import { ProjectData } from '@/types/project';
import { fetchProjects } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';
import StatusFilter from '../components/StatusFilter';
import ProjectNameFilter from '../components/ProjectNameFilter';

const GanttPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Use the current date for the report
  const reportDate = new Date().toLocaleDateString('es-ES');
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        // Ensure all required data is correctly formatted for GanttChart
        const formattedData = data.map(project => ({
          ...project,
          // Convert numeric fields to strings if needed
          id: String(project.id)
        }));
        setProjects(formattedData);
        setFilteredProjects(formattedData);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          variant: "destructive",
          title: "Error al cargar proyectos",
          description: "No se pudieron cargar los datos de proyectos desde Supabase.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, [toast]);

  // Filter projects when status or project name filters change
  useEffect(() => {
    let filtered = [...projects];
    
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(project => 
        selectedStatuses.includes(project.estado)
      );
    }
    
    if (selectedProjects.length > 0) {
      filtered = filtered.filter(project => 
        selectedProjects.includes(project.nombreProyecto)
      );
    }
    
    setFilteredProjects(filtered);
  }, [selectedStatuses, selectedProjects, projects]);

  const handleStatusFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
  };

  const handleProjectFilterChange = (projectNames: string[]) => {
    setSelectedProjects(projectNames);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="inline-block w-16 h-16 relative mb-8">
            <Database className="w-16 h-16 text-[#040c67] animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-[#040c67] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-muted-foreground">Cargando datos desde Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Carta Gantt de Proyectos" subtitle="Visualización de cronograma" date={reportDate} />
      <NavigationMenu />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="flex flex-row mb-4">
          <div className="w-1/3">
            <ProjectNameFilter projects={projects} onFilterChange={handleProjectFilterChange} />
          </div>
          <div className="w-2/3">
            <StatusFilter projects={projects} onFilterChange={handleStatusFilterChange} />
          </div>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col p-4 pb-0 overflow-hidden">
        <div className="flex-grow overflow-hidden flex flex-col">
          <GanttChart projects={filteredProjects} />
        </div>
      </div>
    </div>
  );
};

export default GanttPage;
