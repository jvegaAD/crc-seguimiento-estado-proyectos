
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import StatusFilter from '../components/StatusFilter';
import GanttChart from '../components/GanttChart';
import NavigationMenu from '../components/NavigationMenu';
import { ProjectData } from '@/types/project';
import { fetchProjects } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Database, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GanttPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const { toast } = useToast();
  
  // Use the current date for the report
  const reportDate = new Date().toLocaleDateString('es-ES');
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
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
  
  // Filter projects by status if any statuses are selected
  const filteredProjects = selectedStatuses.length > 0
    ? projects.filter(project => selectedStatuses.includes(project.estado))
    : projects;

  const handleStatusFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
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
    <div className="min-h-screen pb-20">
      <Header title="Administración de proyectos" subtitle={`17 mar - 10 jul`} date={reportDate} />
      <NavigationMenu />
      
      <div className="page-scroll-container">
        <div className="min-w-[1000px]">
          <div className="px-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <FilterIcon className="w-4 h-4" />
                <span>Filtros ({selectedStatuses.length || 0})</span>
              </Button>
            </div>
            
            {filterVisible && (
              <div className="mb-4">
                <StatusFilter projects={projects} onFilterChange={handleStatusFilterChange} />
              </div>
            )}
            
            <div className="mt-4">
              <GanttChart projects={filteredProjects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttPage;
