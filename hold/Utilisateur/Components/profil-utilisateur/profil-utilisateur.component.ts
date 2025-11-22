import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { UtilisateurService } from '../../Services/utilisateur.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-profil-utilisateur',
    templateUrl: './profil-utilisateur.component.html',
    styleUrls: ['./profil-utilisateur.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterModule,
      FormsModule,
      ToastrModule,
      NgbDropdownModule,
      SharedModule,
    ]
})
export class ProfilUtilisateurComponent {

  utilisateur?: UtilisateurModel;
  subcription= [] as  Subscription[];
  userId:number=0;
 
  constructor(private utilisateurservices: UtilisateurService , private route:  ActivatedRoute){}
 
  ngOnInit(): void {
   this.route.params.subscribe(params => {
       this.userId = +params['id']; // Convertir l'ID en nombre
       this.getusersById();
     });
     console.log('ID Utlisateur récupéré dans Oninit:',this.userId)
   }
 
   getusersById(){
     this.utilisateurservices.getUserById(this.userId).subscribe(
         (data: UtilisateurModel)=>{
           this.utilisateur=data;
         },
         (error)=>{
           console.log("Erreur lors de la récupération de l\' utlisateur", error)
         }
         );
     }
    
  }
 
 
