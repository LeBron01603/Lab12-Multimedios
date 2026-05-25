import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../../components/user-card.js';
import '../../components/warning-badge.js';
import '../../components/weather-time.js';

describe('Pruebas del Web Component <user-card>', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('Verificar que el custom element user-card está registrado', () => {
    expect(customElements.get('user-card')).toBeDefined();
  });

  it('Verificar que usa Shadow DOM', () => {
    const userCard = document.createElement('user-card');
    container.appendChild(userCard);
    expect(userCard.shadowRoot).not.toBeNull();
    expect(userCard.shadowRoot.mode).toBe('open');
  });

  it('Verificar que renderiza el botón "Saludar"', () => {
    const userCard = document.createElement('user-card');
    container.appendChild(userCard);
    const button = userCard.shadowRoot.getElementById('greet-btn');
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toContain('Saludar');
  });

  it('Simular click en el botón y comprobar que dispara el evento "user-greeting" con name y timestamp', async () => {
    const userCard = document.createElement('user-card');
    container.appendChild(userCard);

    let eventDispatched = null;
    userCard.addEventListener('user-greeting', (e) => {
      eventDispatched = e;
    });

    const button = userCard.shadowRoot.getElementById('greet-btn');
    button.click();

    expect(eventDispatched).not.toBeNull();
    expect(eventDispatched.detail).toBeDefined();
    // Al no slottear nada en JSDOM/HappyDOM de forma síncrona en el test, debe caer en el fallback name "Alonso"
    expect(eventDispatched.detail.name).toBe('Alonso');
    expect(eventDispatched.detail.timestamp).toBeDefined();
    expect(typeof eventDispatched.detail.timestamp).toBe('string');
  });

  it('Simular click en el botón con contenido slotteado para el name y verificar detail.name', async () => {
    const userCard = document.createElement('user-card');
    // Creamos un slot name
    const nameSpan = document.createElement('span');
    nameSpan.setAttribute('slot', 'name');
    nameSpan.textContent = 'Profesor Alonso';
    userCard.appendChild(nameSpan);
    container.appendChild(userCard);

    // Esperar un tick para que Happy DOM resuelva slots
    await new Promise((resolve) => setTimeout(resolve, 0));

    let eventDispatched = null;
    userCard.addEventListener('user-greeting', (e) => {
      eventDispatched = e;
    });

    const button = userCard.shadowRoot.getElementById('greet-btn');
    button.click();

    expect(eventDispatched).not.toBeNull();
    expect(eventDispatched.detail.name).toBe('Profesor Alonso');
  });
});

describe('Pruebas del Web Component <warning-badge>', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('Verificar que warning-badge está registrado', () => {
    expect(customElements.get('warning-badge')).toBeDefined();
  });

  it('Verificar que el atributo pulsing es reactivo mediante propiedades y atributos', () => {
    const warningBadge = document.createElement('warning-badge');
    container.appendChild(warningBadge);

    // Inicialmente no debe estar pulsando si no se le define el atributo
    expect(warningBadge.pulsing).toBe(false);
    expect(warningBadge.hasAttribute('pulsing')).toBe(false);

    // Activamos pulsing mediante propiedad
    warningBadge.pulsing = true;
    expect(warningBadge.hasAttribute('pulsing')).toBe(true);
    expect(warningBadge.pulsing).toBe(true);

    // Desactivamos pulsing mediante propiedad
    warningBadge.pulsing = false;
    expect(warningBadge.hasAttribute('pulsing')).toBe(false);
    expect(warningBadge.pulsing).toBe(false);

    // Activamos pulsing mediante atributo
    warningBadge.setAttribute('pulsing', '');
    expect(warningBadge.pulsing).toBe(true);

    // Removemos el atributo
    warningBadge.removeAttribute('pulsing');
    expect(warningBadge.pulsing).toBe(false);
  });
});

describe('Pruebas del Web Component <weather-time>', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('Verificar que renderiza ciudad, temperatura y clima por defecto', () => {
    const weatherTime = document.createElement('weather-time');
    container.appendChild(weatherTime);

    const cityEl = weatherTime.shadowRoot.getElementById('city');
    const tempEl = weatherTime.shadowRoot.getElementById('temp');
    const statusEl = weatherTime.shadowRoot.getElementById('weather-status');

    expect(cityEl.textContent.trim()).toBe('Liberia');
    expect(tempEl.textContent.trim()).toBe('31 °C');
    expect(statusEl.textContent.trim()).toBe('Sunny');
  });

  it('Cambiar atributos city, temperature y weather, y comprobar que el contenido se actualiza', () => {
    const weatherTime = document.createElement('weather-time');
    container.appendChild(weatherTime);

    weatherTime.setAttribute('city', 'San José');
    weatherTime.setAttribute('temperature', '24');
    weatherTime.setAttribute('weather', 'Rainy');

    const cityEl = weatherTime.shadowRoot.getElementById('city');
    const tempEl = weatherTime.shadowRoot.getElementById('temp');
    const statusEl = weatherTime.shadowRoot.getElementById('weather-status');
    const iconEl = weatherTime.shadowRoot.getElementById('weather-icon');

    expect(cityEl.textContent.trim()).toBe('San José');
    expect(tempEl.textContent.trim()).toBe('24 °C'); // formatTemperature agrega el ' °C'
    expect(statusEl.textContent.trim()).toBe('Rainy');
    expect(iconEl.textContent.trim()).toBe('🌧️');
  });

  it('Comprobar que limpia su intervalo en disconnectedCallback() para evitar listeners o procesos huérfanos', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const weatherTime = document.createElement('weather-time');
    
    container.appendChild(weatherTime);
    const timerId = weatherTime._timer;
    expect(timerId).toBeDefined();

    // Desconectar el componente
    weatherTime.remove();

    expect(clearIntervalSpy).toHaveBeenCalledWith(timerId);
    clearIntervalSpy.mockRestore();
  });
});
