import { Pipe, PipeTransform } from '@angular/core';
import { Employe } from '../shared/Model/Employe';

@Pipe({
    name: 'employepipe',
    standalone: true
})
export class EmployePipe implements PipeTransform {

  transform(employes: Employe[], searchText: string): Employe[] {
    if (!employes || !searchText) {
      return employes;
    }
    
    const normalizedSearchText = this.normalizeText(searchText);

    return employes.filter(employe =>
      this.normalizeText(employe.nom || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.prenom || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.adresseEmploye || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.sexe || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.email || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.telephone || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.lieunaissance || '').includes(normalizedSearchText) ||
      this.normalizeText(employe.type || '').includes(normalizedSearchText) ||
      (employe.datenaissance && employe.datenaissance.toString().includes(normalizedSearchText)) ||
      (employe.dateEmboche && employe.dateEmboche.toString().includes(normalizedSearchText)) ||
      (employe.salaireDeBase && employe.salaireDeBase.toString().includes(normalizedSearchText))
    );
  }

  private normalizeText(text: string | number | Date): string {
    if (typeof text === 'number' || text instanceof Date) {
      return text.toString();
    }
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
