import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { Utilisateur } from '../../../core/models/user.model';

@Component({
  selector: 'app-liste-user',
  templateUrl: './liste-user.component.html',
  styleUrls: ['./liste-user.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbDropdownModule,
    ToastrModule
  ]
})
export class ListeUserComponent implements OnInit {
  users: Utilisateur[] = [];
  loading = false;
  searchTerm = '';
  activeTab: 'list' | 'grid' = 'list';
  isDropdownOpen = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  setTab(tab: 'list' | 'grid'): void {
    this.activeTab = tab;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get filteredUsers(): Utilisateur[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.users;
    }

    return this.users.filter((user) => {
      const nom = (user.nom ?? '').toLowerCase();
      const prenom = (user.prenom ?? '').toLowerCase();
      const email = (user.email ?? '').toLowerCase();
      const role = (user.roleNom ?? '').toLowerCase();
      const statut = user.actif ? 'actif' : 'inactif';

      return (
        nom.includes(term) ||
        prenom.includes(term) ||
        email.includes(term) ||
        role.includes(term) ||
        statut.includes(term)
      );
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement', 'Erreur');
        this.loading = false;
      }
    });
  }
}

