import { Pipe, PipeTransform } from '@angular/core';
import { Medecin } from '../shared/Model/Medecin';

@Pipe({
    name: 'search',
    standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(medecins: Medecin[], searchText: string): any[] {
    if (!medecins || !searchText) {
      return medecins;
    }

    const searchTextLower = searchText.trim().toLowerCase();

    return medecins.filter(medecin => {
      const specialitesLowerCase = (medecin.specialites || []).map(specialite => specialite.nomSpecialite?.toString().toLowerCase());
      const fullName = `${medecin.nomMedecin} ${medecin.prenomMedecin}`.toLowerCase();
      return (
        (fullName.includes(searchTextLower)) ||
        (specialitesLowerCase?.some(s => s?.includes(searchTextLower))) ||
        (medecin.adresse?.ville?.toLowerCase().includes(searchTextLower)) ||
        (medecin.emailMedecin?.toLowerCase().includes(searchTextLower)) || 
        (medecin.numeroSecuriteSocialeMedecin?.toLowerCase().includes(searchTextLower)) || 
        (medecin.numeroRpps?.toLowerCase().includes(searchTextLower)) || 
        (medecin.telephoneMedecin_1?.toLowerCase().includes(searchTextLower)) ||
        (medecin.telephoneMedecin_2?.toLowerCase().includes(searchTextLower))
      );
    });
  }
}
