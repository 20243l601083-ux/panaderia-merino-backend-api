import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink]
})
export class ContactoPage implements OnInit {
  showMenu = false;
  cartItems: string[] = [];
  name = '';
  email = '';
  message = '';
  submitted = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  submitMessage() {
    if (!this.name || !this.email || !this.message) {
      return;
    }

    this.submitted = true;
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
