import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: true,
     imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        NgbDropdownModule,  
    ],
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(private authService: AuthService) { }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logout() {
    this.authService.logout();
  }
}
