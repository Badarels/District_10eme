export type StaffRole =
  | 'MEDECIN'
  | 'INFIRMIER'
  | 'SAGE_FEMME'
  | 'ACCUEIL'
  | 'ADMINISTRATIF'
  | 'TECHNICIEN'
  | 'AUTRE';

export interface Specialite {
  id?: number;
  nom?: string;
  description?: string;
}

export interface Adresse {
  id?: number;
  ville?: string;
  adresseLigne1?: string;
  adresseLigne2?: string;
  codePostal?: string;
  pays?: string;
}

export interface Staff {
  id?: number;
  nom?: string;
  prenom?: string;
  sexe?: string;
  email?: string;
  telephonePrincipal?: string;
  telephoneSecondaire?: string;
  dateNaissance?: string;
