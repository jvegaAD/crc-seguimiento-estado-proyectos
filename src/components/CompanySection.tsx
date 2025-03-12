
import { sendEmail } from '../utils/emailUtils';
import ProjectTable from './ProjectTable';

interface ProjectData {
  empresa: string;
  nombreProyecto: string;
  fechaEntrega: string;
  id: string;
  estado: string;
  especialidad: string;
  proyectoEstudio: string;
}

interface CompanySectionProps {
  company: string;
  projects: ProjectData[];
  reportDate: string;
}

const CompanySection = ({ company, projects, reportDate }: CompanySectionProps) => {
  const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
  const tableId = `table_${company.replace(/\s+/g, '_')}`;
  
  const handleSendEmail = () => {
    const success = sendEmail(company, tableId);
    if (!success) {
      // Handle error
      console.error('Failed to send email');
    }
  };

  return (
    <section 
      id={companyId} 
      className="mb-20 scroll-mt-20 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="mb-1">
              <a
                href="#companies-index"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                Volver al índice
              </a>
            </div>
            <h2 className="text-2xl font-semibold">{company}</h2>
            <p className="text-sm text-muted-foreground">
              Informe al {reportDate}
            </p>
          </div>
          
          <button 
            onClick={handleSendEmail}
            className="btn-primary group"
          >
            <span className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Enviar Correo
            </span>
          </button>
        </div>
        
        {projects.length > 0 ? (
          <ProjectTable 
            companyId={companyId}
            tableId={tableId}
            data={projects}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No hay proyectos disponibles para esta empresa.
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanySection;
