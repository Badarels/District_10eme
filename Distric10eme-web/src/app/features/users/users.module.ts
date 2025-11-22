import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { UsersRoutingModule } from './users-routing.module';
import { ListeUserComponent } from './liste-user/liste-user.component';
import { AjoutUserComponent } from './ajout-user/ajout-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule,
    UsersRoutingModule,
    ListeUserComponent,
    AjoutUserComponent
  ]
})
export class UsersModule { }

