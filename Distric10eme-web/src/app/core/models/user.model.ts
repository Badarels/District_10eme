export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  roleId?: number;
  roleNom?: string;
  dateCreation?: string;
  dateModification?: string;
}

export interface Role {
  id?: number;
  nom: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  utilisateur: Utilisateur;
}

