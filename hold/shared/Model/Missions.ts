import { Adresse } from "./Adresse";
import { CentreHospitalier } from "./CentreHospitalier";
import { Medecin } from "./Medecin";
import { Specialite } from "./Specialite";

export class Missions {
  public id?: number; 
  public detailMission?: string;
  public dateMissions?: string;
  public dateFinMissions?: string;
  public typeHoraireMission?: string;
  public salaireMission?: number;
  public statutAnnonce?: string;
  public centreHospitalier?: CentreHospitalier;
  public adresse?: Adresse;
  public medecin?: Medecin; 
  public specialite?: Specialite; 
  public adresse_id?: number; 
  public archived?: number;
  public startTime?:number;
  public endTime?:number;
  
}