import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-liste-patient',
  templateUrl: './liste-patient.component.html',
  styleUrls: ['./liste-patient.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule,
    ToastrModule
  ]
})
export class ListePatientComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.findAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des patients:', error);
        this.toastr.error('Erreur lors du chargement des patients', 'Erreur');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.patientService.findByNumeroDossier(this.searchTerm).subscribe({
        next: (patient) => {
          this.filteredPatients = patient ? [patient] : [];
          this.patients = patient ? [patient] : [];
          if (!patient) {
            this.toastr.warning('Aucun patient trouvé avec ce numéro de dossier', 'Recherche');
          }
        },
        error: () => {
          this.toastr.warning('Aucun patient trouvé avec ce numéro de dossier', 'Recherche');
          this.applyFilter();
        }
      });
    } else {
      this.applyFilter();
    }
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }

    this.filteredPatients = this.patients.filter((patient) => {
      const numeroDossier = (patient.numeroDossier ?? '').toLowerCase();
      const nom = (patient.nom ?? '').toLowerCase();
      const prenom = (patient.prenom ?? '').toLowerCase();
      const sexe = (patient.sexe ?? '').toLowerCase();
      const telephone = (patient.telephone ?? '').toLowerCase();
      const email = (patient.email ?? '').toLowerCase();

      return (
        numeroDossier.includes(term) ||
        nom.includes(term) ||
        prenom.includes(term) ||
        sexe.includes(term) ||
        telephone.includes(term) ||
        email.includes(term)
      );
    });
  }

  editPatient(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/patients/details', id]);
  }

  deletePatient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      this.patientService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Patient supprimé avec succès', 'Succès');
          this.loadPatients();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastr.error('Erreur lors de la suppression', 'Erreur');
        }
      });
    }
  }

  addPatient(): void {
    this.router.navigate(['/patients/ajout']);
  }
}

