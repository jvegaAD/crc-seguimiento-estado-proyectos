
import { useState } from 'react';
import { sendEmail } from '../utils/emailUtils';
import ProjectTable from './ProjectTable';
import { useToast } from '@/hooks/use-toast';
import { ProjectData } from '@/types/project';
import { ChevronUp } from 'lucide-react';

interface CompanySectionProps {
  company: string;
  projects: ProjectData[];
  reportDate: string;
}
const CompanySection = ({
  company,
  projects,
  reportDate
}: CompanySectionProps) => {
  const {
    toast
  } = useToast();
  const [sending, setSending] = useState(false);
  const companyId = `empresa_${company.replace(/\s+/g, '_')}`;
  const tableId = `table_${company.replace(/\s+/g, '_')}`;
  const handleSendEmail = async () => {
    setSending(true);
    try {
      toast({
        title: "Generando imagen de la tabla...",
        description: "Por favor espere mientras se procesa la información."
      });
      const success = await sendEmail(company, tableId);
      if (!success) {
        toast({
          variant: "destructive",
          title: "Error al enviar el correo",
          description: "No se pudo generar la imagen de la tabla. Por favor, inténtelo de nuevo."
        });
      } else {
        toast({
          title: "Imagen generada correctamente",
          description: "Se ha abierto una nueva ventana con la imagen para descargar y adjuntar a su correo."
        });
      }
    } catch (error) {
      console.error('Failed to send email', error);
      toast({
        variant: "destructive",
        title: "Error al enviar el correo",
        description: "Ocurrió un error inesperado. Por favor, inténtelo de nuevo."
      });
    } finally {
      setSending(false);
    }
  };
  return <section id={companyId} className="mb-20 scroll-mt-20 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-full flex justify-between items-center mb-4">
            <div>
              <div className="mb-1">
                <a href="#companies-index" className="inline-flex items-center gap-1 bg-[#040c67] text-white 
                  rounded-md px-3 py-1.5 text-sm font-medium shadow-sm 
                  hover:bg-[#040c67]/90 transition-all">
                  <ChevronUp className="h-4 w-4" />
                  Volver al índice
                </a>
              </div>
              <h2 className="text-2xl font-semibold text-[#040c67]">Reporte por Empresa Responsable: {company}</h2>
              <p className="text-sm text-muted-foreground">
                Informe al {reportDate}
              </p>
            </div>
          </div>
          
          <button onClick={handleSendEmail} disabled={sending} className="btn-primary group relative mb-4">
            <span className="flex items-center gap-2">
              {sending ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </> : <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Enviar Correo
                </>}
            </span>
          </button>
        </div>
        
        {/* Removed the report date banner that was here */}
        
        {projects.length > 0 ? <ProjectTable companyId={companyId} tableId={tableId} data={projects} /> : <div className="py-12 text-center text-muted-foreground">
            No hay proyectos disponibles para esta empresa.
          </div>}
      </div>
    </section>;
};
export default CompanySection;
