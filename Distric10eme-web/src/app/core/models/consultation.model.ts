import { Patient } from './patient.model';
import { PersonnelMedical } from './personnel.model';

export type TypeConsultation = 
  | 'CONSULTATION_EXTERNE' 
  | 'URGENCE' 
  | 'SUIVI' 
  | 'VACCINATION' 
  | 'CONSULTATION_PRENATALE' 
  | 'AUTRE';

export interface FichierJoint {
  id?: number;
  nom: string;
  type: string;
  taille: number;
  url: string;
  dateCreation?: string;
}

export interface PrescriptionItem {
  id?: number;
  consultationId?: number;
  medicament: string;
  posologie: string;
  duree: string;
  instructions?: string;
}

export interface ExamenClinique {
  temperature?: number;
  tension?: string;
  pouls?: number;
  observations?: string;
  autres?: string;
}

export interface Consultation {
  id?: number;
  patientId: number;
  patient?: Patient;  // Relation avec le modèle Patient
  medecinId: number;
  medecin?: PersonnelMedical;  // Relation avec le modèle PersonnelMedical
  dateConsultation: string;
  typeConsultation?: TypeConsultation;

  // Champs principaux (mappés sur le backend)
  motif?: string;
  description?: string;

  // Section Anamnèse
  symptomes?: string;

  // Section Examen clinique
  examenClinique?: ExamenClinique;

  // Section Diagnostic
  diagnostic?: string;

  // Section Prescription / Ordonnance
  prescriptions?: PrescriptionItem[];
  prescription?: PrescriptionItem[];

  // Fichiers joints
  piecesJointes?: FichierJoint[];

  // Métadonnées
  dateCreation?: string;
  dateModification?: string;
}

