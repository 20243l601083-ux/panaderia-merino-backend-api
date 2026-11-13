import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {

  name = '';
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private nav: NavController
  ) {}

 submit() {

  this.error = '';

  this.auth.register({

    nombre: this.name.trim(),
    email: this.email.trim(),
    password: this.password,
    rol: 'cliente'

  }).subscribe({

    next: () => {
      this.auth.login({
        email: this.email.trim(),
        password: this.password
      }).subscribe({
        next: () => {
          const usuario = this.auth.getUsuario();
          if (usuario?.rol === 'cliente') {
            this.nav.navigateRoot(['/home']);
          } else {
            this.nav.navigateRoot(['/login']);
          }
        },
        error: (err: any) => {
          console.log('ERROR LOGIN POST REGISTRO:', err);
          this.error = 'Tu cuenta se creó, pero no fue posible entrar automáticamente.';
        }
      });
    },

    error: (err: any) => {
      console.log('ERROR REGISTRO:', err);
      console.log('RESPUESTA BACKEND:', err.error);

      this.error =
        err.error?.message ||
        'No fue posible registrar el usuario';
    }

  });
  }
}