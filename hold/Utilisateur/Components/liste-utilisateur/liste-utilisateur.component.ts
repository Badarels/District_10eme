import { Component, OnInit } from '@angular/core';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { Subscription } from 'rxjs';
import { RoleModel } from 'src/app/shared/Model/Role.Model';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersPipe } from 'src/app/pipe/users.pipe';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-liste-utilisateur',
    templateUrl: './liste-utilisateur.component.html',
    styleUrls: ['./liste-utilisateur.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      ToastrModule,
      NgbDropdownModule,
      SharedModule,
      UsersPipe,
    ]
})
export class ListeUtilisateurComponent implements OnInit {
  
  ngOnInit(): void {
    this.getUtilisateur();
  }

  users= [] as UtilisateurModel[];
  roles= [] as RoleModel[];
  isDropdownOpen = false;
  subscriptions = [] as Subscription[];
  connectedUser = new UtilisateurModel();
  filtreText: string="";
  activeTab: 'list' | 'grid' = 'list';

  constructor(
    private UtilisateurServices: UtilisateurService,
    private toastr: ToastrService
   
  ){}
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  setTab(tab: 'list' | 'grid') {
    this.activeTab = tab;
  }

  getUtilisateur() {
    this.subscriptions.push(
      this.UtilisateurServices.getUsers().subscribe(
        (data: UtilisateurModel[]) => {
          // Assurez-vous que la structure des données correspond à ce que vous attendez
          // Si les utilisateurs sont directement dans 'data', vous pouvez faire comme ceci :
          this.users = data.filter(U=>U.archived==0);
          console.log(this.users)  
          if (environment.showMocks) {
            // Inject mock example if absent
           const mockId = -999;
           // Forcer l'ajout du mock en développement
           if (!environment.production) {
             const mock: UtilisateurModel = {
               id: mockId,
               nomUser: 'Hajar',
               prenomUser: 'Exemple',
               emailUser: 'hajar@example.com',
               telephoneUser: '0700000000',
               adresseUser: 'Casablanca',
               sexeUser: 'Feminin',
               dateNaissanceUser: new Date().toISOString(),
               numeroPieceIdentiteUser: 'HX-0001',
               roles: { id: -1, nomRoles: 'Admin (exemple)' } as any,
               archived: 0
             } as UtilisateurModel;
             this.users.unshift(mock);
           }
          }

        },
        (error) => {
          console.error('Erreur lors de la récupération des utilisateurs :', error);
        }
      )
    );
  }

  supprimerUsers(event: Event, id?: number): void {
    // Afficher un toast de confirmation
    this.toastr.warning('Êtes-vous sûr de vouloir supprimer cet Utilisateur ?', 'Confirmation', {
      timeOut: 15000, // Le toast reste affiché pendant 15 secondes
      extendedTimeOut: 10000, // Temps supplémentaire après la fermeture du toast
      closeButton: true, // Afficher le bouton de fermeture
      positionClass: 'toast-top-right', // Position du toast
      disableTimeOut: false // Le toast disparaît automatiquement après un certain temps
    }).onTap.subscribe(() => {
      // L'utilisateur a cliqué sur le toast, procédez à la suppression
      this.UtilisateurServices.archiveUsers(id!).subscribe(
        (archivedutilisateur) => {
          // Effectuez d'autres actions si nécessaire
          console.log('Utilisateur archivé avec succès', archivedutilisateur);
          // Ajustez la valeur de l'archive à 1 si elle est true, sinon à 0
          archivedutilisateur.archived = (archivedutilisateur.archived ?? true) ? 1 : 0;
          // Afficher un toast de succès
          this.toastr.success('Utilisateur archivé avec succès', 'Succès');
          // Mise à jour de la page
          window.location.reload();
        },
        (error) => {
          // Gérer les erreurs
          console.error('Erreur lors de l\'archivage de l\'utilisateur', error);
          // Afficher un toast d'erreur
          this.toastr.error('Erreur lors de l\'archivage de l\'utilisateur', 'Erreur');
        }
      );
    });
  }
}
