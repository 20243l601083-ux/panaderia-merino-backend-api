import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados-form',
  templateUrl: './empleados-form.component.html',
  styleUrls: ['./empleados-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmpleadosFormComponent {
  @Input() isEdit = false;
  @Input() empleado: any;

  formData = { name: '', role: '' };

  roles = [
    'Gerente de tienda',
    'Panadero',
    'Ayudante de panadería',
    'Atención al cliente',
    'Repartidor',
    'Limpieza'
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.isEdit && this.empleado) {
      this.formData = { ...this.empleado };
    }
  }

  save() {
    this.modalCtrl.dismiss(this.formData);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
