import { Pipe, PipeTransform } from '@angular/core';
import { Missions } from '../shared/Model/Missions';

@Pipe({
    name: 'mission',
    standalone: false
})
export class MissionPipe implements PipeTransform {

  transform(missions: Missions[], searchText: string): any[] {
    if (!missions || !searchText) {
      return missions;
    }
  
    const searchTextLower = this.removeAccents(searchText.trim().toLowerCase());
  
    return missions.filter(mission => {
      const fullMission = `${mission?.detailMission} ${mission?.dateMissions}  ${mission?.typeHoraireMission}
        ${mission.medecin?.emailMedecin}
        ${mission.medecin?.prenomMedecin} ${mission.medecin?.nomMedecin}
        ${mission.specialite?.nomSpecialite}
        ${mission.centreHospitalier?.nom_ch}
        ${mission.centreHospitalier?.adresse?.departement}
        ${mission.centreHospitalier?.adresse?.numeroRue} 
        ${mission.centreHospitalier?.adresse?.nomRue} 
        ${mission.centreHospitalier?.adresse?.codePostal}`.toLowerCase();
  
      const fullNameRegex = new RegExp(`\\b${this.escapeRegExp(searchTextLower)}\\b`);
      return this.removeAccents(fullMission).match(fullNameRegex) !== null;
    });
   }
  
  private escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  private removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}  