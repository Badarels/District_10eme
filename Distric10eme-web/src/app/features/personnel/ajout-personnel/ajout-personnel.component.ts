import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from '../../../core/services/personnel.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { TypePersonnel, Specialite } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-ajout-personnel',
  templateUrl: './ajout-personnel.component.html',
  styleUrls: ['./ajout-personnel.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule
  ]
})
export class AjoutPersonnelComponent implements OnInit {
  personnelForm!: FormGroup;
  specialites: Specialite[] = [];
  loading = false;
  typePersonnelOptions = Object.values(TypePersonnel);

  constructor(
    private fb: FormBuilder,
    private personnelService: PersonnelService,
    private specialiteService: SpecialiteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialites();
  }

  initForm(): void {
    this.personnelForm = this.fb.group({
      numeroOrdre: [''],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      dateNaissance: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      adresse: [''],
      typePersonnel: ['', [Validators.required]],
      specialiteId: [''],
      numeroLicence: [''],
      dateEmbauche: [''],
      actif: [true]
    });
  }

  loadSpecialites(): void {
    this.specialiteService.findAll().subscribe({
      next: (data) => {
        this.specialites = data;
      },
      error: () => {
        this.toastr.warning('Erreur lors du chargement des spécialités', 'Attention');
      }
    });
  }

  onSubmit(): void {
    if (this.personnelForm.valid) {
      this.loading = true;
      const formValue = { ...this.personnelForm.value };
      
      if (!formValue.specialiteId) {
        delete formValue.specialiteId;
      } else {
        formValue.specialiteId = Number(formValue.specialiteId);
      }

      if (!formValue.numeroOrdre || !formValue.numeroOrdre.trim()) {
        formValue.numeroOrdre = null;
      } else {
        formValue.numeroOrdre = formValue.numeroOrdre.trim();
      }

      if (!formValue.numeroLicence || !formValue.numeroLicence.trim()) {
        formValue.numeroLicence = null;
      } else {
        formValue.numeroLicence = formValue.numeroLicence.trim();
      }

      if (!formValue.dateEmbauche) {
        formValue.dateEmbauche = null;
      }
      
      this.personnelService.create(formValue).subscribe({
        next: () => {
          this.toastr.success('Personnel créé avec succès', 'Succès');
          this.router.navigate(['/personnel']);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.toastr.error(error.error?.message || 'Erreur lors de la création', 'Erreur');
          this.loading = false;
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires', 'Attention');
    }
  }

  onCancel(): void {
    this.router.navigate(['/personnel']);
  }

  get showSpecialite(): boolean {
    return this.personnelForm.get('typePersonnel')?.value === TypePersonnel.MEDECIN;
  }
}

