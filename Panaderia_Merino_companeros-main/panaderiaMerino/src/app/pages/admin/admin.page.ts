import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class AdminPage implements OnInit {
  currentSection = 'dashboard';

  sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'pedidos', label: 'Pedidos', icon: '🛍️' },
    { id: 'inventario', label: 'Inventario', icon: '📦' },
    { id: 'empleados', label: 'Empleados', icon: '👔' },
    { id: 'repartidores', label: 'Repartidores', icon: '🚴' },
    { id: 'gastos', label: 'Gastos', icon: '💸' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ];

  get currentSectionLabel(): string {
    return this.sections.find(section => section.id === this.currentSection)?.label || 'Panel administrativo';
  }

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.setSectionFromUrl(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setSectionFromUrl(event.urlAfterRedirects || event.url);
      });
  }

  private setSectionFromUrl(url: string) {
    const match = url.match(/\/admin\/([^/]+)/);
    const section = match ? match[1] : 'dashboard';

    if (this.sections.some(item => item.id === section)) {
      this.currentSection = section;
    } else {
      this.currentSection = 'dashboard';
      this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
    }
  }

  logout() {
    this.auth.logout();
    this.nav.navigateRoot(['/login']);
  }

  selectSection(id: string) {
    this.currentSection = id;
    this.router.navigate([`/admin/${id}`]);
  }
}
