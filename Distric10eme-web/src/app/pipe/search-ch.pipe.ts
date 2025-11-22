import { Pipe, PipeTransform } from '@angular/core';
import { CentreHospitalier } from '../shared/Model/CentreHospitalier';

@Pipe({
    name: 'searchCH',
    standalone: false
})
export class SearchCHPipe implements PipeTransform {

  transform(centreHospitalier: CentreHospitalier[], searchChText: string): any[] {
    if (!centreHospitalier || !searchChText) {
      return centreHospitalier;
    }

    const searchCHLower = this.removeAccents(searchChText.trim().toLowerCase());

    return centreHospitalier.filter(ch => {
      const fulladresse = this.removeAccents(`${ch?.adresse?.ville} ${ch?.adresse?.departement} ${ch?.adresse?.nomRue} ${ch?.adresse?.numeroRue} ${ch?.adresse?.region}`.toLowerCase());

      const emailChLower = this.removeAccents(ch?.email_ch ?? '')?.toLowerCase() || '';
      const nomChLower = this.removeAccents(ch?.nom_ch ?? '')?.toLowerCase() || '';
      const telephoneChLower = this.removeAccents(ch?.telephone ?? '')?.toLowerCase() || '';

      return (
        fulladresse.includes(searchCHLower) ||
        emailChLower.includes(searchCHLower) ||
        nomChLower.includes(searchCHLower) ||
        telephoneChLower.includes(searchCHLower)
      );
    });
  }

  private removeAccents(str: string): string {
    return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
  }
}
