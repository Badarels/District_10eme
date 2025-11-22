import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsultationService } from '../../../core/services/consultation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Consultation } from '../../../core/models/consultation.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-liste-consultation',
  templateUrl: './liste-consultation.component.html',
  styleUrls: ['./liste-consultation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ]
})
export class ListeConsultationComponent implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  patients: { [key: number]: Patient } = {};
  medecins: { [key: number]: PersonnelMedical } = {};
  loading = false;
  searchTerm = '';

  constructor(
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  addConsultation(): void {
    this.router.navigate(['consultation/nouvelle'], { relativeTo: this.route.parent });
  }

  // Supprime une consultation après confirmation
  deleteConsultation(id: number | undefined): void {
    if (!id) {
      console.error('ID de consultation non défini');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.')) {
      this.loading = true;
      this.consultationService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Consultation supprimée avec succès');
          this.loadConsultations(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la consultation', error);
          this.toastr.error('Erreur lors de la suppression de la consultation');
          this.loading = false;
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.loading = true;

    // Chargement séquentiel des données
    this.consultationService.findAll().subscribe({
      next: (consultations: Consultation[]) => {
        this.consultations = consultations;
        
        // Charger les patients
        this.patientService.findAll().subscribe({
          next: (patients: Patient[]) => {
            // Stocker les patients dans une map pour un accès facile
            patients.forEach((patient: Patient) => {
              if (patient.id) {
                this.patients[patient.id] = patient;
              }
            });
            
            // Charger les médecins
            this.personnelService.findAll().subscribe({
              next: (allPersonnel: any[]) => {
                // Filtrer pour ne garder que les médecins
                const medecins = allPersonnel.filter((p: any) => p.typePersonnel === 'MEDECIN');
                
                // Stocker les médecins dans une map pour un accès facile
                medecins.forEach((medecin: PersonnelMedical) => {
                  if (medecin.id) {
                    this.medecins[medecin.id] = medecin;
                  }
                });
                
                // Mettre à jour les consultations avec les données des patients et médecins
                this.consultations = consultations.map((consultation: Consultation) => ({
                  ...consultation,
                  patient: consultation.patientId ? this.patients[consultation.patientId] : undefined,
                  medecin: consultation.medecinId ? this.medecins[consultation.medecinId] : undefined
                }));
                
                this.filteredConsultations = [...this.consultations];
                this.loading = false;
              },
              error: (error: any) => {
                console.error('Erreur lors du chargement des médecins', error);
                this.toastr.error('Erreur lors du chargement des médecins');
                this.loading = false;
              }
            });
          },
          error: (error: any) => {
            console.error('Erreur lors du chargement des patients', error);
            this.toastr.error('Erreur lors du chargement des patients');
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des consultations', error);
        this.toastr.error('Erreur lors du chargement des consultations');
        this.loading = false;
      }
    });
  }

  // Récupère le libellé lisible d'un type de consultation
  getTypeConsultationLibelle(type: string | undefined): string {
    if (!type) return 'Non spécifié';
    
    const types: {[key: string]: string} = {
      'CONSULTATION_EXTERNE': 'Consultation externe',
      'URGENCE': 'Urgence',
      'SUIVI': 'Suivi',
      'VACCINATION': 'Vaccination',
      'CONSULTATION_PRENATALE': 'Consultation prénatale',
      'AUTRE': 'Autre'
    };
    
    return types[type] || type;
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredConsultations = [...this.consultations];
      return;
    }

    this.filteredConsultations = this.consultations.filter((consultation) => {
      // Informations du patient
      const patient = consultation.patientId ? this.patients[consultation.patientId] : null;
      const patientInfo = patient ? `${patient.nom || ''} ${patient.prenom || ''} ${patient.numeroDossier || ''}`.toLowerCase() : '';
      
      // Informations du médecin
      const medecin = consultation.medecinId ? this.medecins[consultation.medecinId] : null;
      const medecinInfo = medecin ? `${medecin.nom || ''} ${medecin.prenom || ''} ${medecin.specialiteNom || ''}`.toLowerCase() : '';
      
      // Autres champs de recherche
      const diagnostic = (consultation.diagnostic ?? '').toLowerCase();
      const typeConsultation = (consultation.typeConsultation ?? '').toLowerCase();
      const date = consultation.dateConsultation ? new Date(consultation.dateConsultation).toLocaleString().toLowerCase() : '';

      return (
        patientInfo.includes(term) ||
        medecinInfo.includes(term) ||
        diagnostic.includes(term) ||
        typeConsultation.includes(term) ||
        date.includes(term)
      );
    });
  }
}
