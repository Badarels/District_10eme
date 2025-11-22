import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ToastrModule
  ]
})
export class PatientDetailsComponent implements OnInit {
  patient!: Patient;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadPatient(id);
  }

  loadPatient(id: number): void {
    this.loading = true;
    this.patientService.findById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
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

  editPatient(): void {
    this.router.navigate(['/patients/edit', this.patient.id]);
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }
}

