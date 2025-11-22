import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl, 
  ValidationErrors, 
  FormsModule 
} from '@angular/forms';
import { 
  NgbModule, 
  NgbDatepickerModule, 
  NgbTimepickerModule, 
  NgbDateStruct,
  NgbTimeStruct
} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, catchError, of } from 'rxjs';

// Services
import { MedecinService } from 'src/app/Medecin/Services/medecin.service';
import { CentreHospitalierService } from 'src/app/centreHospitalier/Services/centre-hospitalier.service';
import { MissionService } from '../../services/mission.service';
import { ToastService } from 'src/app/Utilisateur/Services/toast.service';

// Models
import { Medecin } from 'src/app/shared/Model/Medecin';
import { CentreHospitalier } from 'src/app/shared/Model/CentreHospitalier';
import { Specialite } from 'src/app/shared/Model/Specialite';
import { Missions } from 'src/app/shared/Model/Missions';

// UI Components
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface SelectOption {
  value: string;
  label: string;
}

type ToastType = 'success' | 'error' | 'warning';

declare module 'src/app/Utilisateur/Services/toast.service' {
  interface ToastService {
    show(message: string, options: { classname: string; delay: number }): void;
  }
}

declare module 'src/app/missions/services/mission.service' {
  interface MissionService {
    getMissionById(id: number): Observable<Missions>;
    updateMission(id: number, mission: Partial<Missions>): Observable<Missions>;
    createMission(mission: Partial<Missions>): Observable<Missions>;
  }
}

declare module 'src/app/Medecin/Services/medecin.service' {
  interface MedecinService {
    getMedecinsByCentreHospitalier(chId: number): Observable<Medecin[]>;
  }
}

declare module 'src/app/centreHospitalier/Services/centre-hospitalier.service' {
  interface CentreHospitalierService {
    getAllCentreHospitaliers(): Observable<CentreHospitalier[]>;
  }
}

// Validateur personnalisé pour vérifier que la date de fin est après la date de début
function dateFinValidator(control: AbstractControl): ValidationErrors | null {
  const dateDebut = control.parent?.get('dateMissions')?.value;
  const dateFin = control.value;
  
  if (dateDebut && dateFin) {
    const dateD = new Date(dateDebut);
    const dateF = new Date(dateFin);
    
    if (dateF < dateD) {
      return { dateFinInvalide: true };
    }
  }
  return null;
}

