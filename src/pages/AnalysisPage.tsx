
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
import { Button } from '@/components/ui/button';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

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
  
  const selectAllCompanies = () => {
    setSelectedCompanies([...uniqueCompanies]);
  };
  
  const deselectAllCompanies = () => {
    setSelectedCompanies([]);
  };
  
  // Company button colors
  const getCompanyColor = (company: string) => {
    const colors = [
      '#FFB6C1', // Light Pink
      '#87CEFA', // Light Sky Blue
      '#98FB98', // Pale Green
      '#FFA07A', // Light Salmon
      '#DDA0DD', // Plum
      '#FFDAB9', // Peach Puff
      '#B0E0E6', // Powder Blue
      '#FFFACD', // Lemon Chiffon
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
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
    <div className="flex flex-col h-screen">
      <Header title="Análisis" subtitle={`Fecha del informe: ${reportDate}`} date={reportDate} />
      <NavigationMenu />
      
      <div className="flex-1 overflow-hidden px-4 md:px-8">
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
            <div className="p-4 space-y-6">
              <div className="flex flex-row">
                <div className="w-1/3">
                  <ProjectNameFilter projects={projects} onFilterChange={handleProjectFilterChange} />
                </div>
                <div className="w-2/3">
                  <StatusFilter projects={projects} onFilterChange={handleStatusFilterChange} />
                </div>
              </div>
              
              <div className="animate-fade-in">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg md:text-xl font-semibold mb-3 text-[#040c67]">FILTRO EMPRESA</h2>
                    
                    <div className="flex justify-center gap-2 mb-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={selectAllCompanies}
                        className="text-xs hover:bg-[#040c67] hover:text-white"
                      >
                        Seleccionar todos
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={deselectAllCompanies}
                        className="text-xs hover:bg-[#040c67] hover:text-white"
                      >
                        Deseleccionar todos
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                      {uniqueCompanies.map(company => {
                        const isSelected = selectedCompanies.includes(company);
                        const bgColor = getCompanyColor(company);
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
                                : 'border-gray-300 shadow-sm hover:shadow-md'}
                            `}
                            style={{
                              backgroundColor: isSelected ? '#040c67' : bgColor,
                              color: isSelected ? 'white' : '#333'
                            }}
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
            </div>
          </ResizablePanel>
          
          <ResizablePanel defaultSize={75}>
            <div className="p-4">
              <ProjectTable 
                companyId="all-companies" 
                tableId="analysis-table" 
                data={filteredProjects} 
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default AnalysisPage;
