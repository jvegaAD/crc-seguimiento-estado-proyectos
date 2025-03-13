
import { useEffect, useState } from 'react';
import ProjectReport from '../components/ProjectReport';

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

const Index = () => {
  const [loading, setLoading] = useState(true);
  
  // In a real application, you would fetch this data from the Excel file
  const reportDate = "12/03/2025";
  
  // Sample data for demonstration - in production, this would be loaded from Excel
  // Data file location: src/data/excel/projects.xlsx
  const sampleProjects: ProjectData[] = [
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "23-01-2025",
      id: "14",
      estado: "OK",
      especialidad: "Modificación MP",
      proyectoEstudio: "Expediente Arquitectura para MP",
    },
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "31-01-2025",
      id: "9",
      estado: "OK",
      especialidad: "Convenio SERVIU",
      proyectoEstudio: "Tramitar recepción de observaciones.",
    },
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "20-02-2025",
      id: "54",
      estado: "Pendiente",
      especialidad: "Arq. y Especialidades",
      proyectoEstudio: "Expediente de Construcción General.",
    },
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "10-03-2025",
      id: "17",
      estado: "En Proceso",
      especialidad: "Arquitectura II",
      proyectoEstudio: "Ingreso de Modificación Permiso.",
    },
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "09-05-2025",
      id: "18",
      estado: "En Proceso",
      especialidad: "Arquitectura II",
      proyectoEstudio: "Aprobacion Modificación Permiso.",
    },
    {
      empresa: "AAA",
      nombreProyecto: "ADP",
      fechaEntrega: "05-02-2026",
      id: "19",
      estado: "OK",
      especialidad: "Arquitectura",
      proyectoEstudio: "Expediente Construcción de Arquitectura",
    },
    {
      empresa: "CRC",
      nombreProyecto: "Torres Vista",
      fechaEntrega: "15-05-2025",
      id: "22",
      estado: "Pendiente",
      especialidad: "Ingeniería Estructural",
      proyectoEstudio: "Diseño de estructuras antisísmicas",
    },
    {
      empresa: "CRC",
      nombreProyecto: "Parque Urbano",
      fechaEntrega: "30-06-2025",
      id: "27",
      estado: "En Proceso",
      especialidad: "Paisajismo",
      proyectoEstudio: "Planos de áreas verdes y ornamentación",
    },
    {
      empresa: "EMIN",
      nombreProyecto: "Centro Comercial Norte",
      fechaEntrega: "10-04-2025",
      id: "31",
      estado: "OK",
      especialidad: "Sistemas Eléctricos",
      proyectoEstudio: "Instalaciones de alta tensión",
    },
    {
      empresa: "Roberto Soto",
      nombreProyecto: "Residencial Los Pinos",
      fechaEntrega: "22-07-2025",
      id: "42",
      estado: "Pendiente",
      especialidad: "Arquitectura",
      proyectoEstudio: "Planos de fachada",
    },
  ];

  useEffect(() => {
    // Simulate data loading from Excel file
    const timer = setTimeout(() => {
      setLoading(false);
      console.log("Data would be loaded from src/data/excel/projects.xlsx in production");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="inline-block w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Cargando informe...</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectReport
      title="Reporte por Empresa Responsable"
      reportDate={reportDate}
      projects={sampleProjects}
    />
  );
};

export default Index;
