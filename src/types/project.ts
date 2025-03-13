
export interface ProjectData {
  empresa: string;
  nombreProyecto: string;
  fechaEntrega: string;
  id: string;
  estado: string;
  especialidad: string;
  proyectoEstudio: string;
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
}
