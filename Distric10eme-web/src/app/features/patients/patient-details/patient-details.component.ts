import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';
import { ConsultationService } from '../../../core/services/consultation.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Patient } from '../../../core/models/patient.model';
import { Consultation, PrescriptionItem } from '../../../core/models/consultation.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';

interface FlattenedPrescription extends PrescriptionItem {
  consultationDate?: string;
  consultationMotif?: string;
  medecinNom?: string;
}

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ]
})
export class PatientDetailsComponent implements OnInit {
  patient!: Patient;
  consultations: Consultation[] = [];
  medecins: { [key: number]: PersonnelMedical } = {};
  loading = false;
  loadingConsultations = false;
  activeTab: 'dossier' | 'consultations' | 'ordonnances' | 'parcours' = 'dossier';
  
  // KPI stats
  totalMedicamentsPrescrits = 0;
  derniereConsultation: Consultation | null = null;
  allPrescriptions: FlattenedPrescription[] = [];

  // Feedback copie
  copiedDossier = false;

  // Modale ordonnance
  selectedConsultationForPrint: Consultation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private personnelService: PersonnelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;
    if (!id || isNaN(id)) {
      this.toastr.info('Veuillez sélectionner un patient dans la liste', 'Dossier Patient');
      this.router.navigate(['/patients']);
      return;
    }

    this.loadMedecins();
    this.loadPatient(id);
    this.loadConsultations(id);
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.patientService.findById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du patient:', error);
        this.toastr.error('Erreur lors du chargement du dossier patient', 'Erreur');
        this.loading = false;
        this.router.navigate(['/patients']);
      }
    });
  }

  loadConsultations(patientId: number): void {
    this.loadingConsultations = true;
    this.consultationService.findByPatientId(patientId).subscribe({
      next: (data) => {
        this.consultations = (data || []).sort((a, b) => {
          const dateA = new Date(a.dateConsultation || 0).getTime();
          const dateB = new Date(b.dateConsultation || 0).getTime();
          return dateB - dateA; // Du plus récent au plus ancien
        });

        this.processConsultationsData();
        this.loadingConsultations = false;
      },
      error: (err) => {
        console.warn('Impossible de charger les consultations du patient', err);
        this.consultations = [];
        this.loadingConsultations = false;
      }
    });
  }

  processConsultationsData(): void {
    if (this.consultations.length > 0) {
      this.derniereConsultation = this.consultations[0];
    } else {
      this.derniereConsultation = null;
    }

    this.allPrescriptions = [];
    let count = 0;

    for (const c of this.consultations) {
      const items = c.prescriptions || c.prescription || [];
      for (const p of items) {
        count++;
        this.allPrescriptions.push({
          ...p,
          consultationDate: c.dateConsultation,
          consultationMotif: c.motif,
          medecinNom: this.getMedecinName(c.medecinId)
        });
      }
    }
    this.totalMedicamentsPrescrits = count;
  }

  loadMedecins(): void {
    this.personnelService.findAll().subscribe({
      next: (data) => {
        data.forEach(p => {
          if (p.id) this.medecins[p.id] = p;
        });
        if (this.consultations.length > 0) {
          this.processConsultationsData();
        }
      },
      error: () => {}
    });
  }

  getMedecinName(medecinId: number): string {
    const m = this.medecins[medecinId];
    return m ? `Dr. ${m.prenom} ${m.nom}` : `Médecin #${medecinId}`;
  }

  getMedecinSpecialite(medecinId: number): string {
    const m = this.medecins[medecinId];
    return m ? (m.specialiteNom || 'Médecine Générale') : 'Médecine Générale';
  }

  calculateAge(dateNaissance?: string): string {
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

  copyNumeroDossier(): void {
    if (this.patient?.numeroDossier) {
      navigator.clipboard.writeText(this.patient.numeroDossier);
      this.copiedDossier = true;
      this.toastr.info(`Numéro de dossier #${this.patient.numeroDossier} copié`, 'Presse-papier');
      setTimeout(() => {
        this.copiedDossier = false;
      }, 2500);
    }
  }

  openOrdonnanceModal(consultation: Consultation): void {
    this.selectedConsultationForPrint = consultation;
  }

  closeOrdonnanceModal(): void {
    this.selectedConsultationForPrint = null;
  }

  printOrdonnance(): void {
    window.print();
  }

  editPatient(): void {
    this.router.navigate(['/patients/edit', this.patient.id]);
  }

  nouvelleConsultation(): void {
    this.router.navigate(['/consultations/nouvelle-consultation'], {
      queryParams: { patientId: this.patient?.id }
    });
  }

  nouveauRdv(): void {
    this.router.navigate(['/rendezvous/ajout'], {
      queryParams: { patientId: this.patient?.id }
    });
  }

  nouvelleHospitalisation(): void {
    this.router.navigate(['/hospitalisations/ajout'], {
      queryParams: { patientId: this.patient?.id }
    });
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  printDossier(): void {
    window.print();
  }
}
