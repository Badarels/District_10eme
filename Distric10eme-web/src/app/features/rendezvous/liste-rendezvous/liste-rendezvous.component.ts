import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RendezVousService } from '../../../core/services/rendezvous.service';
import { RendezVous } from '../../../core/models/rendezvous.model';
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
  
  // Pour la pagination
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  loading = false;

  constructor(
    private rendezVousService: RendezVousService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRendezVous();
  }

  loadRendezVous(): void {
    this.loading = true;
    this.rendezVousService.findAll().subscribe({
      next: (data) => {
        this.rendezvous = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.toastr.error('Erreur lors du chargement', 'Erreur');
        this.loading = false;
      }
    });
  }

  addRendezVous(): void {
    this.router.navigate(['/rendezvous/ajout']);
  }

  /**
   * Normalise une chaîne pour la recherche (enlève les accents et met en minuscule)
   */
  private normalizeString(str: string | number | null | undefined): string {
    if (str === null || str === undefined) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Vérifie si une valeur correspond au terme de recherche
   */
  private matchesSearch(value: string | number | Date | null | undefined, searchTerm: string): boolean {
    if (value === null || value === undefined) return false;
    
    // Si c'est une date, on la formate pour la recherche
    if (value instanceof Date) {
      const dateStr = value.toLocaleDateString('fr-FR');
      const timeStr = value.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
      return this.normalizeString(dateStr).includes(searchTerm) || 
             this.normalizeString(timeStr).includes(searchTerm);
    }
    
    // Pour les chaînes, on normalise avant comparaison
    return this.normalizeString(String(value)).includes(searchTerm);
  }

  applyFilter(): void {
    if (!this.searchTerm?.trim()) {
      this.filteredRendezVous = [...this.rendezvous];
      return;
    }

    const searchTerm = this.normalizeString(this.searchTerm);
    
    this.filteredRendezVous = this.rendezvous.filter(rdv => 
      this.matchesSearch(rdv.patientId, searchTerm) ||
      this.matchesSearch(rdv.medecinId, searchTerm) ||
      this.matchesSearch(rdv.motif, searchTerm) ||
      this.matchesSearch(rdv.statut, searchTerm) ||
      this.matchesSearch(rdv.dateHeure, searchTerm)  // Recherche aussi sur la date
    );
  }

  getBadgeClass(statut: string | undefined): string {
    switch (statut?.toLowerCase()) {
      case 'confirmé':
        return 'bg-success';
      case 'annulé':
        return 'bg-danger';
      case 'en attente':
        return 'bg-warning';
      case 'terminé':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}

