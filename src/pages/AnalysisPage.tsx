
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import StatusFilter from '../components/StatusFilter';
import ProjectNameFilter from '../components/ProjectNameFilter';
import ProjectTable from '../components/ProjectTable';
import NavigationMenu from '../components/NavigationMenu';
import { ProjectData } from '@/types/project';
import { fetchProjects } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { Database, Check } from 'lucide-react';

const AnalysisPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Use the current date for the report
  const reportDate = new Date().toLocaleDateString('es-ES');
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        // Make sure IDs are strings to avoid type issues
        const formattedData = data.map(project => ({
          ...project,
          id: String(project.id)
        }));
        setProjects(formattedData);
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
  
  // Filter projects by status, project name, and company if any are selected
  const filteredProjects = projects.filter(project => {
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(project.estado);
    const projectMatch = selectedProjects.length === 0 || selectedProjects.includes(project.nombreProyecto);
    const companyMatch = selectedCompanies.length === 0 || selectedCompanies.includes(project.empresa);
    return statusMatch && projectMatch && companyMatch;
  });

  const handleStatusFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
  };
  
  const handleProjectFilterChange = (projectNames: string[]) => {
    setSelectedProjects(projectNames);
  };
  
  // Get unique companies from all projects
  const uniqueCompanies = [...new Set(projects.map(project => project.empresa))].filter(Boolean).sort();
  
  const toggleCompany = (company: string) => {
    const newSelectedCompanies = selectedCompanies.includes(company)
      ? selectedCompanies.filter(c => c !== company)
      : [...selectedCompanies, company];
    
    setSelectedCompanies(newSelectedCompanies);
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
      <Header title="Análisis" subtitle={`Fecha del informe: ${reportDate}`} date={reportDate} />
      <NavigationMenu />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-row space-x-4">
          <StatusFilter projects={projects} onFilterChange={handleStatusFilterChange} />
          <ProjectNameFilter projects={projects} onFilterChange={handleProjectFilterChange} />
        </div>
        
        <div className="mb-8 animate-fade-in mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center">
              <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO EMPRESA</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                {uniqueCompanies.map(company => {
                  const isSelected = selectedCompanies.includes(company);
                  return (
                    <button
                      key={company}
                      onClick={() => toggleCompany(company)}
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
                        <span>{company}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <ProjectTable 
            companyId="all-companies" 
            tableId="analysis-table" 
            data={filteredProjects} 
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
