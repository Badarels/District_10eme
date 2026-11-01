import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-ajout-rendezvous',
  templateUrl: './ajout-rendezvous.component.html',
  styleUrls: ['./ajout-rendezvous.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class AjoutRendezVousComponent implements OnInit {
  rendezVousForm!: FormGroup;
  loading = false;
  loadingPatients = false;
  loadingMedecins = false;

  // Patients
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  selectedPatient: Patient | null = null;
  patientSearchTerm: string = '';
  showPatientDropdown: boolean = false;

  // Médecins
  medecins: PersonnelMedical[] = [];
  filteredMedecins: PersonnelMedical[] = [];
  selectedMedecin: PersonnelMedical | null = null;
  medecinSearchTerm: string = '';
  showMedecinDropdown: boolean = false;

  motifSuggestions: string[] = [
    'Suivi post-opératoire',
    'Résultats d\'analyses',
    'Renouvellement ordonnance',
    'Bilan de santé',
    'Vaccination',
    'Consultation générale'
  ];

  constructor(
    private fb: FormBuilder,
    private rendezVousService: RendezVousService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  // Ferme les dropdowns si clic en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.rdv-search-patient')) {
      this.showPatientDropdown = false;
    }
    if (!target.closest('.rdv-search-medecin')) {
      this.showMedecinDropdown = false;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.loadPatients();
    this.loadMedecins();
  }

  initForm(): void {
    this.rendezVousForm = this.fb.group({
      patientId: [null, [Validators.required]],
      medecinId: [null, [Validators.required]],
      dateHeure: [this.getCurrentDateTime(), [Validators.required]],
      motif: [''],
      statut: ['PLANIFIE']
    });
  }

  private getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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

  // --- Patient ---
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
    this.rendezVousForm.patchValue({ patientId: patient.id });
    this.showPatientDropdown = false;
    this.patientSearchTerm = '';
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
    this.rendezVousForm.patchValue({ patientId: null });
    this.patientSearchTerm = '';
    this.filteredPatients = [...this.patients];
  }

  // --- Médecin ---
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
    this.rendezVousForm.patchValue({ medecinId: medecin.id });
    this.showMedecinDropdown = false;
    this.medecinSearchTerm = '';
  }

  clearSelectedMedecin(): void {
    this.selectedMedecin = null;
    this.rendezVousForm.patchValue({ medecinId: null });
    this.medecinSearchTerm = '';
    this.filteredMedecins = [...this.medecins];
  }

  chooseMotif(motif: string): void {
    this.rendezVousForm.patchValue({ motif });
  }

  getInitials(prenom?: string, nom?: string): string {
    const p = (prenom || '').trim().charAt(0).toUpperCase();
    const n = (nom || '').trim().charAt(0).toUpperCase();
    return (p + n) || '?';
  }

  onSubmit(): void {
    if (this.rendezVousForm.invalid) {
      this.rendezVousForm.markAllAsTouched();
      this.toastr.warning('Veuillez renseigner tous les champs obligatoires', 'Formulaire incomplet');
      return;
    }

    this.loading = true;
    const formValue = { ...this.rendezVousForm.value };
    if (formValue.dateHeure && formValue.dateHeure.length === 16) {
      formValue.dateHeure = formValue.dateHeure + ':00';
    }

    this.rendezVousService.create(formValue).subscribe({
      next: () => {
        this.toastr.success('Rendez-vous créé avec succès', 'Succès');
        this.router.navigate(['/rendezvous']);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Erreur lors de la création', 'Erreur');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/rendezvous']);
  }
}
