import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PersonnelService } from '../../../core/services/personnel.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { TypePersonnel, Specialite } from '../../../core/models/personnel.model';

@Component({
  selector: 'app-edit-personnel',
  templateUrl: './edit-personnel.component.html',
  styleUrls: ['./edit-personnel.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbDatepickerModule
  ]
})
export class EditPersonnelComponent implements OnInit {
  personnelForm!: FormGroup;
  personnelId!: number;
  specialites: Specialite[] = [];
  loading = false;
  typePersonnelOptions = Object.values(TypePersonnel);

  constructor(
    private fb: FormBuilder,
    private personnelService: PersonnelService,
    private specialiteService: SpecialiteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.personnelId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadSpecialites();
    this.loadPersonnel();
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

  loadPersonnel(): void {
    this.loading = true;
    this.personnelService.findById(this.personnelId).subscribe({
      next: (personnel) => {
        this.personnelForm.patchValue({
          ...personnel,
          dateNaissance: personnel.dateNaissance ? personnel.dateNaissance.split('T')[0] : '',
          dateEmbauche: personnel.dateEmbauche ? personnel.dateEmbauche.split('T')[0] : ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.toastr.error('Erreur lors du chargement du personnel', 'Erreur');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.personnelForm.valid) {
      this.loading = true;
      const formValue = this.personnelForm.value;
      
      if (!formValue.specialiteId) {
        delete formValue.specialiteId;
      }
      
      this.personnelService.update(this.personnelId, formValue).subscribe({
        next: () => {
          this.toastr.success('Personnel modifié avec succès', 'Succès');
          this.router.navigate(['/personnel']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.toastr.error(error.error?.message || 'Erreur lors de la modification', 'Erreur');
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

