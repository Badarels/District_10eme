import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HospitalisationService } from '../../../core/services/hospitalisation.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { Hospitalisation } from '../../../core/models/hospitalisation.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-liste-hospitalisation',
  templateUrl: './liste-hospitalisation.component.html',
  styleUrls: ['./liste-hospitalisation.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ListeHospitalisationComponent implements OnInit {
  hospitalisations: Hospitalisation[] = [];
  filteredHospitalisations: Hospitalisation[] = [];
  loading = false;
  searchTerm = '';
  filterStatut: 'TOUS' | 'EN_COURS' | 'CLOTUREE' = 'TOUS';

  patients: { [id: number]: Patient } = {};
  medecins: { [id: number]: PersonnelMedical } = {};

  statutFilters = [
    { label: 'Tous', value: 'TOUS' as const },
    { label: 'En cours', value: 'EN_COURS' as const },
    { label: 'Clôturées', value: 'CLOTUREE' as const }
  ];

  get totalHosp(): number {
    return this.hospitalisations.length;
  }

  get hospEnCours(): number {
    return this.hospitalisations.filter(h => !h.dateSortie).length;
  }

  get hospCloturees(): number {
    return this.hospitalisations.filter(h => !!h.dateSortie).length;
  }

  get hospAujourdhui(): number {
    const today = new Date().toDateString();
    return this.hospitalisations.filter(h => h.dateAdmission && new Date(h.dateAdmission).toDateString() === today).length;
  }

  constructor(
    private hospitalisationService: HospitalisationService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadHospitalisations();
  }

  loadLookups(): void {
    this.patientService.findAll().subscribe({
      next: (data) => data.forEach(p => { if (p.id) this.patients[p.id] = p; }),
      error: () => {}
    });
    this.personnelService.findAll().subscribe({
      next: (data) => data.forEach(m => { if (m.id) this.medecins[m.id] = m; }),
      error: () => {}
    });
  }

  loadHospitalisations(): void {
    this.loading = true;
    this.hospitalisationService.findAll().subscribe({
      next: (data) => {
        this.hospitalisations = (data || []).sort((a, b) =>
          new Date(b.dateAdmission || 0).getTime() - new Date(a.dateAdmission || 0).getTime()
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des hospitalisations', 'Erreur');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let result = [...this.hospitalisations];

    if (this.filterStatut === 'EN_COURS') {
      result = result.filter(h => !h.dateSortie);
    } else if (this.filterStatut === 'CLOTUREE') {
      result = result.filter(h => !!h.dateSortie);
    }

    const term = (this.searchTerm || '').trim().toLowerCase();
    if (term) {
      result = result.filter(h => {
        const patient = h.patientId ? this.patients[h.patientId] : null;
        const medecin = h.medecinId ? this.medecins[h.medecinId] : null;
        const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
        const medecinName = medecin ? `${medecin.prenom} ${medecin.nom}`.toLowerCase() : '';
        return patientName.includes(term) ||
               medecinName.includes(term) ||
               `${h.patientId ?? ''}`.includes(term) ||
               `${h.medecinId ?? ''}`.includes(term) ||
               `${h.litId ?? ''}`.includes(term) ||
               (h.motifAdmission || '').toLowerCase().includes(term) ||
               (h.observations || '').toLowerCase().includes(term);
      });
    }

    this.filteredHospitalisations = result;
  }

  setFilter(statut: 'TOUS' | 'EN_COURS' | 'CLOTUREE'): void {
    this.filterStatut = statut;
    this.applyFilter();
  }

  addHospitalisation(): void {
    this.router.navigate(['/hospitalisations/ajout']);
  }

  getPatientName(patientId: number): string {
    const p = this.patients[patientId];
    return p ? `${p.prenom} ${p.nom}` : `Patient #${patientId}`;
  }

  getMedecinName(medecinId: number): string {
    const m = this.medecins[medecinId];
    return m ? `Dr. ${m.prenom} ${m.nom}` : `Médecin #${medecinId}`;
  }

  getMedecinSpec(medecinId: number): string {
    const m = this.medecins[medecinId];
    return m?.specialiteNom || 'Médecine générale';
  }

  getPatientInitials(patientId: number): string {
    const p = this.patients[patientId];
    if (!p) return '#';
    return ((p.prenom || '').charAt(0) + (p.nom || '').charAt(0)).toUpperCase();
  }

  isToday(date: string | undefined): boolean {
    if (!date) return false;
    return new Date(date).toDateString() === new Date().toDateString();
  }

  getDuree(hosp: Hospitalisation): string {
    if (!hosp.dateAdmission) return '—';
    const start = new Date(hosp.dateAdmission);
    const end = hosp.dateSortie ? new Date(hosp.dateSortie) : new Date();
    const days = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
    if (days === 0) return 'Moins d\'1 jour';
    return days === 1 ? '1 jour' : `${days} jours`;
  }

  getStatutConfig(hosp: Hospitalisation): { label: string; cls: string; icon: string } {
    if (hosp.dateSortie) {
      return { label: 'Clôturée', cls: 'lhosp-badge-green', icon: 'bi-check-circle-fill' };
    }
    return { label: 'En cours', cls: 'lhosp-badge-amber', icon: 'bi-heart-pulse-fill' };
  }
}
