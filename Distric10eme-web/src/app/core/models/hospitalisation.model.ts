export interface Hospitalisation {
  id?: number;
  patientId: number;
  medecinId: number;
  litId: number;
  dateAdmission: string;
  dateSortie?: string;
  motifAdmission?: string;
  observations?: string;
}

export interface Lit {
  id?: number;
  chambreId: number;
  numero: string;
  occupe: boolean;
}

export interface Chambre {
  id?: number;
  serviceId: number;
  numero: string;
}

export interface ServiceHospitalier {
  id?: number;
  nom: string;
  description?: string;
}

