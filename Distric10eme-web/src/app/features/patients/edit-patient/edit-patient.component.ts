import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule
  ]
})
export class EditPatientComponent implements OnInit {
  patientForm!: FormGroup;
  patientId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadPatient();
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

  get patientInitials(): string {
    const p = (this.patientForm.get('prenom')?.value || '').trim().charAt(0).toUpperCase();
    const n = (this.patientForm.get('nom')?.value || '').trim().charAt(0).toUpperCase();
    return (p + n) || 'P';
  }

  setSexe(value: string): void {
    this.patientForm.patchValue({ sexe: value });
    this.patientForm.get('sexe')?.markAsTouched();
  }

  loadPatient(): void {
    this.loading = true;
    this.patientService.findById(this.patientId).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          ...patient,
          dateNaissance: patient.dateNaissance ? patient.dateNaissance.split('T')[0] : ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.toastr.error('Erreur lors du chargement du patient', 'Erreur');
        this.loading = false;
        this.router.navigate(['/patients']);
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const patientData = this.patientForm.value;
      
      this.patientService.update(this.patientId, patientData).subscribe({
        next: () => {
          this.toastr.success('Patient modifié avec succès', 'Succès');
          this.router.navigate(['/patients/details', this.patientId]);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.toastr.error(error.error?.message || 'Erreur lors de la modification', 'Erreur');
          this.loading = false;
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Attention');
    }
  }

  onCancel(): void {
    this.router.navigate(['/patients/details', this.patientId]);
  }
}
