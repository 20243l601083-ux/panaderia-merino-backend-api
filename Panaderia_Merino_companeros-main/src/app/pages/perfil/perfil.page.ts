import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  NavController

} from '@ionic/angular/standalone';


import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';



@Component({

  selector:'app-perfil',

  templateUrl:'./perfil.page.html',

  styleUrls:['./perfil.page.scss'],

  standalone:true,


  imports:[

    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,

    CommonModule,
    FormsModule,
    RouterLink

  ]

})


export class PerfilPage implements OnInit {



showMenu=false;



firstName='';
lastName='';
email='';

phone='';
municipality='';
neighborhood='';
address='';



cardAlias='Mi tarjeta';

cardNumber='4111 1111 1111 1111';

cvc='123';

expiry='12/28';


hidePayment=true;


saveMessage='';


constructor(


private cartService:CartService,


private authService:AuthService,


private usuarioService:UsuarioService,


private nav:NavController


){}

ngOnInit(){

this.cargarPerfil();

}

get cartCount(){

return this.cartService.totalItems;

}

toggleMenu(){

this.showMenu=!this.showMenu;

}

closeMenu(){

this.showMenu=false;

}

private cargarPerfil(){


const usuario =
this.authService.getUsuario();



if(!usuario){

return;

}

const partes =
(usuario.nombre || '').split(' ');



this.firstName =
partes[0] || '';



this.lastName =
partes.slice(1).join(' ');



this.email =
usuario.email || '';

}

saveProfile(){


const usuario =
this.authService.getUsuario();


if(!usuario?.id_usuario){


this.saveMessage=
'Inicia sesión para guardar tus datos.';


return;

}

const nombre =
`${this.firstName.trim()} ${this.lastName.trim()}`.trim();

const payload={


nombre,


email:
this.email.trim() || usuario.email


};

this.usuarioService
.actualizarUsuario(
usuario.id_usuario,
payload
)

.subscribe({



next:()=>{


const actualizado={

...usuario,

nombre,

email:payload.email

};

localStorage.setItem(

'usuario',

JSON.stringify(actualizado)

);

this.saveMessage=
'Tus datos se guardaron correctamente.';

setTimeout(()=>{


this.saveMessage='';


},3000);


},

error:(err)=>{


this.saveMessage=

err?.error?.message ||

'No fue posible guardar tus datos.';


}

});

}

toggleHidePayment(){

this.hidePayment=!this.hidePayment;

}

get maskedCardNumber(){

return this.hidePayment

?
'•••• •••• •••• ••••'

:
this.cardNumber;

}

get maskedCvc(){

return this.hidePayment

?
'•••'

:
this.cvc;

}

get maskedExpiry(){

return this.hidePayment

?
'••/••'

:
this.expiry;


}

// CERRAR SESIÓN

logout(){

this.authService.logout();

this.nav.navigateRoot('/login');

}

}