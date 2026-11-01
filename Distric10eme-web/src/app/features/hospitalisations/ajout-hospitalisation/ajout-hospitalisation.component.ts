import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HospitalisationService } from '../../../core/services/hospitalisation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-ajout-hospitalisation',
  templateUrl: './ajout-hospitalisation.component.html',
  styleUrls: ['./ajout-hospitalisation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AjoutHospitalisationComponent implements OnInit {
  hospitalisationForm!: FormGroup;
  loading = false;
  loadingPatients = false;
  loadingMedecins = false;

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientSearchTerm = '';
  showPatientDropdown = false;

  medecins: PersonnelMedical[] = [];
  filteredMedecins: PersonnelMedical[] = [];
  selectedMedecin: PersonnelMedical | null = null;
  medecinSearchTerm = '';
  showMedecinDropdown = false;

  motifSuggestions: string[] = [
    'Surveillance post-opératoire',
    'Décompensation cardiaque',
    'Pneumonie',
    'Accident vasculaire',
    'Chirurgie programmée',
    'Observation 24h'
  ];

  constructor(
    private fb: FormBuilder,
    private hospitalisationService: HospitalisationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.hosp-search-patient')) {
      this.showPatientDropdown = false;
    }
    if (!target.closest('.hosp-search-medecin')) {
      this.showMedecinDropdown = false;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadMedecins();
  }

  initForm(): void {
    this.hospitalisationForm = this.fb.group({
      patientId: [null, [Validators.required]],
      medecinId: [null, [Validators.required]],
      litId: [null, [Validators.required]],
      dateAdmission: [this.getTodayDate(), [Validators.required]],
      dateSortie: [''],
      motifAdmission: [''],
      observations: ['']
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  loadPatients(): void {
    this.loadingPatients = true;
    this.patientService.findAll().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = [...data];
        this.loadingPatients = false;

        const patientIdParam = this.route.snapshot.queryParamMap.get('patientId');
        if (patientIdParam) {
          const preselected = data.find(p => p.id === +patientIdParam);
          if (preselected) this.selectPatient(preselected);
        }
      },
      error: () => {
        this.toastr.warning('Impossible de charger la liste des patients', 'Attention');
        this.loadingPatients = false;
      }
    });
  }

  loadMedecins(): void {
    this.loadingMedecins = true;
    this.personnelService.findAll().subscribe({
      next: (data) => {
        this.medecins = data.filter(p => p.typePersonnel === 'MEDECIN' && p.actif !== false);
        this.filteredMedecins = [...this.medecins];
        this.loadingMedecins = false;
      },
      error: () => {
        this.toastr.warning('Impossible de charger la liste des médecins', 'Attention');
        this.loadingMedecins = false;
      }
    });
  }

  onPatientSearchChange(): void {
    const term = (this.patientSearchTerm || '').trim().toLowerCase();
    this.showPatientDropdown = true;
    this.filteredPatients = !term
      ? [...this.patients]
      : this.patients.filter(p =>
          (p.nom || '').toLowerCase().includes(term) ||
          (p.prenom || '').toLowerCase().includes(term) ||
          (p.numeroDossier || '').toLowerCase().includes(term)
        );
  }

  openPatientDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showPatientDropdown = true;
    this.filteredPatients = [...this.patients];
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.hospitalisationForm.patchValue({ patientId: patient.id });
    this.showPatientDropdown = false;
    this.patientSearchTerm = '';
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
    this.hospitalisationForm.patchValue({ patientId: null });
    this.patientSearchTerm = '';
    this.filteredPatients = [...this.patients];
  }

  onMedecinSearchChange(): void {
    const term = (this.medecinSearchTerm || '').trim().toLowerCase();
    this.showMedecinDropdown = true;
    this.filteredMedecins = !term
      ? [...this.medecins]
      : this.medecins.filter(m =>
          (m.nom || '').toLowerCase().includes(term) ||
          (m.prenom || '').toLowerCase().includes(term) ||
          (m.specialiteNom || '').toLowerCase().includes(term)
        );
  }

  openMedecinDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showMedecinDropdown = true;
    this.filteredMedecins = [...this.medecins];
  }

  selectMedecin(medecin: PersonnelMedical): void {
    this.selectedMedecin = medecin;
    this.hospitalisationForm.patchValue({ medecinId: medecin.id });
    this.showMedecinDropdown = false;
    this.medecinSearchTerm = '';
  }

  clearSelectedMedecin(): void {
    this.selectedMedecin = null;
    this.hospitalisationForm.patchValue({ medecinId: null });
    this.medecinSearchTerm = '';
    this.filteredMedecins = [...this.medecins];
  }

  chooseMotif(motif: string): void {
    this.hospitalisationForm.patchValue({ motifAdmission: motif });
  }

  getInitials(prenom?: string, nom?: string): string {
    const p = (prenom || '').trim().charAt(0).toUpperCase();
    const n = (nom || '').trim().charAt(0).toUpperCase();
    return (p + n) || '?';
  }

  onSubmit(): void {
    if (this.hospitalisationForm.invalid) {
      this.hospitalisationForm.markAllAsTouched();
      this.toastr.warning('Veuillez renseigner tous les champs obligatoires', 'Formulaire incomplet');
      return;
    }

    this.loading = true;
    const payload = { ...this.hospitalisationForm.value };
    if (!payload.dateSortie) {
      payload.dateSortie = null;
    }

    this.hospitalisationService.create(payload).subscribe({
      next: () => {
        this.toastr.success('Hospitalisation créée avec succès', 'Succès');
        this.router.navigate(['/hospitalisations']);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Erreur lors de la création', 'Erreur');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/hospitalisations']);
  }
}
