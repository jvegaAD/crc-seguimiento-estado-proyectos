
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
