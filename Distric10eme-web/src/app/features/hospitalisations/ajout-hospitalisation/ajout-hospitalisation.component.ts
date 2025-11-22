import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HospitalisationService } from '../../../core/services/hospitalisation.service';

@Component({
  selector: 'app-ajout-hospitalisation',
  templateUrl: './ajout-hospitalisation.component.html',
  styleUrls: ['./ajout-hospitalisation.component.css'],
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
export class AjoutHospitalisationComponent implements OnInit {
  hospitalisationForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private hospitalisationService: HospitalisationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.hospitalisationForm = this.fb.group({
      patientId: ['', [Validators.required]],
      medecinId: ['', [Validators.required]],
      litId: ['', [Validators.required]],
      dateAdmission: ['', [Validators.required]],
      dateSortie: [''],
      motifAdmission: [''],
      observations: ['']
    });
  }

  onSubmit(): void {
    if (this.hospitalisationForm.valid) {
      this.loading = true;
      this.hospitalisationService.create(this.hospitalisationForm.value).subscribe({
        next: () => {
          this.toastr.success('Hospitalisation créée avec succès', 'Succès');
          this.router.navigate(['/hospitalisations']);
        },
        error: () => {
          this.toastr.error('Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/hospitalisations']);
  }
}

