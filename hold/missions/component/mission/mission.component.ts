import { Component, ViewChild } from '@angular/core';

import { Missions } from 'src/app/shared/Model/Missions';
import { MissionService } from '../../services/mission.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfilMissionComponent } from '../profil-mission/profil-mission.component';
import { Observable, Subscription, catchError, tap } from 'rxjs';

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MissionPipe } from "../../../pipe/mission.pipe";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from '@angular/router';
import { SharedModule } from "../../../shared/shared.module";
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-mission',
    templateUrl: './mission.component.html',
    styleUrls: ['./mission.component.css'],
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    SharedModule
],
   
    providers: [NgbModal],
})
export class MissionComponent {
  mission!: Missions;
  missions = [] as Missions[];
  subscription: Subscription[] = [];
  filteText: string = '';
  hoveredRowIndex: number | null = null;
  isRowHovered: boolean = false;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  isDropdownOpen = false;
  modalService: any;

  constructor (private missionServices: MissionService, private toastr: ToastrService){}

  ngOnInit(): void {
    this.getMissions()
  }
  openModal(mission: Missions) {
    const modalOptions: NgbModalOptions = {
      // Vous pouvez ajouter des options de configuration du modal ici
    };

    // Ouvrez le modal avec le composant que vous souhaitez afficher
    const modalRef = this.modalService.open(ProfilMissionComponent, modalOptions);

    // Passez les données de la mission au composant du modal
    modalRef.componentInstance.mission = mission;
  }
  
  supprimerMissions(event: Event, id?: number): void {
    event.preventDefault();
    if (id !== undefined) {
      this.toastr.warning(`
        Êtes-vous sûr de vouloir supprimer cette Mission ?
        <button class="btn btn-primary btn-sm" style="background-color: blue;">Confirmer</button>
      `, 'Confirmation', {
        enableHtml: true,
        closeButton: true,
        tapToDismiss: false,
        onActivateTick: true,
        extendedTimeOut: 0,
        positionClass: 'toast-center-center',
        disableTimeOut: true,
      }).onTap.subscribe(() => {
        // L'utilisateur a cliqué sur le bouton de confirmation
        this.missionServices.archiveMission(id).subscribe(
          () => {
            // Supprimer la mission de la liste locale
            this.missions = this.missions.filter(miss => miss.id !== id);
            // Afficher un toast de succès
            this.toastr.success('Mission archivée avec succès', 'Succès');
          },
          (error) => {
            console.error('Erreur lors de l\'archivage de la Mission', error);
            this.toastr.error('Erreur lors de l\'archivage de la Mission', 'Erreur');
          }
        );
      });
    }
  }
  

  getMissions() {
    this.subscription.push(
      this.missionServices.getMissions().subscribe(
        (data: Missions[]) => {
          this.missions = data.filter(mission => mission.archived == 0);
          // Inject mock example if absent
          const mockId = -999;
          // Forcer l'ajout du mock en développement
          if (!environment.production) {
            const mock: any = {
              id: mockId,
              detailMission: 'Remplacement – Hajar (exemple)',
              typeHoraireMission: 'JOUR',
              salaireMission: 500,
              dateMissions: new Date().toISOString(),
              dateFinMissions: new Date().toISOString(),
              startTime: '08:00',
              endTime: '18:00',
              specialite: { nomSpecialite: 'Urgences' },
              medecin: { prenomMedecin: 'Hajar', nomMedecin: 'Exemple', emailMedecin: 'hajar@example.com', telephoneMedecin_1: '0700000000' },
              centreHospitalier: { nom_ch: 'Hajar CH (exemple)', adresse: { ville: 'Casablanca', nomRue: 'Boulevard Example', numeroRue: '10', departement: 'Maarif', region: 'Casablanca-Settat', codePostal: '20000' } },
              archived: 0
            };
            this.missions.unshift(mock);
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des missions', error);
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

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }
  
}
