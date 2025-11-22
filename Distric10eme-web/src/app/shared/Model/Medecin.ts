import { Adresse } from "./Adresse";
import { Specialite } from "./Specialite";

export class Medecin{
    public id: number | undefined;
    public nomMedecin : string | undefined;
    public prenomMedecin:string | undefined ;
    public sexeMedecin:string | undefined ;
    public emailMedecin: string | undefined;
    public dateDeNaissanceMedecin: Date | undefined;
    public dateEcheance: Date | undefined;
    public lieuDeNaissanceMedecin: string | undefined;
    public numeroSecuriteSocialeMedecin: string | undefined;
    public telephoneMedecin_1 : string | undefined;
    public telephoneMedecin_2: string | undefined;
    public statutMedecin: string | undefined;
    public numeroRpps: string | undefined;
    public qualifications: string | undefined;
    public inscription_A_lordre: string | undefined;
    public adresse :Adresse | undefined; 
    public specialites :Specialite[] | undefined; 
    public adresse_id?: number; 

}

