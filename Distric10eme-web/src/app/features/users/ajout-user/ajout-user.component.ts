import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Utilisateur } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-ajout-user',
  standalone: true,
  templateUrl: './ajout-user.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToastrModule]
})
export class AjoutUserComponent {
  userForm: FormGroup;
  loading = false;
  roles = [
    { key: 'ADMIN', label: 'Administrateur' },
    { key: 'MEDECIN', label: 'Médecin' },
    { key: 'ASSISTANT', label: 'Assistant' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      actif: [true]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    const payload: Utilisateur = {
      prenom: formValue.prenom,
      nom: formValue.nom,
      email: formValue.email,
      actif: formValue.actif,
      roleNom: formValue.role
    };

    this.loading = true;
    this.userService.create(payload).subscribe({
      next: () => {
        this.toastr.success('Utilisateur créé avec succès', 'Succès');
        this.router.navigate(['/users']);
      },
      error: () => {
        this.toastr.error("Échec de l'enregistrement", 'Erreur');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
