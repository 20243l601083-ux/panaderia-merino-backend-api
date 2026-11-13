import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { calculateTrackingProgress, Coordinates } from './tracking.utils';

declare const L: any;

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterLink]
})
export class SeguimientoPage implements OnInit, AfterViewInit, OnDestroy {
  showMenu = false;
  pedidoId = '1';
  tracking: any = null;
  currentLocation: Coordinates = { lat: 19.0438, lng: -98.1983 };
  startPoint: Coordinates = { lat: 19.0438, lng: -98.1983 };
  destinationPoint: Coordinates = { lat: 19.0444, lng: -98.1987 };
  progress = 0;
  status = 'Pedido en preparación';
  isSimulating = false;
  lastUpdate = '';

  private map: any;
  private driverMarker: any;
  private destinationMarker: any;
  private routeLine: any;
  private eventSource?: EventSource;
  private simulationTimer?: number;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.loadInitialTracking();
  }

  ngAfterViewInit() {
    this.initMap();
    this.connectToTracking();
  }

  ngOnDestroy() {
    this.eventSource?.close();
    if (this.simulationTimer) {
      window.clearInterval(this.simulationTimer);
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  initMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      return;
    }

    if (typeof L !== 'undefined') {
      this.buildMap();
      return;
    }

    const existingScript = document.querySelector('script[src*="leaflet"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => this.buildMap();
      document.head.appendChild(script);
    } else {
      this.buildMap();
    }
  }

  private buildMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || typeof L === 'undefined') {
      return;
    }

    if (!this.map) {
      this.map = L.map('map').setView([this.currentLocation.lat, this.currentLocation.lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }

    this.renderTracking();
  }

  private renderTracking() {
    if (!this.map || typeof L === 'undefined') {
      return;
    }

    this.map.setView([this.currentLocation.lat, this.currentLocation.lng], 15);

    if (this.routeLine) {
      this.routeLine.remove();
    }

    if (this.driverMarker) {
      this.driverMarker.remove();
    }

    if (this.destinationMarker) {
      this.destinationMarker.remove();
    }

    this.routeLine = L.polyline(
      [
        [this.startPoint.lat, this.startPoint.lng],
        [this.destinationPoint.lat, this.destinationPoint.lng]
      ],
      { color: '#d97b4a', weight: 5, opacity: 0.65 }
    ).addTo(this.map);

    this.destinationMarker = L.circleMarker([this.destinationPoint.lat, this.destinationPoint.lng], {
      radius: 8,
      color: '#8b5a2b',
      fillColor: '#d97b4a',
      fillOpacity: 0.95
    }).addTo(this.map);

    this.driverMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], {
      title: 'Repartidor'
    }).addTo(this.map);

    this.driverMarker.bindPopup(`Repartidor: ${this.tracking?.driverName || 'Carlos López'}<br>Progreso: ${this.progress}%`).openPopup();
  }

  private loadInitialTracking() {
    this.pedidoService.getSeguimiento(this.pedidoId).subscribe({
      next: (response) => {
        const data = response?.data || response;
        this.tracking = data;
        if (data?.currentLocation) {
          this.currentLocation = data.currentLocation;
        }
        this.progress = calculateTrackingProgress(this.currentLocation, this.startPoint, this.destinationPoint);
        this.status = data?.estado || 'Pedido en preparación';
        this.lastUpdate = data?.lastUpdated || new Date().toISOString();
        this.renderTracking();
      },
      error: () => {
        this.progress = 0;
        this.status = 'Esperando ubicación';
        this.renderTracking();
      }
    });
  }

  private connectToTracking() {
    this.eventSource = this.pedidoService.getTrackingStream(this.pedidoId);
    this.eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload?.type === 'connected' || payload?.type === 'update') {
        this.applyTracking(payload.data || payload);
      }
    };

    this.eventSource.onerror = () => {
      this.status = 'Conexión en modo demostración';
    };
  }

  private applyTracking(payload: any) {
    if (!payload) {
      return;
    }

    this.tracking = payload;
    this.currentLocation = payload.currentLocation || this.currentLocation;
    this.progress = payload.progress ?? calculateTrackingProgress(this.currentLocation, this.startPoint, this.destinationPoint);
    this.status = payload.estado || 'En camino';
    this.lastUpdate = payload.lastUpdated || new Date().toISOString();
    this.renderTracking();
  }

  simularRecorrido() {
    if (this.isSimulating) {
      return;
    }

    this.isSimulating = true;
    this.status = 'Simulando recorrido';

    let step = 0;
    const totalSteps = 6;
    const deltaLat = (this.destinationPoint.lat - this.startPoint.lat) / totalSteps;
    const deltaLng = (this.destinationPoint.lng - this.startPoint.lng) / totalSteps;

    this.simulationTimer = window.setInterval(() => {
      step += 1;
      this.currentLocation = {
        lat: this.startPoint.lat + deltaLat * step,
        lng: this.startPoint.lng + deltaLng * step
      };

      this.progress = calculateTrackingProgress(this.currentLocation, this.startPoint, this.destinationPoint);
      this.status = step >= totalSteps ? 'Llegando al domicilio' : 'Repartidor en camino';
      this.renderTracking();

      this.pedidoService.actualizarUbicacion(this.pedidoId, {
        lat: this.currentLocation.lat,
        lng: this.currentLocation.lng,
        estado: this.status,
        progress: this.progress,
        driverName: 'Carlos López'
      }).subscribe();

      if (step >= totalSteps) {
        window.clearInterval(this.simulationTimer);
        this.isSimulating = false;
        this.progress = 100;
        this.status = 'Pedido entregado';
        this.currentLocation = this.destinationPoint;
        this.renderTracking();
      }
    }, 1800);
  }

  usarMiUbicacion() {
    if (!navigator.geolocation) {
      this.status = 'Tu navegador no soporta geolocalización';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.progress = calculateTrackingProgress(this.currentLocation, this.startPoint, this.destinationPoint);
        this.status = 'Ubicación actualizada';
        this.renderTracking();

        this.pedidoService.actualizarUbicacion(this.pedidoId, {
          lat: this.currentLocation.lat,
          lng: this.currentLocation.lng,
          estado: this.status,
          progress: this.progress,
          driverName: 'Carlos López'
        }).subscribe();
      },
      () => {
        this.status = 'No se pudo obtener tu ubicación';
      }
    );
  }
}
