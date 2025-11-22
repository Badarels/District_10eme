import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: true,
       imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        NgbDropdownModule,
        NgbCollapseModule,
],
})
export class SidebarComponent {
  isMobile = window.innerWidth < 1200;
  isCollapsed = false;
  usersCollapsed = true;
  clientsCollapsed = true;
  missionsCollapsed = true;
  personnelCollapsed = true;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 1200;
    if (!this.isMobile) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      sidebar?.classList.remove('show');
      this.isCollapsed = false;
    }
  }

  toggle() {
    if (this.isMobile) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      sidebar.classList.toggle('show');
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleSection(section: 'users' | 'clients' | 'missions' | 'personnel') {
    this.usersCollapsed = section !== 'users' ? true : !this.usersCollapsed;
    this.clientsCollapsed = section !== 'clients' ? true : !this.clientsCollapsed;
    this.missionsCollapsed = section !== 'missions' ? true : !this.missionsCollapsed;
    this.personnelCollapsed = section !== 'personnel' ? true : !this.personnelCollapsed;
  }
}
