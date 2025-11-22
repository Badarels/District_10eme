import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RendezVousService } from '../../../core/services/rendezvous.service';

@Component({
  selector: 'app-ajout-rendezvous',
  templateUrl: './ajout-rendezvous.component.html',
  styleUrls: ['./ajout-rendezvous.component.css'],
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
export class AjoutRendezVousComponent implements OnInit {
  rendezVousForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private rendezVousService: RendezVousService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.rendezVousForm = this.fb.group({
      patientId: ['', [Validators.required]],
      medecinId: ['', [Validators.required]],
      dateHeure: ['', [Validators.required]],
      motif: ['']
    });
  }

  onSubmit(): void {
    if (this.rendezVousForm.valid) {
      this.loading = true;
      this.rendezVousService.create(this.rendezVousForm.value).subscribe({
        next: () => {
          this.toastr.success('Rendez-vous créé avec succès', 'Succès');
          this.router.navigate(['/rendezvous']);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/rendezvous']);
  }
}

