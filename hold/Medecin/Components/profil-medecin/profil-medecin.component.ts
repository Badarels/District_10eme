import { Component, Input, OnInit, Output } from '@angular/core';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { Medecin } from 'src/app/shared/Model/Medecin';
import { MedecinService } from '../../Services/medecin.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataServicesService } from 'src/app/shared/Services/data-services.service';
import { Specialite } from 'src/app/shared/Model/Specialite';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MissionRoutingModule } from 'src/app/missions/mission-routing.module';
import { MissionPipe } from 'src/app/pipe/mission.pipe';

@Component({
    selector: 'app-profil-medecin',
    templateUrl: './profil-medecin.component.html',
    styleUrls: ['./profil-medecin.component.css'],
    standalone: true,
       imports: [
          MissionRoutingModule,
          CommonModule,
          ReactiveFormsModule,
          NgbDatepickerModule,
          NgbTimepickerModule,
          MatMenuModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          FormsModule,
          RouterModule,
 ],
})
export class ProfilMedecinComponent implements OnInit{
  
  medecinId: number=0;
  medecin?:Medecin;
 
  Specialite=[] as Specialite[];
  subscription= [] as Subscription[];

constructor(private route: ActivatedRoute, private medecinServices: MedecinService){}

getMedecin(){
  this.medecinServices.getMedecinById(this.medecinId)
  .subscribe((data: Medecin) => {
    this.medecin = data;
    console.log('ID Médecin récupéré dans Oninit:', this.medecin.id);
  }, (error) => console.log(error));
}

ngOnInit(): void {
  this.route.params.subscribe(params => {
      this.medecinId = +params['id']; // Convertir l'ID en nombre
      this.getMedecin();
    });
    console.log('ID Médecin récupéré dans Oninit:',this.medecinId )
  }
}
