import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { PatientService } from '../../../core/services/patient.service';
import { PersonnelService } from '../../../core/services/personnel.service';
import { RendezVous } from '../../../core/models/rendezvous.model';
import { Patient } from '../../../core/models/patient.model';
import { PersonnelMedical } from '../../../core/models/personnel.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-liste-rendezvous',
  templateUrl: './liste-rendezvous.component.html',
  styleUrls: ['./liste-rendezvous.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ListeRendezVousComponent implements OnInit {
  rendezvous: RendezVous[] = [];
  filteredRendezVous: RendezVous[] = [];
  searchTerm: string = '';
  filterStatut: string = 'TOUS';
  loading = false;

  // Lookup maps
  patients: { [id: number]: Patient } = {};
  medecins: { [id: number]: PersonnelMedical } = {};

  // KPIs
  get totalRdv(): number { return this.rendezvous.length; }
  get rdvAujourdhui(): number {
    const today = new Date().toDateString();
    return this.rendezvous.filter(r => r.dateHeure && new Date(r.dateHeure).toDateString() === today).length;
  }
  get rdvConfirmes(): number {
    return this.rendezvous.filter(r => r.statut === 'CONFIRME').length;
  }
  get rdvEnAttente(): number {
    return this.rendezvous.filter(r => !r.statut || r.statut === 'PLANIFIE').length;
  }

  statutFilters = [
    { label: 'Tous', value: 'TOUS' },
    { label: 'En attente', value: 'PLANIFIE' },
    { label: 'Confirmés', value: 'CONFIRME' },
    { label: 'Annulés', value: 'ANNULE' },
    { label: 'Terminés', value: 'TERMINE' },
  ];

  constructor(
    private rendezVousService: RendezVousService,
    private patientService: PatientService,
    private personnelService: PersonnelService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadRendezVous();
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

  loadRendezVous(): void {
    this.loading = true;
    this.rendezVousService.findAll().subscribe({
      next: (data) => {
        // Tri du plus récent au plus ancien
        this.rendezvous = (data || []).sort((a, b) =>
          new Date(b.dateHeure || 0).getTime() - new Date(a.dateHeure || 0).getTime()
        );
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des rendez-vous', 'Erreur');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let result = [...this.rendezvous];

    // Filtre statut
    if (this.filterStatut !== 'TOUS') {
      result = result.filter(r => r.statut === this.filterStatut ||
        (this.filterStatut === 'PLANIFIE' && (!r.statut || r.statut === 'PLANIFIE'))
      );
    }

    // Filtre recherche texte
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (term) {
      result = result.filter(r => {
        const patient = r.patientId ? this.patients[r.patientId] : null;
        const medecin = r.medecinId ? this.medecins[r.medecinId] : null;
        const patientName = patient ? `${patient.prenom} ${patient.nom}`.toLowerCase() : '';
        const medecinName = medecin ? `${medecin.prenom} ${medecin.nom}`.toLowerCase() : '';
        return patientName.includes(term) ||
               medecinName.includes(term) ||
               (r.motif || '').toLowerCase().includes(term) ||
               (r.statut || '').toLowerCase().includes(term) ||
               (r.dateHeure || '').includes(term);
      });
    }

    this.filteredRendezVous = result;
  }

  setFilter(statut: string): void {
    this.filterStatut = statut;
    this.applyFilter();
  }

  addRendezVous(): void {
    this.router.navigate(['/rendezvous/ajout']);
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

  isToday(dateHeure: string): boolean {
    return new Date(dateHeure).toDateString() === new Date().toDateString();
  }

  isFuture(dateHeure: string): boolean {
    return new Date(dateHeure) > new Date();
  }

  getStatutConfig(statut: string | undefined): { label: string; cls: string; icon: string } {
    switch (statut) {
      case 'CONFIRME':   return { label: 'Confirmé',  cls: 'lrdv-badge-green',  icon: 'bi-check-circle-fill' };
      case 'ANNULE':     return { label: 'Annulé',    cls: 'lrdv-badge-red',    icon: 'bi-x-circle-fill' };
      case 'TERMINE':    return { label: 'Terminé',   cls: 'lrdv-badge-blue',   icon: 'bi-check2-all' };
      case 'ABSENT':     return { label: 'Absent',    cls: 'lrdv-badge-orange', icon: 'bi-person-x-fill' };
      default:           return { label: 'En attente',cls: 'lrdv-badge-amber',  icon: 'bi-clock-fill' };
    }
  }
}
