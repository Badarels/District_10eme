import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { RendezVousService } from '../../core/services/rendezvous.service';
import { ConsultationService } from '../../core/services/consultation.service';
import { HospitalisationService } from '../../core/services/hospitalisation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPatients: 0,
    totalRendezVous: 0,
    totalConsultations: 0,
    totalHospitalisations: 0
  };
  loading = true;
  private pendingRequests = 0;

  constructor(
    private patientService: PatientService,
    private rendezVousService: RendezVousService,
    private consultationService: ConsultationService,
    private hospitalisationService: HospitalisationService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.pendingRequests = 4;

    this.patientService.findAll().subscribe({
      next: (patients) => {
        this.stats.totalPatients = patients.length;
        this.onRequestComplete();
      },
      error: () => this.onRequestComplete()
    });

    this.rendezVousService.findAll().subscribe({
      next: (rendezvous) => {
        this.stats.totalRendezVous = rendezvous.length;
        this.onRequestComplete();
      },
      error: () => this.onRequestComplete()
    });

    this.consultationService.findAll().subscribe({
      next: (consultations) => {
        this.stats.totalConsultations = consultations.length;
        this.onRequestComplete();
      },
      error: () => this.onRequestComplete()
    });

    this.hospitalisationService.findAll().subscribe({
      next: (hospitalisations) => {
        this.stats.totalHospitalisations = hospitalisations.length;
        this.onRequestComplete();
      },
      error: () => this.onRequestComplete()
    });
  }

  private onRequestComplete(): void {
    this.pendingRequests = Math.max(0, this.pendingRequests - 1);
    if (this.pendingRequests === 0) {
      this.loading = false;
    }
  }
}
