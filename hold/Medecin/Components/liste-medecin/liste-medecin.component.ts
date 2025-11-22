import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { Medecin } from 'src/app/shared/Model/Medecin';
import { MedecinService } from '../../Services/medecin.service';
import { Subscription } from 'rxjs';
import { AdresseService } from 'src/app/Adresses/Services/adresse.service';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchPipe } from "../../../pipe/search.pipe";


@Component({
    selector: 'app-liste-medecin',
    templateUrl: './liste-medecin.component.html',
    styleUrls: ['./liste-medecin.component.css'],
    standalone: true,
    imports: [
    CommonModule,
    SharedModule,
    MatMenuModule,
    NgbDropdownModule,
    NgbModule,
    FormsModule,
    RouterModule,
    SearchPipe
]
})
export class ListeMedecinComponent implements OnInit {


  ngOnInit(): void {
    this.getMedecin();
    this.getAdresses();
  }

  setTab(tab: 'list' | 'grid') {
    this.activeTab = tab;
  }

  Medecin=[] as Medecin[];
  medecin=new  Medecin;
  Adresse=[] as Adresse[]; 
  specialite: any;
  medecinId:number=0;
  selectedVille: string = '';
  medecins: Medecin[] = [];
  medecinsfilter: Medecin[] = [];
  filterText: string = '';
  filteredMedecin: Medecin[] = [];
  items: string[] = [];
  searchText = '';
  isDropdownOpen = false;
  subscriptions = [] as Subscription[];
  activeTab: 'list' | 'grid' = 'list';
 
constructor(private medecinServices: MedecinService, private adresseServices: AdresseService){}

formatDate(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

getAdresses(){
  this.subscriptions.push(
    this.adresseServices.getAllAdresses().subscribe(
      (adresse: any) => {
        this.Adresse = adresse;
      },
      (error)=> {
        console.error('Erreur lors de la récupération des adresses :', error)
      }
    )
  );
}

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

modifier() {
  // Logique pour l'action "Modifier"
  console.log('Modifier cliqué');
}

supprimer() {
  // Logique pour l'action "Supprimer"
  console.log('Supprimer cliqué');
}

getMedecin() {
  this.subscriptions.push(
    this.medecinServices.getMedecin().subscribe(
      (medecin: any) => {
        this.Medecin = medecin;
        if (environment.showMocks) {
          // Inject mock example if absent
          const mockId = -999;
          // Forcer l'ajout du mock en développement
          if (!environment.production) {
            const mock: any = {
              id: mockId,
              nomMedecin: 'Hajar',
              prenomMedecin: 'Exemple',
              emailMedecin: 'hajar@example.com',
              telephoneMedecin_1: '0700000000',
              sexeMedecin: 'Feminin',
              dateDeNaissanceMedecin: new Date(),
              adresse: { ville: 'Casablanca' },
              specialites: [{ nomSpecialite: 'Urgences' }],
              archived: 0
            };
            this.Medecin.unshift(mock);
          }
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération du médecin :', error);
      }
    )
  );
}

getSpecialite(medecinId: number){
  this.medecinServices.getSpecialiteByMedecin(medecinId)
    .subscribe((specialite: any) => {
      this.specialite = specialite; 
    });
}

searchMedecins(): void{
  if (this.selectedVille){
    this.medecinServices.searchMedecinsByVille(this.selectedVille)
      .subscribe(medecins => this.medecins = medecins);
  } else {
    // Si aucune ville sélectionnée, affichez tous les médecins
    this.medecinServices.getMedecin()
      .subscribe(medecins => this.medecins = medecins);
  }
}

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
