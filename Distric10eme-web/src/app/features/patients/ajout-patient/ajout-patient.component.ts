import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
    NgbDatepickerModule
  ]
})
export class AjoutPatientComponent implements OnInit {
  patientForm!: FormGroup;
  loading = false;
  generatingNumber = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.generateNumeroDossier();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      numeroDossier: ['', [Validators.required]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      sexe: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      telephone: [''],
      email: ['', [Validators.email]],
      adresse: [''],
      groupeSanguin: ['']
    });
  }

  get patientInitials(): string {
    const p = (this.patientForm.get('prenom')?.value || '').trim().charAt(0).toUpperCase();
    const n = (this.patientForm.get('nom')?.value || '').trim().charAt(0).toUpperCase();
    return (p + n) || '+';
  }

  setSexe(value: string): void {
    this.patientForm.patchValue({ sexe: value });
    this.patientForm.get('sexe')?.markAsTouched();
  }

  generateNumeroDossier(): void {
    this.generatingNumber = true;
    this.patientService.generateNumeroDossier().subscribe({
      next: (res) => {
        if (res && res.numeroDossier) {
          this.patientForm.patchValue({ numeroDossier: res.numeroDossier });
        } else {
          this.applyLocalNumeroDossier();
        }
        this.generatingNumber = false;
      },
      error: () => {
        this.applyLocalNumeroDossier();
        this.generatingNumber = false;
      }
    });
  }

  private applyLocalNumeroDossier(): void {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.patientForm.patchValue({ numeroDossier: `PAT-${year}-${rand}` });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.toastr.warning('Veuillez renseigner les champs obligatoires (nom, prénom, sexe, date de naissance)', 'Formulaire incomplet');
      return;
    }

    this.loading = true;
    const patientData = { ...this.patientForm.value };

    if (!patientData.numeroDossier) {
      patientData.numeroDossier = `PAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    this.patientService.create(patientData).subscribe({
      next: (createdPatient) => {
        this.toastr.success(`Dossier #${createdPatient.numeroDossier} créé avec succès`, 'Succès');
        if (createdPatient.id) {
          this.router.navigate(['/patients/details', createdPatient.id]);
        } else {
          this.router.navigate(['/patients']);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création du patient:', error);
        this.toastr.error(error.error?.message || 'Erreur lors de la création du dossier patient', 'Erreur');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }
}
