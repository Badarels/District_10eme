import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgbDropdownModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfilMissionComponent } from 'src/app/missions/component/profil-mission/profil-mission.component';
import { MissionService } from 'src/app/missions/services/mission.service';
import { Missions } from 'src/app/shared/Model/Missions';




@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css'],
    standalone: false
})
export class PlanningComponent {
  mission: Missions | undefined;
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
// Dans votre composant TypeScript
// Dans votre composant TypeScript
formatTime(time: number | null): string {
  if (time === null) {
    return '';
  }
  return time.toString();
}

transformTimeToDateTime(time: number | undefined): Date | null {
  if (time === undefined) {
    return null;
  }
  const datePart = '1970-01-01';
  const dateTimeString = `${datePart} ${this.formatTime(time)}`;
  const dateTime = new Date(dateTimeString);
  return isNaN(dateTime.getTime()) ? null : dateTime;
}

// Style pour les dates de missions
getDateCellStyle(dateString: string | undefined): { [key: string]: string } {
  if (!dateString) {
    return {}; // Aucun style si la date est indéfinie
  }

  const date = new Date(dateString);
  const currentDate = new Date();
  const differenceInDays = Math.floor((date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

  if (differenceInDays > 7) {
    return { color: 'green' }; // Vert pour les dates éloignées
  } else if (differenceInDays >= 0) {
    return { color: 'orange' }; // Orange pour les dates proches
  } else {
    return { color: 'red' }; // Rouge pour les dates passées
  }
}

// Style pour les statuts des missions
getStatutAnnonceStyle(statutAnnonce: string | undefined): { [key: string]: string } {
  if (!statutAnnonce) {
    return {}; // Aucun style si le statut est indéfini
  }
  let style: { [key: string]: string } = {};
  switch (statutAnnonce.toLowerCase()) {
    case 'validé':
      style['color'] = 'green';
      break;
    case 'en cours':
      style['color'] = 'orange';
      break;
    case 'annulé':
      style['color'] = 'red';
      break;
    case 'non retenue':
      style['color'] = 'black';
      break;
    case 'en attente':
      style['color'] = 'blue';
      break;
    default:
      // Pour les autres termes non spécifiés, pas de style particulier
      break;
  }

  return style;
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
