
import { useEffect, useState } from 'react';
import ProjectReport from '../components/ProjectReport';
import { ProjectData } from '@/types/project';
import { fetchProjects } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const { toast } = useToast();
  
  // Use the current date for the report
  const reportDate = new Date().toLocaleDateString('es-ES');
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        console.log('Fetched projects from Supabase:', data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="inline-block w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Cargando datos desde Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectReport
      title="Reporte por Empresa Responsable"
      reportDate={reportDate}
      projects={projects}
    />
  );
};

export default Index;
