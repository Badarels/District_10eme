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
  patientsCollapsed = true;
  rendezvousCollapsed = true;
  consultationsCollapsed = true;
  hospitalisationsCollapsed = true;
  personnelCollapsed = true;
  administrationCollapsed = true;
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

  toggleSection(section: 'patients' | 'rendezvous' | 'consultations' | 'hospitalisations' | 'personnel' | 'administration') {
    this.patientsCollapsed = section !== 'patients' ? true : !this.patientsCollapsed;
    this.rendezvousCollapsed = section !== 'rendezvous' ? true : !this.rendezvousCollapsed;
    this.consultationsCollapsed = section !== 'consultations' ? true : !this.consultationsCollapsed;
    this.hospitalisationsCollapsed = section !== 'hospitalisations' ? true : !this.hospitalisationsCollapsed;
    this.personnelCollapsed = section !== 'personnel' ? true : !this.personnelCollapsed;
    this.administrationCollapsed = section !== 'administration' ? true : !this.administrationCollapsed;
  }
}
