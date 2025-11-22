import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Employe } from 'src/app/shared/Model/Employe';
import { EmployeService } from '../../Services/employe.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormField, MatLabel, MatError, MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MissionRoutingModule } from 'src/app/missions/mission-routing.module';
@Component({
  selector: 'app-ajout-employe',
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
  templateUrl: './ajout-employe.component.html',
  styleUrls: ['./ajout-employe.component.css'],
})
export class AjoutEmployeComponent implements OnInit {

  employe!: Employe;
  subscribtion: Subscription[] = [];
  employeForm!: FormGroup;
  showDropdownMed: boolean = false;
  showDropdownCh: boolean = false;
  submitted: boolean = false;
  typeEmployeSelectionner: string = '';
  searchText: string = "";

  readonly DAYS_SHORT = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  readonly MONTHS_SHORT = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  readonly MONTHS_FULL = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  constructor(
    private employeServices: EmployeService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.employeForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      statutAnnonce : ['', Validators.required],
      salaireDeBase: [null, [Validators.required]],
      datenaissance: ['', Validators.required],
      dateEmboche: ['', Validators.required],
      lieunaissance: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      poste: ['', Validators.required],
      type: ['', Validators.required],
      sexe: ['', Validators.required],
      adresseEmploye: ['', Validators.required],
      ipres: ['', Validators.required],
      vrs: ['', Validators.required],
    });
  }

  goBack() {
    this.router.navigate(['/ListeEmploye/list-employe']);
  }

  AjouterEmploye() {
    if (this.employeForm.valid) {
      const formData = this.employeForm.value;
      this.typeEmployeSelectionner = formData.type;
      console.log('TypeEmployeSelectionner:', this.typeEmployeSelectionner);

      const nouveauEmploye: Employe = {
        id: undefined,
        nom: formData.nom,
        prenom: formData.prenom,
        salaireDeBase: formData.salaireDeBase,
        datenaissance: formData.datenaissance,
        dateEmboche: formData.dateEmboche,
        lieunaissance: formData.lieunaissance,
        email: formData.email,
        telephone: formData.telephone,
        poste: formData.poste,
        type: formData.type,
        sexe: formData.sexe,
        adresseEmploye: formData.adresseEmploye,
        ipres: formData.ipres,
        vrs: formData.vrs,
      };

      console.log(nouveauEmploye);

      this.subscribtion.push(
        this.employeServices.ajoutEmploye(nouveauEmploye).subscribe({
          next: (addedEmploye: Employe) => {
            console.log('Ajout réussi', addedEmploye);
            this.toastService.success('Employé ajouté avec succès');
            this.employeForm.reset();
          },
          error: (err) => console.error('Erreur lors de l\'ajout', err)
        })
      );
    }
  }
}
