import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InventarioFormComponent {
  @Input() isEdit = false;
  @Input() item: any;

  formData = {
    name: '',
    quantity: 0,
    stored: new Date().toISOString().split('T')[0],
    price: 0
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.isEdit && this.item) {
      this.formData = {
        name: this.item.name,
        quantity: this.item.quantity,
        stored: this.item.stored,
        price: this.item.price
      };
    }
  }

  save() {
    this.modalCtrl.dismiss(this.formData);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
