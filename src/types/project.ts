
export interface ProjectData {
  empresa: string;
  nombreProyecto: string;
  fechaEntrega: string;
  id: string;
  estado: string;
  especialidad: string;
  proyectoEstudio: string;
  // Additional fields from the database
  fechaInicio?: string;
  fechaTermino?: string;
  tarea?: string;
  categoria?: string;
  observacion?: string;
}

export interface SortConfig {
  key: keyof ProjectData | null;
  direction: 'asc' | 'desc';
}

export interface SupabaseProject {
  id: number;
  nombre_proyecto: string | null;
  fecha_entrega_proyectada: string | null;
  proyecto_estudio: string | null;
  estado: string | null;
  especialidad: string | null;
  empresa: string | null;
  fecha_inicio: string | null;
  fecha_termino: string | null;
  tarea: string | null;
  categoria: string | null;
  observacion: string | null;
}
