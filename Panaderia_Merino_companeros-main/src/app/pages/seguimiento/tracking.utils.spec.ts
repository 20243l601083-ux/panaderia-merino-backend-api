import { calculateTrackingProgress } from './tracking.utils';

describe('tracking utils', () => {
  it('debe devolver 0% cuando el repartidor está en el punto de inicio', () => {
    const progress = calculateTrackingProgress(
      { lat: 19.0438, lng: -98.1983 },
      { lat: 19.0438, lng: -98.1983 },
      { lat: 19.0444, lng: -98.1987 }
    );

    expect(progress).toBe(0);
  });

  it('debe devolver 100% cuando el repartidor ya llegó al destino', () => {
    const progress = calculateTrackingProgress(
      { lat: 19.0444, lng: -98.1987 },
      { lat: 19.0438, lng: -98.1983 },
      { lat: 19.0444, lng: -98.1987 }
    );

    expect(progress).toBe(100);
  });

  it('debe calcular un progreso intermedio al acercarse', () => {
    const progress = calculateTrackingProgress(
      { lat: 19.0441, lng: -98.1985 },
      { lat: 19.0438, lng: -98.1983 },
      { lat: 19.0444, lng: -98.1987 }
    );

    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });
});
