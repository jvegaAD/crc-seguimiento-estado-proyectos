import { useRef, useState, useEffect } from 'react';
import Header from './Header';
import CompanySection from './CompanySection';
import { ProjectData } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Grid2X2 } from 'lucide-react';

// Group projects by company
interface CompanyProjects {
  [company: string]: ProjectData[];
}
interface ProjectReportProps {
  title: string;
  reportDate: string;
  projects: ProjectData[];
}
const ProjectReport = ({
  title,
  reportDate,
  projects
}: ProjectReportProps) => {
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
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const company = id.replace('empresa_', '').replace(/_/g, ' ');
          setActiveCompany(company);
        }
      });
    }, {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    });

    // Observe all company sections
    companies.forEach(company => {
      const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
      const element = document.getElementById(companyId);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [companies]);
  const scrollToIndex = () => {
    indexRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen pb-20">
      <Header title={title} subtitle={`Fecha del informe: ${reportDate}`} date={reportDate} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <Button onClick={scrollToIndex} className="fixed right-8 bottom-8 z-10 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 group animate-float" aria-label="Scroll to Index" size="icon">
          <Grid2X2 className="transition-transform group-hover:-translate-y-1" />
        </Button>
        
        <div id="companies-index" ref={indexRef} className="glass-panel rounded-2xl p-8 md:p-10 mb-12 animate-fade-in shadow-xl \npx-6 py-4 my-[30px] mx-[60px] bg-gradient-to-r from-white via-gray-100 to-white \ntext-gray-900 text-lg font-semibold tracking-wide border border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Índice de Empresas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {companies.map(company => {
            const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
            const isActive = activeCompany === company;
            return <a key={company} href={`#${companyId}`} className={`
                    px-3 py-2 rounded-lg transition-all duration-200 text-sm
                    flex items-center justify-center text-center hover:scale-105
                    ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/70 hover:bg-secondary shadow-sm'}
                  `}>
                  {company}
                </a>;
          })}
          </div>
        </div>
        
        {companies.map(company => <CompanySection key={company} company={company} projects={groupedProjects[company]} reportDate={reportDate} />)}
      </div>
    </div>;
};
export default ProjectReport;