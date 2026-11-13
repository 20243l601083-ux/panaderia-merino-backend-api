import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {


  email = '';
  password = '';
  error = '';



  constructor(
    private auth: AuthService,
    private nav: NavController
  ) {}



  submit() {


    this.error = '';



    this.auth.login({

      email: this.email.trim(),

      password: this.password

    })
    .subscribe({


      next: (resp) => {


        console.log(
          'LOGIN CORRECTO',
          resp
        );


        const usuario = this.auth.getUsuario();


        // 👇 Ver qué usuario y rol está guardando
        console.log(
          'USUARIO GUARDADO:',
          usuario
        );



        if(usuario?.rol === 'admin'){


          console.log('ENTRANDO COMO ADMIN');


          this.nav.navigateRoot(['/admin']);


        }
        else if(usuario?.rol === 'cliente'){


          console.log('ENTRANDO COMO CLIENTE');


          this.nav.navigateRoot(['/home']);


        }
        else if(usuario?.rol === 'repartidor'){


          console.log('ENTRANDO COMO REPARTIDOR');


          this.nav.navigateRoot(['/repartidor']);


        }
        else {


          console.log('ROL NO ENCONTRADO');


          this.error = 'El usuario no tiene un rol válido';


        }


      },


      error: (err) => {


        console.log(
          'ERROR LOGIN',
          err
        );


        this.error =
        'Usuario o contraseña incorrectos';


      }


    });


  }



  goRegister() {


    this.nav.navigateForward(['/register']);


  }


}