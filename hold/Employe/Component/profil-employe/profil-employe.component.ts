import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employe } from 'src/app/shared/Model/Employe';
import { EmployeService } from '../../Services/employe.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    selector: 'app-profil-employe',
    templateUrl: './profil-employe.component.html',
    styleUrl: './profil-employe.component.css',
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
    RouterModule
],

})
export class ProfilEmployeComponent {
  employe?: Employe;
  subcription= [] as  Subscription[];
  employeId:number=0;
 
  constructor(private employeservices: EmployeService , private route:  ActivatedRoute){}
 
  ngOnInit(): void {
   this.route.params.subscribe(params => {
       this.employeId = +params['id']; // Convertir l'ID en nombre
       this.getemployeById();
     });
     console.log('ID Utlisateur récupéré dans Oninit:',this.employeId)
   }
 
   getemployeById(){
     this.employeservices.getEmpById(this.employeId).subscribe(
         (data: Employe)=>{
           this.employe=data;
         },
         (error)=>{
           console.log("Erreur lors de la récupération de l\' employé", error)
         }
         );
     }
    
  }
 

