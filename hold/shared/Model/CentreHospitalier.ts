

import { Adresse } from "./Adresse";

export class CentreHospitalier {
  public id?: number; 
  public nom_ch?: string;
  public siret?: string;
  public email_ch?: string;
  public telephone?: string;
  public adresse?: Adresse;
  public adresse_id?: number; 
  public archived?: number; 
}