// Validateur personnalisé pour vérifier que l'heure de fin est après l'heure de début
function heureFinValidator(control: AbstractControl): ValidationErrors | null {
  const heureDebut = control.parent?.get('startTime')?.value;
  const heureFin = control.value;
  
  if (heureDebut && heureFin) {
    const [h1, m1] = heureDebut.split(':').map(Number);
    const [h2, m2] = heureFin.split(':').map(Number);
    
    if (h2 < h1 || (h2 === h1 && m2 <= m1)) {
      return { heureFinInvalide: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-edit-mission',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: 'dateFormat', useValue: 'dd/MM/yyyy' }
  ],
  templateUrl: './edit-mission.component.html',
  styleUrls: ['./edit-mission.component.css']
})
export class EditMissionComponent implements OnInit, OnDestroy {
  missionForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  missionId = 0;
  mission!: Missions;
  today = new Date().toISOString().split('T')[0];

  // Données statiques pour les listes déroulantes
  statutsDisponibles: SelectOption[] = [
    { value: 'En Cours', label: 'En Cours' },
    { value: 'Validée', label: 'Validée' },
    { value: 'Annulation CH', label: 'Annulation CH' },
    { value: 'Annulation Medecin', label: 'Annulation Médecin' }
  ];

  typesHoraires: SelectOption[] = [
    { value: 'JOUR', label: 'Jour' },
    { value: 'NUIT', label: 'Nuit' },
    { value: 'Matin', label: 'Matin' },
    { value: 'Garde 24H', label: 'Garde 24H' },
    { value: 'Journée + Astreinte', label: 'Journée + Astreinte' }
  ];

  selectedCh: CentreHospitalier | null = null;
  selectedMedecin: Medecin | null = null;
  selectedSpecialite: Specialite | null = null;
  specialites: Specialite[] = [];
  medecins: Medecin[] = [];
  centreHospitaliers: CentreHospitalier[] = [];

  private subscriptions: Subscription = new Subscription();

  // Getters pour un accès plus facile aux contrôles du formulaire
  get f() { return this.missionForm.controls; }
  get dateMissions() { return this.missionForm.get('dateMissions'); }
  get dateFinMissions() { return this.missionForm.get('dateFinMissions'); }
  get startTime() { return this.missionForm.get('startTime'); }
  get endTime() { return this.missionForm.get('endTime'); }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private missionService: MissionService,
    private medecinService: MedecinService,
    private chService: CentreHospitalierService,
    private toastService: ToastService,
    @Inject('dateFormat') private dateFormat: string
  ) {
    this.initForm();
  }

  // Méthodes d'accès aux services avec typage fort
  private getMissionById(id: number): Observable<Missions> {
    return this.missionService.getMissionById(id);
  }

  private updateMission(id: number, mission: Partial<Missions>): Observable<Missions> {
    return this.missionService.updateMission(id, mission);
  }

  private createMission(mission: Partial<Missions>): Observable<Missions> {
    return this.missionService.createMission(mission);
  }

  private getMedecinsByChId(chId: number): Observable<Medecin[]> {
    return this.medecinService.getMedecinsByCentreHospitalier(chId);
  }

  private getAllCentresHospitaliers(): Observable<CentreHospitalier[]> {
    return this.chService.getAllCentreHospitaliers();
  }

  private showToastMessage(message: string, type: ToastType): void {
    this.toastService.show(message, { 
      classname: type === 'success' ? 'bg-success text-light' : 
                 type === 'error' ? 'bg-danger text-light' : 'bg-warning text-dark',
      delay: 5000 
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');
        if (idParam) {
          const id = +idParam;
          if (!isNaN(id) && id > 0) {
            this.missionId = id;
            this.loadMission();
          } else {
            console.error('ID de mission invalide:', idParam);
            this.router.navigate(['/missions']);
          }
        } else {
          // Mode création d'une nouvelle mission
          this.loadCentreHospitaliers();
          this.loadSpecialites();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des paramètres de route', error);
        this.router.navigate(['/missions']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm(): void {
    if (this.missionForm) {
      return;
    }
    
    this.missionForm = this.fb.group({
      detailMission: ['', [Validators.required, Validators.maxLength(1000)]],
      statutAnnonce: ['', Validators.required],
      salaireMission: [0, [Validators.required, Validators.min(0)]],
      typeHoraireMission: ['JOUR', Validators.required],
      dateMissions: [this.today, Validators.required],
      dateFinMissions: [this.today, [Validators.required, dateFinValidator]],
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', [Validators.required, heureFinValidator]]
    });

    // Mise à jour dynamique des validateurs
    this.dateMissions?.valueChanges.subscribe(() => {
      this.dateFinMissions?.updateValueAndValidity();
    });

    this.startTime?.valueChanges.subscribe(() => {
      this.endTime?.updateValueAndValidity();
    });
  }

  private loadMission(): void {
    if (!this.missionId) return;

    this.subscriptions.add(
      this.getMissionById(this.missionId).subscribe({
        next: (mission: Missions) => {
          this.mission = mission;
          this.patchFormWithMissionData();
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement de la mission', error);
          this.showToastMessage('Erreur lors du chargement de la mission', 'error');
        }
      })
    );
  }

  private patchFormWithMissionData(): void {
    if (!this.mission) return;

    const dateDebut = this.mission.dateMissions ? new Date(this.mission.dateMissions) : null;
    const dateFin = this.mission.dateFinMissions ? new Date(this.mission.dateFinMissions) : null;

    this.missionForm.patchValue({
      detailMission: this.mission.detailMission || '',
      statutAnnonce: this.mission.statutAnnonce || 'En Cours',
      salaireMission: this.mission.salaireMission || 0,
      typeHoraireMission: this.mission.typeHoraireMission || 'JOUR',
      dateMissions: dateDebut ? this.formatDate(dateDebut) : this.today,
      dateFinMissions: dateFin ? this.formatDate(dateFin) : this.today,
      startTime: this.mission.startTime || '09:00',
      endTime: this.mission.endTime || '17:00'
    });

    if (this.mission.medecin) {
      this.selectedMedecin = this.mission.medecin;
    }
    if (this.mission.centreHospitalier) {
      this.selectedCh = this.mission.centreHospitalier;
      this.loadMedecinsByCentreHospitalier(this.selectedCh.id);
    }
  }

  private loadCentreHospitaliers(): void {
    this.subscriptions.add(
      this.getAllCentresHospitaliers().subscribe({
        next: (centres: CentreHospitalier[]) => {
          this.centreHospitaliers = centres;
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des centres hospitaliers', error);
          this.showToastMessage('Erreur lors du chargement des centres hospitaliers', 'error');
        }
      })
    );
  }

  private loadSpecialites(): void {
    // Implémentez le chargement des spécialités depuis votre service
    // this.specialites = ...
  }

  onSelectCentreHospitalier(ch: CentreHospitalier): void {
    if (!ch?.id) return;
    this.selectedCh = ch;
    this.loadMedecinsByCentreHospitalier(ch.id);
  }

  private loadMedecinsByCentreHospitalier(chId: number | undefined): void {
    if (!chId) return;
    
    const subscription = this.getMedecinsByChId(chId).subscribe({
      next: (medecins: Medecin[]) => {
        this.medecins = medecins;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des médecins', error);
        this.showToastMessage('Erreur lors du chargement des médecins', 'error');
      }
    });
    
    this.subscriptions.add(subscription);
  }

  // Méthode appelée lors de la soumission du formulaire
  modifierMission(): void {
    this.submitted = true;

    if (this.missionForm.invalid) {
      this.showToastMessage('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }

    if (!this.selectedMedecin || !this.selectedCh) {
      this.showToastMessage('Veuillez sélectionner un médecin et un centre hospitalier', 'warning');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.missionForm.getRawValue();
    
    try {
      const missionData: Partial<Missions> = {
        ...this.mission,
        ...formValue,
        medecin: this.selectedMedecin,
        centreHospitalier: this.selectedCh,
        dateMissions: this.formatDateTime(formValue.dateMissions, formValue.startTime),
        dateFinMissions: this.formatDateTime(formValue.dateFinMissions, formValue.endTime)
      };

      const missionObservable = this.missionId
        ? this.updateMission(this.missionId, missionData)
        : this.createMission(missionData);

      this.subscriptions.add(
        missionObservable.subscribe({
          next: () => {
            this.showToastMessage('Mission enregistrée avec succès', 'success');
            this.router.navigate(['/missions']);
          },
          error: (error: Error) => {
            console.error('Erreur lors de l\'enregistrement de la mission', error);
            this.showToastMessage(
              error.message || 'Erreur lors de l\'enregistrement de la mission', 
              'error'
            );
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        })
      );
    } catch (error) {
      console.error('Erreur lors de la préparation des données de la mission', error);
      this.showToastMessage('Erreur lors de la préparation des données', 'error');
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    if (confirm('Voulez-vous vraiment annuler les modifications ?')) {
      this.router.navigate(['/missions']);
    }
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }

  private formatDateTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(dateStr);
      date.setHours(hours, minutes);
      const formattedDate = date.toISOString();
      if (!formattedDate) {
        throw new Error('Format de date invalide');
      }
      return formattedDate;
    } catch (error) {
      console.error('Erreur de format de date/heure', { dateStr, timeStr, error });
      throw new Error('Format de date ou d\'heure invalide');
    }
  }
}
