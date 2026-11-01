import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultationService } from '../../../core/services/consultation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';
import { PrescriptionItem } from '../../../core/models/consultation.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-consultation',
  templateUrl: './edit-consultation.component.html',
  styleUrls: ['./edit-consultation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EditConsultationComponent implements OnInit {
  consultationId!: number;
  consultationForm!: FormGroup;
  loading = false;
  loadingData = true;

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

  // Suggestions de motifs
  motifSuggestions: string[] = [
    'Consultation générale',
    'Contrôle tension artérielle',
    'Fièvre et céphalées',
    'Douleurs abdominales',
    'Suivi diabète',
    'Infection respiratoire',
    'Renouvellement ordonnance',
    'Vaccination',
    'Urgence'
  ];

  // Suggestions rapides de médicaments
  commonMedicines: string[] = [
    'Paracétamol 1g',
    'Amoxicilline 1g',
    'Ibuprofène 400mg',
    'Oméprazole 20mg',
    'Spasfon',
    'Azithromycine 500mg',
    'Sérum physiologique',
    'Vitamine C 500mg'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.consultationId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadAllData();
  }

  private initForm(): void {
    this.consultationForm = this.fb.group({
      patientId: [null, [Validators.required]],
      medecinId: [null, [Validators.required]],
      dateConsultation: ['', [Validators.required]],
      motif: ['', [Validators.required]],
      description: [''],
      prescriptions: this.fb.array([])
    });
  }

  get prescriptions(): FormArray {
    return this.consultationForm.get('prescriptions') as FormArray;
  }

  createPrescriptionGroup(medicament = '', posologie = '', duree = ''): FormGroup {
    return this.fb.group({
      medicament: [medicament, [Validators.required]],
      posologie: [posologie],
      duree: [duree]
    });
  }

  addPrescription(medicament = '', posologie = '', duree = ''): void {
    this.prescriptions.push(this.createPrescriptionGroup(medicament, posologie, duree));
  }

  removePrescription(index: number): void {
    this.prescriptions.removeAt(index);
  }

  loadAllData(): void {
    this.loadingData = true;

    forkJoin({
      patients: this.patientService.findAll(),
      personnel: this.personnelService.findAll(),
      consultation: this.consultationService.findById(this.consultationId)
    }).subscribe({
      next: (results) => {
        this.patients = results.patients;
        this.filteredPatients = [...results.patients];

        this.medecins = results.personnel.filter(p => p.typePersonnel === 'MEDECIN');
        this.filteredMedecins = [...this.medecins];

        const cons = results.consultation;
        if (cons) {
          // Format date for datetime-local
          let dateStr = cons.dateConsultation || '';
          if (dateStr.length > 16) {
            dateStr = dateStr.slice(0, 16);
          }

          this.consultationForm.patchValue({
            patientId: cons.patientId,
            medecinId: cons.medecinId,
            dateConsultation: dateStr,
            motif: cons.motif || '',
            description: cons.description || ''
          });

          // Pré-sélectionner le patient
          this.selectedPatient = this.patients.find(p => p.id === cons.patientId) || null;

          // Pré-sélectionner le médecin
          this.selectedMedecin = this.medecins.find(m => m.id === cons.medecinId) || null;

          // Charger les prescriptions existantes
          this.prescriptions.clear();
          const items = cons.prescriptions || cons.prescription || [];
          if (Array.isArray(items) && items.length > 0) {
            items.forEach((item: PrescriptionItem) => {
              this.addPrescription(item.medicament, item.posologie, item.duree);
            });
          }
        }

        this.loadingData = false;
      },
      error: (err) => {
        console.error('Erreur chargement données consultation', err);
        this.toastr.error('Impossible de charger la consultation', 'Erreur');
        this.loadingData = false;
        this.router.navigate(['/consultations']);
      }
    });
  }

  // --- Recherche & Sélection Patient ---
  onPatientSearchChange(): void {
    const term = (this.patientSearchTerm || '').trim().toLowerCase();
    this.showPatientDropdown = true;
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }
    this.filteredPatients = this.patients.filter(p => {
      const nom = (p.nom || '').toLowerCase();
      const prenom = (p.prenom || '').toLowerCase();
      const dossier = (p.numeroDossier || '').toLowerCase();
      const tel = (p.telephone || '').toLowerCase();
      return nom.includes(term) || prenom.includes(term) || dossier.includes(term) || tel.includes(term);
    });
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.consultationForm.patchValue({ patientId: patient.id });
    this.showPatientDropdown = false;
    this.patientSearchTerm = '';
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
    this.consultationForm.patchValue({ patientId: null });
    this.patientSearchTerm = '';
    this.filteredPatients = [...this.patients];
    this.showPatientDropdown = true;
  }

  // --- Recherche & Sélection Médecin ---
  onMedecinSearchChange(): void {
    const term = (this.medecinSearchTerm || '').trim().toLowerCase();
    this.showMedecinDropdown = true;
    if (!term) {
      this.filteredMedecins = [...this.medecins];
      return;
    }
    this.filteredMedecins = this.medecins.filter(m => {
      const nom = (m.nom || '').toLowerCase();
      const prenom = (m.prenom || '').toLowerCase();
      const spec = (m.specialiteNom || '').toLowerCase();
      return nom.includes(term) || prenom.includes(term) || spec.includes(term);
    });
  }

  selectMedecin(medecin: PersonnelMedical): void {
    this.selectedMedecin = medecin;
    this.consultationForm.patchValue({ medecinId: medecin.id });
    this.showMedecinDropdown = false;
    this.medecinSearchTerm = '';
  }

  clearSelectedMedecin(): void {
    this.selectedMedecin = null;
    this.consultationForm.patchValue({ medecinId: null });
    this.medecinSearchTerm = '';
    this.filteredMedecins = [...this.medecins];
    this.showMedecinDropdown = true;
  }

  chooseMotif(motif: string): void {
    this.consultationForm.patchValue({ motif });
  }

  onSubmit(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      this.toastr.warning('Veuillez renseigner tous les champs obligatoires (patient, médecin, date, motif)', 'Formulaire incomplet');
      return;
    }

    this.loading = true;
    const formValue = { ...this.consultationForm.value };

    if (formValue.dateConsultation && formValue.dateConsultation.length === 16) {
      formValue.dateConsultation = formValue.dateConsultation + ':00';
    }

    // Filtrer les lignes de prescription vides
    if (formValue.prescriptions && Array.isArray(formValue.prescriptions)) {
      formValue.prescriptions = formValue.prescriptions.filter(
        (p: any) => p.medicament && p.medicament.trim() !== ''
      );
    }

    this.consultationService.update(this.consultationId, formValue).subscribe({
      next: () => {
        this.toastr.success('Consultation et ordonnance modifiées avec succès', 'Succès');
        this.router.navigate(['/consultations']);
      },
      error: (error) => {
        console.error('Erreur lors de la modification de la consultation', error);
        this.toastr.error(error.error?.message || 'Erreur lors de la modification', 'Erreur');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/consultations']);
  }
}
