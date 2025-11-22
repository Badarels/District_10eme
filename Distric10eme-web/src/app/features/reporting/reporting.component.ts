import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ReportingComponent {
  stats = [
    {
      title: 'Patients actifs',
      value: 248,
      trend: '+8%',
      trendType: 'up',
      icon: 'bi-person-heart'
    },
    {
      title: 'Consultations du mois',
      value: 612,
      trend: '+4%',
      trendType: 'up',
      icon: 'bi-clipboard-pulse'
    },
    {
      title: 'Rendez-vous à venir',
      value: 189,
      trend: '-3%',
      trendType: 'down',
      icon: 'bi-calendar-event'
    },
    {
      title: 'Hospitalisations en cours',
      value: 32,
      trend: '+1%',
      trendType: 'up',
      icon: 'bi-hospital'
    }
  ];

  modules = [
    {
      name: 'Patients',
      total: 1240,
      progression: '+5% ce trimestre'
    },
    {
      name: 'Consultations',
      total: 2214,
      progression: '+9% ce trimestre'
    },
    {
      name: 'Rendez-vous',
      total: 784,
      progression: '-2% ce trimestre'
    },
    {
      name: 'Hospitalisations',
      total: 96,
      progression: '+3% ce trimestre'
    }
  ];

  timeline = [
    {
      label: 'Aujourd’hui',
      description: '16 nouvelles consultations enregistrées'
    },
    {
      label: 'Hier',
      description: '8 hospitalisations clôturées'
    },
    {
      label: 'Cette semaine',
      description: '52 nouveaux dossiers patients créés'
    }
  ];
}

