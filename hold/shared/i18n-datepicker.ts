import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    weekdaysFull: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    weekLabel: 'sem',
    today: "Aujourd'hui",
    clear: 'Effacer',
    close: 'Fermer',
    selectMonth: 'Sélectionner un mois',
    selectYear: 'Sélectionner une année',
    navigation: 'Navigation',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    previousYear: 'Année précédente',
    nextYear: 'Année suivante',
    previousDecade: 'Décennie précédente',
    nextDecade: 'Décennie suivante',
    previousCentury: 'Siècle précédent',
    nextCentury: 'Siècle suivant'
  }
};

type Language = 'fr';

@Injectable({
  providedIn: 'root'
})
export class I18nDatepicker extends NgbDatepickerI18n {
  private _language: Language = 'fr';

  constructor() {
    super();
  }

  set language(language: Language) {
    this._language = language;
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._language].weekdays[weekday - 1];
  }

  getWeekdayName(weekday: number): string {
    return I18N_VALUES[this._language].weekdaysFull[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this._language].monthsShort[month - 1];
  }

  getMonthFullName(month: number): string {
    return I18N_VALUES[this._language].months[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day} ${this.getMonthFullName(date.month)} ${date.year}`;
  }

  override getWeekLabel(): string {
    return I18N_VALUES[this._language].weekLabel;
  }

  override getWeekdayLabel(weekday: number): string {
    return this.getWeekdayShortName(weekday);
  }

  getMonthAriaLabel(month: number, year: number): string {
    return `${this.getMonthFullName(month)} ${year}`;
  }

  getTodayLabel(): string {
    return I18N_VALUES[this._language].today;
  }

  getClearLabel(): string {
    return I18N_VALUES[this._language].clear;
  }

  getCloseLabel(): string {
    return I18N_VALUES[this._language].close;
  }

  getSelectMonthLabel(): string {
    return I18N_VALUES[this._language].selectMonth;
  }

  getSelectYearLabel(): string {
    return I18N_VALUES[this._language].selectYear;
  }

  getNavigationLinkType(): 'button' | 'link' {
    return 'button';
  }

  getNavigationLinkLabel(type: string): string {
    const value = I18N_VALUES[this._language][type as keyof typeof I18N_VALUES['fr']];
    return typeof value === 'string' ? value : '';
  }
}
