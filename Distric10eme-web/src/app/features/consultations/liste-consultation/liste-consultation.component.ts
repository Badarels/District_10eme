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

  // Consultation sélectionnée pour affichage/impression d'ordonnance
  selectedConsultationForOrdonnance: Consultation | null = null;

  constructor(
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  addConsultation(): void {
    this.router.navigate(['/consultations/nouvelle-consultation']);
  }

  deleteConsultation(id: number | undefined): void {
    if (!id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.')) {
      this.loading = true;
      this.consultationService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Consultation supprimée avec succès');
          this.loadConsultations();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression', error);
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

    forkJoin({
      consultations: this.consultationService.findAll(),
      patients: this.patientService.findAll(),
      personnel: this.personnelService.findAll()
    }).subscribe({
      next: (results) => {
        // Map patients par ID
        results.patients.forEach((p: Patient) => {
          if (p.id) this.patients[p.id] = p;
        });

        // Map médecins par ID (filtre MEDECIN)
        results.personnel
          .filter((p: any) => p.typePersonnel === 'MEDECIN')
          .forEach((m: PersonnelMedical) => {
            if (m.id) this.medecins[m.id] = m;
          });

        // Enrichir les consultations avec les objets patient/médecin
        this.consultations = results.consultations.map((c: Consultation) => ({
          ...c,
          patient: c.patientId ? this.patients[c.patientId] : undefined,
          medecin: c.medecinId ? this.medecins[c.medecinId] : undefined
        }));

        this.filteredConsultations = [...this.consultations];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement', error);
        this.toastr.error('Erreur lors du chargement des consultations');
        this.loading = false;
      }
    });
  }

  getPatient(patientId: number): Patient | undefined {
    return this.patients[patientId];
  }

  getMedecin(medecinId: number): PersonnelMedical | undefined {
    return this.medecins[medecinId];
  }

  openOrdonnanceModal(consultation: Consultation): void {
    this.selectedConsultationForOrdonnance = consultation;
  }

  closeOrdonnanceModal(): void {
    this.selectedConsultationForOrdonnance = null;
  }

  printOrdonnance(): void {
    window.print();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredConsultations = [...this.consultations];
      return;
    }

    this.filteredConsultations = this.consultations.filter((c) => {
      const patient = c.patientId ? this.patients[c.patientId] : null;
      const patientInfo = patient
        ? `${patient.nom || ''} ${patient.prenom || ''} ${patient.numeroDossier || ''}`.toLowerCase()
        : '';

      const medecin = c.medecinId ? this.medecins[c.medecinId] : null;
      const medecinInfo = medecin
        ? `${medecin.nom || ''} ${medecin.prenom || ''} ${medecin.specialiteNom || ''}`.toLowerCase()
        : '';

      const motif = (c.motif ?? '').toLowerCase();
      const description = (c.description ?? '').toLowerCase();
      const date = c.dateConsultation
        ? new Date(c.dateConsultation).toLocaleString('fr-FR').toLowerCase()
        : '';

      // Recherche aussi dans les prescriptions
      const prescriptionsText = (c.prescriptions || [])
        .map(p => `${p.medicament} ${p.posologie} ${p.duree}`)
        .join(' ')
        .toLowerCase();

      return (
        patientInfo.includes(term) ||
        medecinInfo.includes(term) ||
        motif.includes(term) ||
        description.includes(term) ||
        date.includes(term) ||
        prescriptionsText.includes(term)
      );
    });
  }
}
