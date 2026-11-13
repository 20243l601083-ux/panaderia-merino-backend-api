import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.page.html',
  styleUrls: ['./historial-pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistorialPedidosPage {
  summary = [
    { label: 'Pedidos cerrados', value: '340', hint: 'Últimos 30 días' },
    { label: 'Promedio', value: '$142', hint: 'Por pedido' },
    { label: 'Reembolso', value: '2', hint: 'Solicitudes' }
  ];

  history = [
    { id: '3201', client: 'Marta Gómez', detail: 'Pagado', value: 'Hoy' },
    { id: '3202', client: 'Carlos Rojas', detail: 'Entregado', value: 'Ayer' },
    { id: '3203', client: 'Ana Pérez', detail: 'Pendiente', value: '3 días' }
  ];

  highlights = [
    { label: 'Tasa de éxito', value: '96%' },
    { label: 'Tickets activos', value: '4' },
    { label: 'Promoción', value: '2x1' }
  ];

  openQuickAction() {
    console.log('Nueva acción desde Historial');
  }
}
