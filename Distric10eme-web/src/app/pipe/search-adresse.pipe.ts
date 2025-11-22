import { Pipe, PipeTransform } from '@angular/core';
import { Adresse } from '../shared/Model/Adresse';

@Pipe({
    name: 'searchAdresse',
    standalone: true
})
export class SearchAdressePipe implements PipeTransform {

  transform(adresses: Adresse[], searchText: string): any[] {
    if (!adresses || !searchText){
      return adresses;
    }
  
    const searchTextLower = this.removeAccents(searchText.trim().toLowerCase());

    return adresses.filter(adresse => {
      const fullAdresse = ` ${adresse?.ville} ${adresse?.departement} ${adresse?.nomRue} ${adresse?.numeroRue} `.toLowerCase();
      return this.removeAccents(fullAdresse).includes(searchTextLower);
    });
  }    

  private removeAccents(str: string): string {
    return str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
  }
}

