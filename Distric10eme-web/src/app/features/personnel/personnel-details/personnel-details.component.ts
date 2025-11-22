import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel.service';
import { PersonnelMedical, TypePersonnel } from '../../../core/models/personnel.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personnel-details',
  templateUrl: './personnel-details.component.html',
  styleUrls: ['./personnel-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PersonnelDetailsComponent implements OnInit {
  personnel!: PersonnelMedical;
  loading = false;
  typePersonnelOptions: { value: TypePersonnel; label: string }[] = [
    { value: TypePersonnel.MEDECIN, label: 'Médecin' },
    { value: TypePersonnel.INFIRMIER, label: 'Infirmier' },
    { value: TypePersonnel.AIDE_SOIGNANT, label: 'Aide-soignant' },
    { value: TypePersonnel.PHARMACIEN, label: 'Pharmacien' },
    { value: TypePersonnel.TECHNICIEN_LABORATOIRE, label: 'Technicien de laboratoire' },
    { value: TypePersonnel.RADIOLOGUE, label: 'Radiologue' },
    { value: TypePersonnel.KINESITHERAPEUTE, label: 'Kinésithérapeute' },
    { value: TypePersonnel.SECRETAIRE_MEDICAL, label: 'Secrétaire médical' },
    { value: TypePersonnel.ADMINISTRATEUR, label: 'Administrateur' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personnelService: PersonnelService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadPersonnel(id);
  }

  loadPersonnel(id: number): void {
    this.loading = true;
    this.personnelService.findById(id).subscribe({
      next: (personnel) => {
        this.personnel = personnel;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.toastr.error('Erreur lors du chargement du personnel', 'Erreur');
        this.loading = false;
        this.router.navigate(['/personnel']);
      }
    });
  }

  editPersonnel(): void {
    this.router.navigate(['/personnel/edit', this.personnel.id]);
  }

  goBack(): void {
    this.router.navigate(['/personnel']);
  }

  getTypeLabel(type: TypePersonnel): string {
    const option = this.typePersonnelOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  }
}

