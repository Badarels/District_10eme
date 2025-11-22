// Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Third-party
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith, of } from 'rxjs';

// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

// Services
import { ConsultationService } from '../../../core/services/consultation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';

// Models
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule
  ]
})
export class ConsultationFormComponent implements OnInit {
  consultationForm: FormGroup = this.fb.group({});
  loading = false;
  editMode = false; // Pour gérer le mode édition

  // Données pour l'autocomplétion
  patients: Patient[] = [];
  filteredPatients: Observable<Patient[]> = of([]);
  medecins: PersonnelMedical[] = [];
  filteredMedecins: Observable<PersonnelMedical[]> = of([]);

  // Options pour les sélecteurs
  typesConsultation = [
    { value: 'CONSULTATION_EXTERNE', label: 'Consultation externe' },
    { value: 'URGENCE', label: 'Urgence' },
    { value: 'SUIVI', label: 'Suivi' },
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  // Fichiers joints
  files: File[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadMedecins();
    this.setupFormListeners();
  }

  private initForm(): void {
    this.consultationForm = this.fb.group({
      // Section Informations générales
      patient: ['', Validators.required],
      medecin: ['', Validators.required],
      dateHeure: ['', [Validators.required, this.futureDateValidator()]],
      typeConsultation: ['CONSULTATION_EXTERNE', Validators.required],
      
      // Section Anamnèse / Symptômes
      symptomes: ['', Validators.required],
      
      // Section Examen clinique
      examenClinique: this.fb.group({
        temperature: [null],
        tension: [''],
        pouls: [null],
        observations: ['']
      }),
      
      // Section Diagnostic et Traitement
      diagnostic: ['', Validators.required],
      prescription: this.fb.array([this.createPrescriptionItem()]),
      
      // Section Pièces jointes
      piecesJointes: this.fb.array([])
    });
  }

  private createPrescriptionItem(): FormGroup {
    return this.fb.group({
      medicament: ['', Validators.required],
      posologie: ['', Validators.required],
      duree: ['', Validators.required],
      instructions: ['']
    });
  }

  get prescriptionItems(): FormArray {
    return this.consultationForm.get('prescription') as FormArray;
  }

  addPrescriptionItem(): void {
    this.prescriptionItems.push(this.createPrescriptionItem());
  }

  removePrescriptionItem(index: number): void {
    if (this.prescriptionItems.length > 1) {
      this.prescriptionItems.removeAt(index);
    }
  }

  private loadPatients(): void {
    this.patientService.findAll().subscribe({
      next: (patients: Patient[]) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des patients', error);
        this.toastr.error('Impossible de charger la liste des patients');
      }
    });
  }

  private loadMedecins(): void {
    this.personnelService.findAll().subscribe({
      next: (personnel: PersonnelMedical[]) => {
        // Filtrer pour ne garder que les médecins
        this.medecins = personnel.filter(p => p.typePersonnel === 'MEDECIN');
      },
      error: (error) => {
        console.error('Erreur lors du chargement des médecins', error);
        this.toastr.error('Impossible de charger la liste des médecins');
      }
    });
  }

  private setupFormListeners(): void {
    // Filtrage des patients
    this.filteredPatients = this.consultationForm.get('patient')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : this.displayPatient(value))),
      map(name => (name ? this._filterPatients(name) : this.patients.slice()))
    );

    // Filtrage des médecins
    this.filteredMedecins = this.consultationForm.get('medecin')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : this.displayMedecin(value))),
      map(name => (name ? this._filterMedecins(name) : this.medecins.slice()))
    );
  }

  private _filterPatients(value: string): Patient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter(patient => 
      patient.nom?.toLowerCase().includes(filterValue) || 
      patient.prenom?.toLowerCase().includes(filterValue) ||
      patient.numeroDossier?.toLowerCase().includes(filterValue)
    );
  }

  private _filterMedecins(value: string): PersonnelMedical[] {
    if (!value) return this.medecins;
    
    const filterValue = value.toLowerCase();
    return this.medecins.filter(medecin => 
      (medecin.nom?.toLowerCase().includes(filterValue)) ||
      (medecin.prenom?.toLowerCase().includes(filterValue)) ||
      (medecin.specialiteNom?.toLowerCase().includes(filterValue))
    );
  }

  displayPatient(patient: Patient): string {
    return patient && patient.nom && patient.prenom && patient.numeroDossier 
      ? `${patient.nom} ${patient.prenom} - Dossier #${patient.numeroDossier}` 
      : '';
  }

  displayMedecin(medecin?: PersonnelMedical): string {
    return medecin 
      ? `Dr ${medecin.prenom || ''} ${medecin.nom || ''}${medecin.specialiteNom ? ` - ${medecin.specialiteNom}` : ''}` 
      : '';
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > this.maxFileSize) {
          this.toastr.warning(`Le fichier ${file.name} dépasse la taille maximale de 5MB`);
          continue;
        }
        this.files.push(file);
        
        // Ajouter au FormArray
        const piecesJointes = this.consultationForm.get('piecesJointes') as FormArray;
        piecesJointes.push(this.fb.group({
          nom: [file.name],
          type: [file.type],
          taille: [file.size],
          fichier: [file]
        }));
      }
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    const piecesJointes = this.consultationForm.get('piecesJointes') as FormArray;
    piecesJointes.removeAt(index);
  }

  onSubmit(): void {
    if (this.consultationForm.invalid) {
      this.markFormGroupTouched(this.consultationForm);
      this.toastr.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Récupération des valeurs du formulaire
    const formValue = this.consultationForm.getRawValue();
    const medecin = formValue.medecin as PersonnelMedical;
    const patient = formValue.patient as Patient;

    // Validation des champs obligatoires
    if (!medecin?.id || !patient?.id) {
      this.toastr.error('Veuillez sélectionner un médecin et un patient valides');
      return;
    }

    this.loading = true;

    // Construction de l'objet consultation
    const consultationData = {
      patientId: patient.id,
      medecinId: medecin.id,
      dateConsultation: formValue.dateHeure,
      typeConsultation: formValue.typeConsultation,
      symptomes: formValue.symptomes,
      examenClinique: formValue.examenClinique,
      diagnostic: formValue.diagnostic,
      prescription: formValue.prescription,
      // Autres champs nécessaires...
    };

    // Si vous avez des fichiers à envoyer, utilisez FormData
    if (this.files.length > 0) {
      const formData = new FormData();
      formData.append('consultation', JSON.stringify(consultationData));
      
      this.files.forEach((file, index) => {
        formData.append('fichiers', file);
      });

      this.consultationService.createWithFiles(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error)
      });
    } else {
      // Si pas de fichiers, envoyez directement l'objet
      this.consultationService.create(consultationData).subscribe({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleSuccess(): void {
    this.toastr.success('Consultation enregistrée avec succès');
    this.router.navigate(['/consultations']);
    this.loading = false;
  }

  private handleError(error: any): void {
    console.error('Erreur lors de l\'enregistrement de la consultation', error);
    this.toastr.error('Erreur lors de l\'enregistrement de la consultation');
    this.loading = false;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  private futureDateValidator() {
    return (control: { value: string | Date }) => {
      if (!control.value) {
        return null;
      }
      const selectedDate = new Date(control.value);
      const now = new Date();
      return selectedDate > now ? null : { pastDate: true };
    };
  }
}
