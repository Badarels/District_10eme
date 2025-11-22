import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HospitalisationService } from '../../../core/services/hospitalisation.service';
import { Hospitalisation } from '../../../core/models/hospitalisation.model';

@Component({
  selector: 'app-liste-hospitalisation',
  templateUrl: './liste-hospitalisation.component.html',
  styleUrls: ['./liste-hospitalisation.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ToastrModule
  ]
})
export class ListeHospitalisationComponent implements OnInit {
  hospitalisations: Hospitalisation[] = [];
  filteredHospitalisations: Hospitalisation[] = [];
  loading = false;
  searchTerm = '';

  constructor(
    private hospitalisationService: HospitalisationService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadHospitalisations();
  }

  loadHospitalisations(): void {
    this.loading = true;
    this.hospitalisationService.findAll().subscribe({
      next: (data) => {
        this.hospitalisations = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement', 'Erreur');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredHospitalisations = [...this.hospitalisations];
      return;
    }

    this.filteredHospitalisations = this.hospitalisations.filter((hosp) => {
      const patient = `${hosp.patientId ?? ''}`.toLowerCase();
      const medecin = `${hosp.medecinId ?? ''}`.toLowerCase();
      const lit = `${hosp.litId ?? ''}`.toLowerCase();
      const motif = (hosp.motifAdmission ?? '').toLowerCase();
      const observations = (hosp.observations ?? '').toLowerCase();
      const dateAdmission = hosp.dateAdmission ? new Date(hosp.dateAdmission).toLocaleDateString().toLowerCase() : '';
      const dateSortie = hosp.dateSortie ? new Date(hosp.dateSortie).toLocaleDateString().toLowerCase() : '';

      return (
        patient.includes(term) ||
        medecin.includes(term) ||
        lit.includes(term) ||
        motif.includes(term) ||
        observations.includes(term) ||
        dateAdmission.includes(term) ||
        dateSortie.includes(term)
      );
    });
  }

  getStatutBadge(hosp: Hospitalisation): string {
    if (!hosp.dateSortie) {
      return 'bg-warning';
    }
    return 'bg-success';
  }

  getStatutLabel(hosp: Hospitalisation): string {
    return hosp.dateSortie ? 'Clôturée' : 'En cours';
  }

  addHospitalisation(): void {
    this.router.navigate(['/hospitalisations/ajout']);
  }
}

