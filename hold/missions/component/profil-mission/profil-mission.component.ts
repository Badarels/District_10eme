import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Missions } from 'src/app/shared/Model/Missions';
import { MissionService } from '../../services/mission.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profil-mission',
  templateUrl: './profil-mission.component.html',
  styleUrls: ['./profil-mission.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule, DatePipe]
})
export class ProfilMissionComponent implements OnInit, OnDestroy {
  mission: Missions | null = null;
  private subscriptions: Subscription = new Subscription();
  missionId: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private missionService: MissionService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe({
        next: (params) => {
          const id = +params['id'];
          if (!isNaN(id) && id > 0) {
            this.missionId = id;
            this.getMissionById();
          } else {
            this.error = 'ID de mission invalide';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.error = 'Erreur lors de la récupération de l\'ID de la mission';
          this.isLoading = false;
          console.error('Erreur params:', err);
        }
      })
    );
  }

  getMissionById(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscriptions.add(
      this.missionService.getMissionById(this.missionId).subscribe({
        next: (data: Missions) => {
          this.mission = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement de la mission';
          this.isLoading = false;
          console.error('Erreur getMissionById:', err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
