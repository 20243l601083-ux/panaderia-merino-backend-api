import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    const current = this.router.url || '/';

    if (current === '/') {
      this.router.navigateByUrl('/login');
    }
  }
}
