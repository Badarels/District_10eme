import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employe } from 'src/app/shared/Model/Employe';
import { EmployeService } from '../../Services/employe.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MissionRoutingModule } from 'src/app/missions/mission-routing.module';
import { MissionPipe } from 'src/app/pipe/mission.pipe';
import { EmployePipe } from 'src/app/pipe/employe.pipe';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-employe',
    templateUrl: './employe.component.html',
    styleUrl: './employe.component.css',
    standalone: true,

   imports: [
    MissionRoutingModule,
    CommonModule,
    EmployePipe,
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
    RouterModule
],
})
export class EmployeComponent implements OnInit{

  filterText: string="";
  employe: Employe[]=[];
  subscription: Subscription[]=[];
  isDropdownOpen = false;
  activeTab: 'list' | 'grid' = 'list';
  

  constructor(private employeService: EmployeService, private toastr: ToastrService){}

  ngOnInit(): void{
    this.getEmployes();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  setTab(tab: 'list' | 'grid') {
    this.activeTab = tab;
  }

  getEmployes(){
    this.subscription.push(
      this.employeService.getEmploye().subscribe(
        (data:Employe[]) => {
          this.employe = data.filter(emp => emp.archive == 0);
          console.log(data)
          if (environment.showMocks) {
            console.log('Checking if mock exists in employe list');
            // Inject mock example if absent
            const mockId = -999;
            // Forcer l'ajout du mock en développement
            if (!environment.production) {
               const mock: any = {
                 id: mockId,
                 nom: 'Hajar',
                 prenom: 'Exemple',
                 adresseEmploye: 'Casablanca',
                 sexe: 'Feminin',
                 datenaissance: new Date().toISOString(),
                 email: 'hajar.emp@example.com',
                 telephone: '0700000002',
                 archive: 0
               };
               this.employe.unshift(mock);
            }
          }
        },
        (error) => {
          console.log('Erreur lors de la récuperation des employés!',error);
        }
      )
    );
  }

  supprimerEmploye(id?: number): void {
    // Afficher un toast de confirmation
    this.toastr.warning('Êtes-vous sûr de vouloir supprimer ce Employé ?', 'Confirmation', {
      timeOut: 15000, // Le toast reste affiché pendant 15 secondes
      extendedTimeOut: 10000, // Temps supplémentaire après la fermeture du toast
      closeButton: true, // Afficher le bouton de fermeture
      positionClass: 'toast-top-right', // Position du toast
      disableTimeOut: false // Le toast disparaît automatiquement après un certain temps
    }).onTap.subscribe(() => {
      // L'utilisateur a cliqué sur le toast, procédez à la suppression
      this.employeService.archiveEmploye(id!).subscribe(
        (archivedEmploye) => {
          // Effectuez d'autres actions si nécessaire
          console.log('Employé archivé avec succès', archivedEmploye);
          // Ajustez la valeur de l'archive à 1 si elle est true, sinon à 0
          archivedEmploye.archive = (archivedEmploye.archive ?? true) ? 1 : 0;
          // Afficher un toast de succès
          this.toastr.success('Centre Hospitalier archivé avec succès', 'Succès');
          // Mise à jour de la page
          window.location.reload();
        },
        (error) => {
          // Gérer les erreurs
          console.error('Erreur lors de l\'archivage de l\'employe', error);
          // Afficher un toast d'erreur
          this.toastr.error('Erreur lors de l\'archivage de l\'employe', 'Erreur');
        }
      );
    });
  }



}
