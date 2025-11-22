import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ConsultationService } from '../../../core/services/consultation.service';

@Component({
  selector: 'app-ajout-consultation',
  templateUrl: './ajout-consultation.component.html',
  styleUrls: ['./ajout-consultation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ToastrModule
  ]
})
export class AjoutConsultationComponent implements OnInit {
  consultationForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private consultationService: ConsultationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.consultationForm = this.fb.group({
      patientId: ['', [Validators.required]],
      medecinId: ['', [Validators.required]],
      dateConsultation: ['', [Validators.required]],
      motif: [''],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.consultationForm.valid) {
      this.loading = true;
      this.consultationService.create(this.consultationForm.value).subscribe({
        next: () => {
          this.toastr.success('Consultation créée avec succès', 'Succès');
          this.router.navigate(['/consultations']);
        },
        error: () => {
          this.toastr.error('Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/consultations']);
  }
}

