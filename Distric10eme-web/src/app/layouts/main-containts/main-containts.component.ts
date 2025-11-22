import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-main-containts',
    templateUrl: './main-containts.component.html',
    styleUrls: ['./main-containts.component.css'],
    standalone: true,
     imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        NgbDropdownModule,
        HeaderComponent,
        SidebarComponent,
        FooterComponent
],
})
export class MainContaintsComponent implements OnInit {
  title: string = 'Tableau de bord';
  @ViewChild(SidebarComponent) sidebarComponent?: SidebarComponent;

  constructor(private router: Router) {}

  ngOnInit() {
    // Mettre à jour le titre en fonction de la route active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });
  }

  private updateTitle() {
    const route = this.router.routerState.snapshot.root.firstChild;
    if (route?.data) {
      this.title = route.data['title'] || 'Tableau de bord';
    }
  }

  toggleSidebar() {
    const isDesktop = window.innerWidth >= 1200;
    if (isDesktop) {
      document.body.classList.toggle('toggle-sidebar');
    } else {
      this.sidebarComponent?.toggle();
    }
  }
}
