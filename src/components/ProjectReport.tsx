
import { useRef, useState, useEffect } from 'react';
import Header from './Header';
import CompanySection from './CompanySection';

// Sample data structure based on the HTML you provided
interface ProjectData {
  empresa: string;
  nombreProyecto: string;
  fechaEntrega: string;
  id: string;
  estado: string;
  especialidad: string;
  proyectoEstudio: string;
}

// Group projects by company
interface CompanyProjects {
  [company: string]: ProjectData[];
}

interface ProjectReportProps {
  title: string;
  reportDate: string;
  projects: ProjectData[];
}

const ProjectReport = ({ title, reportDate, projects }: ProjectReportProps) => {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  
  // Group projects by company
  const groupedProjects = projects.reduce((acc: CompanyProjects, project) => {
    const company = project.empresa;
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(project);
    return acc;
  }, {});
  
  // Sorted unique company names
  const companies = Object.keys(groupedProjects).sort();
  
  // Handle intersection observer for sticky highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const company = id.replace('empresa_', '').replace(/_/g, ' ');
            setActiveCompany(company);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
      }
    );
    
    // Observe all company sections
    companies.forEach(company => {
      const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
      const element = document.getElementById(companyId);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, [companies]);

  const scrollToIndex = () => {
    indexRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      <Header 
        title={title} 
        subtitle="Estado de Proyectos por Empresa"
        date={reportDate}
      />
      
      <div className="max-w-7xl mx-auto px-8 mt-12">
        <button
          onClick={scrollToIndex}
          className="fixed right-8 bottom-8 z-10 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 group animate-float"
          aria-label="Scroll to Index"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="transition-transform group-hover:-translate-y-1" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        
        <div 
          id="companies-index" 
          ref={indexRef}
          className="glass-panel rounded-xl p-8 mb-16 animate-scale-in"
        >
          <h2 className="text-xl font-semibold mb-6">Índice de Empresas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {companies.map(company => {
              const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
              return (
                <a
                  key={company}
                  href={`#${companyId}`}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm
                    ${activeCompany === company 
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                    }`}
                >
                  {company}
                </a>
              );
            })}
          </div>
        </div>
        
        {companies.map(company => (
          <CompanySection
            key={company}
            company={company}
            projects={groupedProjects[company]}
            reportDate={reportDate}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectReport;
