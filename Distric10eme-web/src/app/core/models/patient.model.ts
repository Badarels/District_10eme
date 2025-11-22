export interface Patient {
  id?: number;
  numeroDossier: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  groupeSanguin?: string;
  dateEnregistrement?: string;
}

