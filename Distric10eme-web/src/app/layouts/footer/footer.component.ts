import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: true,
       imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        NgbDropdownModule,
],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
