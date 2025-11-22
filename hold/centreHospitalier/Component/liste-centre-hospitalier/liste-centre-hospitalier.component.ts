import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { CentreHospitalier } from 'src/app/shared/Model/CentreHospitalier';
import { CentreHospitalierService } from '../../Services/centre-hospitalier.service';
import { Subscription } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { ToastService } from 'src/app/Utilisateur/Services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-liste-centre-hospitalier',
    templateUrl: './liste-centre-hospitalier.component.html',
    styleUrls: ['./liste-centre-hospitalier.component.css'],
    standalone: false
})
export class ListeCentreHospitalierComponent implements OnInit{
  
  centreHospitalier!: CentreHospitalier;
  centreHospitaliers = [] as CentreHospitalier[];
  subscription: Subscription[] = [];
  filteText: string = '';
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  isDropdownOpen = false;

  constructor (private centreHospitalierservces: CentreHospitalierService, private toastr: ToastrService){}

  ngOnInit(): void {
    this.getCentreHospitalier()
  }

  supprimerCentreHospitalier(id: number): void {
    // Afficher un toast de confirmation
    this.toastr.warning('Êtes-vous sûr de vouloir supprimer ce Centre Hospitalier ?', 'Confirmation', {
      timeOut: 15000, // Le toast reste affiché pendant 15 secondes
      extendedTimeOut: 10000, // Temps supplémentaire après la fermeture du toast
      closeButton: true, // Afficher le bouton de fermeture
      positionClass: 'toast-top-right', // Position du toast
      disableTimeOut: false // Le toast disparaît automatiquement après un certain temps
    }).onTap.subscribe(() => {
      // L'utilisateur a cliqué sur le toast, procédez à la suppression
      this.centreHospitalierservces.archiveCentreHospitalier(id).subscribe(
        (archivedCentreHospitalier) => {
          // Effectuez d'autres actions si nécessaire
          console.log('Centre Hospitalier archivé avec succès', archivedCentreHospitalier);
          // Ajustez la valeur de l'archive à 1 si elle est true, sinon à 0
          archivedCentreHospitalier.archived = (archivedCentreHospitalier.archived ?? true) ? 1 : 0;
          // Afficher un toast de succès
          this.toastr.success('Centre Hospitalier archivé avec succès', 'Succès');
          // Mise à jour de la page
          window.location.reload();
        },
        (error) => {
          // Gérer les erreurs
          console.error('Erreur lors de l\'archivage du Centre Hospitalier', error);
          // Afficher un toast d'erreur
          this.toastr.error('Erreur lors de l\'archivage du Centre Hospitalier', 'Erreur');
        }
      );
    });
  }

  getCentreHospitalier(){
    this.subscription.push(
    this.centreHospitalierservces.getCh().subscribe(
        (data: CentreHospitalier[])=>{
          this.centreHospitaliers = data.filter(ch => ch.archived == 0);
          // Inject mock example if absent
          const mockId = -999;
          // Forcer l'ajout du mock en développement
          if (!environment.production) {
            const mock: any = {
              id: mockId,
              nom_ch: 'Hajar CH (exemple)',
              email_ch: 'hajar.ch@example.com',
              telephone: '0700000001',
              siret: 'HAJAR-CH-0001',
              adresse: {
                ville: 'Casablanca',
                departement: 'Maarif',
                nomRue: 'Boulevard Example',
                numeroRue: '10',
                codePostal: '20000',
                region: 'Casablanca-Settat'
              },
              archived: 0
            };
            this.centreHospitaliers.unshift(mock);
          }
        },
        (error)=>{
          return console.error('Erreur lors de la récupération des Ch', error);
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
