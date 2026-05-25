import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../components/user-dashboard.js';
import '../../components/user-card.js';
import '../../components/warning-badge.js';
import '../../components/weather-time.js';

describe('Prueba de Integración Principal <user-dashboard>', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('Verifica el flujo completo: user-card → evento → user-dashboard → warning-badge y toast', async () => {
    // 1. Crear dinámicamente un user-dashboard
    const dashboard = document.createElement('user-dashboard');

    // 2. Crear componentes internos
    const userCard = document.createElement('user-card');
    const weatherTime = document.createElement('weather-time');
    const warningBadge = document.createElement('warning-badge');

    // Agregar componentes dentro de user-dashboard
    dashboard.appendChild(userCard);
    dashboard.appendChild(weatherTime);
    dashboard.appendChild(warningBadge);

    // Agregar todo al DOM
    container.appendChild(dashboard);

    // Esperar a que se monte e inicialice
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Verificar que warning-badge inicialmente NO tiene pulsing
    expect(warningBadge.hasAttribute('pulsing')).toBe(false);

    // 3. Simular click en el botón de user-card
    const greetBtn = userCard.shadowRoot.getElementById('greet-btn');
    expect(greetBtn).not.toBeNull();
    greetBtn.click();

    // 4. Verificar que user-dashboard capturó el evento y modificó warning-badge (parent-to-child communication)
    expect(warningBadge.hasAttribute('pulsing')).toBe(true);

    // 5. Verificar que se mostró el toast correcto
    const toast = dashboard.shadowRoot.getElementById('toast');
    const toastText = dashboard.shadowRoot.getElementById('toast-text');
    
    expect(toast.classList.contains('show')).toBe(true);
    expect(toastText.textContent).toContain('Alonso saludó. ¡Sesión reactivada (pulsing)!');
  });
});
