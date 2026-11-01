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
  selectedSexe: string = '';
  selectedGroupeSanguin: string = '';
  loading = false;

  // Statistiques rapides
  totalPatients: number = 0;
  totalHommes: number = 0;
  totalFemmes: number = 0;

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
        this.calculateStats();
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

  calculateStats(): void {
    this.totalPatients = this.patients.length;
    this.totalHommes = this.patients.filter(p => p.sexe === 'M' || p.sexe === 'Masculin').length;
    this.totalFemmes = this.patients.filter(p => p.sexe === 'F' || p.sexe === 'Féminin').length;
  }

  applyFilter(): void {
    const term = (this.searchTerm || '').trim().toLowerCase();
    const sexeFilter = (this.selectedSexe || '').trim().toLowerCase();
    const groupeFilter = (this.selectedGroupeSanguin || '').trim().toUpperCase();

    this.filteredPatients = this.patients.filter((patient) => {
      // Filtre texte
      const numeroDossier = (patient.numeroDossier ?? '').toLowerCase();
      const nom = (patient.nom ?? '').toLowerCase();
      const prenom = (patient.prenom ?? '').toLowerCase();
      const telephone = (patient.telephone ?? '').toLowerCase();
      const email = (patient.email ?? '').toLowerCase();
      const adresse = (patient.adresse ?? '').toLowerCase();

      const matchesSearch = !term ||
        numeroDossier.includes(term) ||
        nom.includes(term) ||
        prenom.includes(term) ||
        telephone.includes(term) ||
        email.includes(term) ||
        adresse.includes(term);

      // Filtre sexe
      const pSexe = (patient.sexe || '').toLowerCase();
      const matchesSexe = !sexeFilter || pSexe === sexeFilter || (sexeFilter === 'm' && pSexe === 'masculin') || (sexeFilter === 'f' && pSexe === 'féminin');

      // Filtre groupe sanguin
      const matchesGroupe = !groupeFilter || (patient.groupeSanguin || '').toUpperCase() === groupeFilter;

      return matchesSearch && matchesSexe && matchesGroupe;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedSexe = '';
    this.selectedGroupeSanguin = '';
    this.applyFilter();
  }

  calculateAge(dateNaissance: string | undefined): number | string {
    if (!dateNaissance) return '-';
    const birth = new Date(dateNaissance);
    if (isNaN(birth.getTime())) return '-';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? `${age} ans` : '-';
  }

  getInitials(prenom?: string, nom?: string): string {
    const p = (prenom || '').trim().charAt(0).toUpperCase();
    const n = (nom || '').trim().charAt(0).toUpperCase();
    return (p + n) || 'P';
  }

  editPatient(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/patients/details', id]);
  }

  deletePatient(id: number, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier patient ? Cette action supprimera également les données associées.')) {
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
