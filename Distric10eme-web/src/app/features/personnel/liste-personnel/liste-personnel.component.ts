import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel.service';
import { PersonnelMedical, TypePersonnel } from '../../../core/models/personnel.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-liste-personnel',
  templateUrl: './liste-personnel.component.html',
  styleUrls: ['./liste-personnel.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ListePersonnelComponent implements OnInit {
  personnel: PersonnelMedical[] = [];
  filteredPersonnel: PersonnelMedical[] = [];
  searchTerm: string = '';
  selectedType: TypePersonnel | 'ALL' = 'ALL';
  loading = false;

  typePersonnelOptions = [
    { value: 'ALL', label: 'Tous' },
    { value: TypePersonnel.MEDECIN, label: 'Médecins' },
    { value: TypePersonnel.INFIRMIER, label: 'Infirmiers' },
    { value: TypePersonnel.AIDE_SOIGNANT, label: 'Aides-soignants' },
    { value: TypePersonnel.PHARMACIEN, label: 'Pharmaciens' },
    { value: TypePersonnel.TECHNICIEN_LABORATOIRE, label: 'Techniciens de laboratoire' },
    { value: TypePersonnel.RADIOLOGUE, label: 'Radiologues' },
    { value: TypePersonnel.KINESITHERAPEUTE, label: 'Kinésithérapeutes' },
    { value: TypePersonnel.SECRETAIRE_MEDICAL, label: 'Secrétaires médicaux' }
  ];

  constructor(
    private personnelService: PersonnelService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPersonnel();
  }

  loadPersonnel(): void {
    this.loading = true;
    this.personnelService.findAll().subscribe({
      next: (data) => {
        this.personnel = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.toastr.error('Erreur lors du chargement du personnel', 'Erreur');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.personnel];

    // Filtre par type
    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(p => p.typePersonnel === this.selectedType);
    }

    // Filtre par recherche
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter((p) => {
        const nom = (p.nom ?? '').toLowerCase();
        const prenom = (p.prenom ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        const numeroOrdre = (p.numeroOrdre ?? '').toLowerCase();
        const specialite = (p.specialiteNom ?? '').toLowerCase();

        return (
          nom.includes(term) ||
          prenom.includes(term) ||
          email.includes(term) ||
          numeroOrdre.includes(term) ||
          specialite.includes(term)
        );
      });
    }

    this.filteredPersonnel = filtered;
  }

  onTypeChange(): void {
    this.applyFilter();
  }

  getBadgeClass(type: TypePersonnel | undefined): string {
    switch (type) {
      case TypePersonnel.MEDECIN:
        return 'bg-primary';
      case TypePersonnel.INFIRMIER:
        return 'bg-info text-dark';
      case TypePersonnel.AIDE_SOIGNANT:
        return 'bg-warning text-dark';
      case TypePersonnel.PHARMACIEN:
        return 'bg-success';
      case TypePersonnel.TECHNICIEN_LABORATOIRE:
        return 'bg-secondary';
      case TypePersonnel.RADIOLOGUE:
        return 'bg-purple';
      case TypePersonnel.KINESITHERAPEUTE:
        return 'bg-orange';
      case TypePersonnel.SECRETAIRE_MEDICAL:
        return 'bg-teal';
      default:
        return 'bg-secondary';
    }
  }

  getTypeLabel(type: TypePersonnel | undefined): string {
    if (!type) return '—';
    const option = this.typePersonnelOptions.find(opt => opt.value === type);
    return option ? option.label : '—';
  }

  editPersonnel(id: number): void {
    this.router.navigate(['/personnel/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/personnel/details', id]);
  }

  deletePersonnel(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
      this.personnelService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Personnel supprimé avec succès', 'Succès');
          this.loadPersonnel();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastr.error('Erreur lors de la suppression', 'Erreur');
        }
      });
    }
  }

  addPersonnel(): void {
    this.router.navigate(['/personnel/ajout']);
  }
}

