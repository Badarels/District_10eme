import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-ajout-patient',
  templateUrl: './ajout-patient.component.html',
  styleUrls: ['./ajout-patient.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule,
    ToastrModule
  ]
})
export class AjoutPatientComponent implements OnInit {
  patientForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      numeroDossier: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      telephone: [''],
      email: ['', [Validators.email]],
      adresse: [''],
      groupeSanguin: ['']
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const patientData = this.patientForm.value;
      const numeroDossier = patientData.numeroDossier;

      this.patientService.findByNumeroDossier(numeroDossier).subscribe({
        next: () => {
          this.toastr.error('Ce numéro de dossier est déjà attribué', 'Doublon détecté');
          this.loading = false;
        },
        error: (error) => {
          if (error.status === 404) {
            this.createPatient(patientData);
            return;
          }

          console.error('Erreur lors de la vérification du numéro de dossier:', error);
          this.toastr.error("Impossible de vérifier le numéro de dossier", 'Erreur');
          this.loading = false;
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Attention');
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  private createPatient(patientData: any): void {
    this.patientService.create(patientData).subscribe({
      next: () => {
        this.toastr.success('Patient créé avec succès', 'Succès');
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.toastr.error(error.error?.message || 'Erreur lors de la création du patient', 'Erreur');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

