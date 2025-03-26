
import { supabase } from "@/integrations/supabase/client";
import { ProjectData } from "@/types/project";

export async function fetchProjects(): Promise<ProjectData[]> {
  try {
    const { data, error } = await supabase
      .from('seguimiento_proyectos')
      .select('*');
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    // Map the data from Supabase schema to our ProjectData interface
    const mappedData: ProjectData[] = data.map(item => ({
      empresa: item.empresa || '',
      nombreProyecto: item.nombre_proyecto || '',
      fechaEntrega: item.fecha_proxima_entrega || '',
      id: String(item.id), // Always convert ID to string to avoid type mismatches
      estado: item.estado || '',
      especialidad: item.especialidad || '',
      proyectoEstudio: item.proyecto_estudio || '',
      fechaInicio: item.fecha_inicio || '', // Add additional fields from the database
      fechaTermino: item.fecha_termino || '',
      tarea: item.tarea || '',
      categoria: item.categoria || '',
      observacion: item.observacion || ''
    }));
    
    console.log('Mapped data from Supabase:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Failed to fetch projects', error);
    return [];
  }
}
