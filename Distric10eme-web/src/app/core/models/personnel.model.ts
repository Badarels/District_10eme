export enum TypePersonnel {
  MEDECIN = 'MEDECIN',
  INFIRMIER = 'INFIRMIER',
  AIDE_SOIGNANT = 'AIDE_SOIGNANT',
  PHARMACIEN = 'PHARMACIEN',
  TECHNICIEN_LABORATOIRE = 'TECHNICIEN_LABORATOIRE',
  RADIOLOGUE = 'RADIOLOGUE',
  KINESITHERAPEUTE = 'KINESITHERAPEUTE',
  SECRETAIRE_MEDICAL = 'SECRETAIRE_MEDICAL',
  ADMINISTRATEUR = 'ADMINISTRATEUR'
}

export interface PersonnelMedical {
  id?: number;
  numeroOrdre?: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  email: string;
  telephone?: string;
  adresse?: string;
  typePersonnel: TypePersonnel;
  specialiteId?: number;
  specialiteNom?: string;
  numeroLicence?: string;
  dateEmbauche?: string;
  actif: boolean;
  dateCreation?: string;
  dateModification?: string;
}

export interface Specialite {
  id?: number;
  nom: string;
  description?: string;
}
