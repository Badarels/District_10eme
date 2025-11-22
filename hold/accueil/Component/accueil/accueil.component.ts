import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MedecinService } from 'src/app/Medecin/Services/medecin.service';
import { CentreHospitalierService } from 'src/app/centreHospitalier/Services/centre-hospitalier.service';
import { MissionService } from 'src/app/missions/services/mission.service';
import { CentreHospitalier } from 'src/app/shared/Model/CentreHospitalier';
import { Medecin } from 'src/app/shared/Model/Medecin';
import { Missions } from 'src/app/shared/Model/Missions';
import { error } from 'toastr';

@Component({
    selector: 'app-accueil',
    templateUrl: './accueil.component.html',
    styleUrl: './accueil.component.css',
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,  
      HttpClientModule
    ]
})
export class AccueilComponent {

  mission!: Missions[];
  subscription: Subscription[] = [];
  ch!:CentreHospitalier[];
  medecin!:Medecin[];
  totalMedecin: number=0;
  totalMission: number=0;
  totalCh:number=0;
  constructor(private medecinservices: MedecinService,private MissionServices: MissionService, private centreHospilierServices: CentreHospitalierService){

  }

  ngOnInit(): void {
    this.getMissions();
    this.getCh();
    this.getMedecin();
  }

  getMissions(){
    this.subscription.push(
      this.MissionServices.getMissions().subscribe(
        (data:Missions[])=>{
          this.mission=data.filter(miss=> miss.archived==0);
          this.totalMission = this.countElements(this.mission.filter(mis => mis.archived == 0))
        },
        (error)=>{
          console.log('Erreur lors de la récuperation des Missions',error);
        }
      )
    )
  }

  getCh(){
    this.subscription.push(
      this.centreHospilierServices.getCh().subscribe(
        (data:CentreHospitalier[])=>{
          this.ch=data;
          this.totalCh = this.countElements(this.ch.filter(ch => ch.archived == 0))
        },
        (error)=>{
          console.log('Erreur lors de la récuperation des Ch',error);
        }
      )
    )
  }

  getMedecin(){
    this.subscription.push(
      this.medecinservices.getMedecin().subscribe(
        (data:Medecin[])=>{
          this.medecin=data;
          //this.totalMedecin = this.countElements(this.medecin.filter(m => m.archived == 0));
          this.totalMedecin=this.countElements(data);
        },
        (error)=>{
          console.log('Erreur lors de la récuperation des Ch',error);
        }
      )
    )
  }

 countElements<T>(list: T[]): number {
    return list.length;
  }
  

}
