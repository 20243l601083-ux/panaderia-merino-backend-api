import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-exito',
  templateUrl: './exito.page.html',
  styleUrls: ['./exito.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    RouterLink,
    CurrencyPipe
  ]
})
export class ExitoPage {
  total: number = 0;
  customerName = '';
  showMenu = false;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.total = Number(params['total']) || 0;
      this.customerName = params['name'] || '';
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }
}
