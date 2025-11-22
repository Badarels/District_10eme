import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContaintsComponent } from './layouts/main-containts/main-containts.component';

const routes: Routes = [
  // Redirection par défaut vers le tableau de bord
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Layout principal du SIH
  {
    path: '',
    component: MainContaintsComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('./features/patients/patients.module').then(m => m.PatientsModule)
      },
      {
        path: 'rendezvous',
        loadChildren: () =>
          import('./features/rendezvous/rendezvous.module').then(m => m.RendezVousModule)
      },
      {
        path: 'consultations',
        loadChildren: () =>
          import('./features/consultations/consultations.module').then(m => m.ConsultationsModule)
      },
      {
        path: 'hospitalisations',
        loadChildren: () =>
          import('./features/hospitalisations/hospitalisations.module').then(m => m.HospitalisationsModule)
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import('./features/reporting/reporting.module').then(m => m.ReportingModule)
      },
      {
        path: 'personnel',
        loadChildren: () =>
          import('./features/personnel/personnel.module').then(m => m.PersonnelModule)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.module').then(m => m.UsersModule)
      }
    ]
  },

  // Authentification
  {
    path: 'login',
    loadChildren: () =>
      import('./authentification/authetification.module').then(m => m.AuthetificationModule)
  },

  // Redirection si route non trouvée
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
