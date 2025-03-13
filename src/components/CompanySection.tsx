import { useState } from 'react';
import { sendEmail } from '../utils/emailUtils';
import ProjectTable from './ProjectTable';
import { useToast } from '@/hooks/use-toast';
import { ProjectData } from '@/types/project';
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="mb-1">
              <a href="#companies-index" className="text-[12px] font-sans bg-white text-gray-700 \nrounded-md px-3 py-1 my-1 mx-1 border border-gray-300 \nfocus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500\ntransition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
                Volver al índice
              </a>
            </div>
            <h2 className="text-2xl font-semibold">{company}</h2>
            <p className="text-sm text-muted-foreground">
              Informe al {reportDate}
            </p>
          </div>
          
          <button onClick={handleSendEmail} disabled={sending} className="btn-primary group relative">
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
        
        {/* Report date banner */}
        <div className="bg-secondary p-3 rounded-md mb-4 text-center font-medium border-b border-border">
          Fecha del informe: {reportDate}
        </div>
        
        {projects.length > 0 ? <ProjectTable companyId={companyId} tableId={tableId} data={projects} /> : <div className="py-12 text-center text-muted-foreground">
            No hay proyectos disponibles para esta empresa.
          </div>}
      </div>
    </section>;
};
export default CompanySection;