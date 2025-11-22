export enum StatutRendezVous {
  PLANIFIE = 'PLANIFIE',
  CONFIRME = 'CONFIRME',
  ANNULE = 'ANNULE',
  ABSENT = 'ABSENT',
  TERMINE = 'TERMINE'
}

export interface RendezVous {
  id?: number;
  patientId: number;
  medecinId: number;
  dateHeure: string;
  motif?: string;
  statut?: StatutRendezVous;
  dateCreation?: string;
}

