import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, map, startWith, of, forkJoin } from 'rxjs';

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
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services
import { ConsultationService } from '../../../core/services/consultation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';

// Models
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';
import { Consultation, TypeConsultation, ExamenClinique, PrescriptionItem } from '../../../core/models/consultation.model';

// Utils
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultation-form-v2',
  templateUrl: './consultation-form-v2.component.html',
  styleUrls: ['./consultation-form-v2.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Material
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class ConsultationFormV2Component implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  minDate: Date = new Date(); // Date minimale pour le datepicker (aujourd'hui)
  consultationForm: FormGroup;
  loading = false;
  submitted = false;
  selectedTabIndex = 0;
  
  // Données pour les listes déroulantes
  patients: Patient[] = [];
  filteredPatients: Observable<Patient[]>;
  medecins: PersonnelMedical[] = [];
  filteredMedecins: Observable<PersonnelMedical[]>;
  
  // Types de consultation
  typesConsultation: {value: TypeConsultation, label: string}[] = [
    { value: 'CONSULTATION_EXTERNE', label: 'Consultation Externe' },
    { value: 'URGENCE', label: 'Urgence' },
    { value: 'SUIVI', label: 'Suivi' },
    { value: 'VACCINATION', label: 'Vaccination' },
    { value: 'CONSULTATION_PRENATALE', label: 'Consultation Prénatale' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  // Fichiers joints
  fichiers: File[] = [];

  constructor(
    private fb: FormBuilder,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.consultationForm = this.createForm();
    
    // Initialisation des observables pour l'autocomplétion
    this.filteredPatients = this.consultationForm.get('patient')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : this.displayPatient(value))),
      map(name => (name ? this._filterPatients(name) : this.patients.slice()))
    );

    this.filteredMedecins = this.consultationForm.get('medecin')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : this.displayMedecin(value))),
      map(name => (name ? this._filterMedecins(name) : this.medecins.slice()))
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Informations générales
      patient: [null, Validators.required],
      medecin: [null, Validators.required],
      dateHeure: [new Date(), [Validators.required, this.futureDateValidator()]],
      typeConsultation: ['CONSULTATION_EXTERNE', Validators.required],
      
      // Anamnèse
      symptomes: [''],
      
      // Examen clinique
      examenClinique: this.fb.group({
        temperature: [null],
        tension: [''],
        pouls: [null],
        observations: [''],
        autres: ['']
      }),
      
      // Diagnostic
      diagnostic: ['', Validators.required],
      
      // Prescription
      prescriptionItems: this.fb.array([this.createPrescriptionItem()]),
      
      // Pièces jointes
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
    return this.consultationForm.get('prescriptionItems') as FormArray;
  }

  addPrescriptionItem(): void {
    this.prescriptionItems.push(this.createPrescriptionItem());
  }

  removePrescriptionItem(index: number): void {
    if (this.prescriptionItems.length > 1) {
      this.prescriptionItems.removeAt(index);
    }
  }

  private loadData(): void {
    this.loading = true;
    
    // Récupération des patients
    this.patientService.findAll().subscribe({
      next: (patients) => {
        this.patients = patients;
        // Récupération des médecins après les patients
        this.personnelService.findAll().subscribe({
          next: (personnel) => {
            // Filtrer pour ne garder que les médecins
            this.medecins = personnel.filter(p => p.typePersonnel === 'MEDECIN');
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des médecins', error);
            this.toastr.error('Erreur lors du chargement des médecins');
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des patients', error);
        this.toastr.error('Erreur lors du chargement des patients');
        this.loading = false;
      }
    });
  }

  // Affichage des valeurs dans les champs autocomplete
  displayPatient(patient: Patient): string {
    return patient ? `${patient.prenom} ${patient.nom} - Dossier #${patient.numeroDossier || 'N/A'}` : '';
  }

  displayMedecin(medecin: PersonnelMedical): string {
    return medecin ? `Dr ${medecin.prenom} ${medecin.nom} - ${medecin.specialiteNom || 'Médecine Générale'}` : '';
  }

  // Filtrage des listes pour l'autocomplétion
  private _filterPatients(value: string): Patient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter(patient => 
      patient.nom?.toLowerCase().includes(filterValue) ||
      patient.prenom?.toLowerCase().includes(filterValue) ||
      patient.numeroDossier?.toLowerCase().includes(filterValue)
    );
  }

  private _filterMedecins(value: string): PersonnelMedical[] {
    const filterValue = value.toLowerCase();
    return this.medecins.filter(medecin => 
      medecin.nom?.toLowerCase().includes(filterValue) ||
      medecin.prenom?.toLowerCase().includes(filterValue) ||
      (medecin.specialiteNom || '').toLowerCase().includes(filterValue)
    );
  }

  // Gestion des fichiers
  /**
   * Taille maximale des fichiers en octets (10 Mo)
   * Utilisé pour valider la taille des fichiers avant téléversement
   */
  maxUploadFileSize = 10 * 1024 * 1024; // 10MB

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérification de la taille du fichier
        if (file.size > this.maxUploadFileSize) {
          this.toastr.error(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
          continue;
        }
        
        // Vérification du type de fichier (optionnel)
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          this.toastr.warning(`Le type de fichier ${file.type} n'est pas supporté`);
          continue;
        }
        
        this.fichiers.push(file);
      }
      
      // Réinitialiser l'input pour permettre la sélection du même fichier
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }

  removeFile(index: number): void {
    this.fichiers.splice(index, 1);
  }

  // Validation de la date
  private futureDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      return selectedDate > now ? null : { pastDate: true };
    };
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    
    if (this.consultationForm.invalid) {
      this.markFormGroupTouched(this.consultationForm);
      this.toastr.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Vérifier la disponibilité du médecin
    this.checkMedecinAvailability().then(isAvailable => {
      if (!isAvailable) {
        this.toastr.warning('Le médecin a déjà une consultation prévue à cet horaire');
        return;
      }

      this.saveConsultation();
    });
  }

  private checkMedecinAvailability(): Promise<boolean> {
    const formValue = this.consultationForm.getRawValue();
    const medecin = formValue.medecin as PersonnelMedical;
    const dateDebut = new Date(formValue.dateHeure);
    
    // On considère une consultation dure 30 minutes par défaut
    const dateFin = new Date(dateDebut.getTime() + 30 * 60000);
    
    // TODO: Implémenter la vérification de disponibilité réelle
    // Pour l'instant, on retourne toujours true
    return Promise.resolve(true);
  }

  private saveConsultation(): void {
    this.loading = true;
    const formValue = this.consultationForm.getRawValue();
    
    // Préparation des données de la consultation
    const consultationData: any = {
      patientId: formValue.patient.id,
      medecinId: formValue.medecin.id,
      dateConsultation: formValue.dateHeure.toISOString(),
      typeConsultation: formValue.typeConsultation,
      symptomes: formValue.symptomes,
      examenClinique: formValue.examenClinique,
      diagnostic: formValue.diagnostic,
      prescription: formValue.prescriptionItems,
      piecesJointes: this.fichiers.map(file => ({
        nom: file.name,
        type: file.type,
        taille: file.size
      }))
    };

    // Si des fichiers sont joints, utiliser FormData
    if (this.fichiers.length > 0) {
      const formData = new FormData();
      formData.append('consultation', JSON.stringify(consultationData));
      
      this.fichiers.forEach(file => {
        formData.append('fichiers', file);
      });
      
      this.consultationService.createWithFiles(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error)
      });
    } else {
      // Sinon, envoyer directement l'objet JSON
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

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Navigation entre les onglets
  nextStep(): void {
    console.log('nextStep called, current tab:', this.selectedTabIndex);
    
    // Valider les champs requis de l'étape actuelle
    if (this.selectedTabIndex === 0) {
      console.log('Validating step 1 fields');
      
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.consultationForm);
      
      // Vérifier les champs requis
      const patient = this.consultationForm.get('patient')?.value;
      const medecin = this.consultationForm.get('medecin')?.value;
      const dateHeure = this.consultationForm.get('dateHeure')?.value;
      const typeConsultation = this.consultationForm.get('typeConsultation')?.value;
      
      console.log('Patient:', patient);
      console.log('Médecin:', medecin);
      console.log('Date/Heure:', dateHeure);
      console.log('Type de consultation:', typeConsultation);
      
      // Vérifier si les champs obligatoires sont remplis
      if (!patient || !medecin || !dateHeure || !typeConsultation) {
        console.log('Validation failed: missing required fields');
        this.toastr.warning('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      console.log('All fields are valid, proceeding to next step');
    }
    
    // Forcer la mise à jour de la vue
    setTimeout(() => {
      // Passer à l'étape suivante
      if (this.selectedTabIndex < 4) {
        this.selectedTabIndex++;
        // Forcer la détection des changements
        this.cdr.detectChanges();
      }
    });
  }

  previousStep(): void {
    if (this.selectedTabIndex > 0) {
      this.selectedTabIndex--;
    }
  }

  // Gestion des erreurs de formulaire
  hasError(controlName: string, errorName: string): boolean {
    const control = this.consultationForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched || this.submitted) : false;
  }

  // Récupère l'icône appropriée selon le type de fichier
  getFileIcon(mimeType: string): string {
    if (!mimeType) return 'insert_drive_file';
    
    if (mimeType.includes('pdf')) {
      return 'picture_as_pdf';
    } else if (mimeType.includes('image')) {
      return 'image';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'description';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return 'table_chart';
    } else {
      return 'insert_drive_file';
    }
  }

  // Formatage de la taille des fichiers
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
