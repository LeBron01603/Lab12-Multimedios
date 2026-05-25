import { describe, it, expect } from 'vitest';
import { capitalize, formatTemperature } from '../../modules/helpers.js';
import { APP_EVENTS, dispatchCustomEvent } from '../../modules/events.js';

describe('Pruebas unitarias de helpers.js', () => {
  // Prueba de formateo de temperaturas
  it('formatTemperature("31") debe devolver "31 °C"', () => {
    expect(formatTemperature("31")).toBe("31 °C");
  });

  it('formatTemperature("31 °C") debe mantener "31 °C"', () => {
    expect(formatTemperature("31 °C")).toBe("31 °C");
  });

  it('formatTemperature("") debe devolver "-- °C"', () => {
    expect(formatTemperature("")).toBe("-- °C");
    expect(formatTemperature(null)).toBe("-- °C");
    expect(formatTemperature(undefined)).toBe("-- °C");
  });

  // Prueba de capitalización
  it('capitalize("sunny") debe devolver "Sunny"', () => {
    expect(capitalize("sunny")).toBe("Sunny");
    expect(capitalize("SUNNY")).toBe("Sunny");
    expect(capitalize("")).toBe("");
  });
});

describe('Pruebas unitarias de events.js', () => {
  // Verificar existencia de la constante del evento
  it('Debe existir la constante APP_EVENTS.USER_GREETING', () => {
    expect(APP_EVENTS.USER_GREETING).toBe('user-greeting');
  });

  // Verificar el dispatch de CustomEvent
  it('dispatchCustomEvent() debe disparar un CustomEvent con burbujeo, composición y detail correcto', () => {
    const element = document.createElement('div');
    const eventName = 'test-event';
    const detailPayload = { user: 'Alonso', timestamp: '12:00:00' };

    let capturedEvent = null;
    element.addEventListener(eventName, (e) => {
      capturedEvent = e;
    });

    dispatchCustomEvent(element, eventName, detailPayload);

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent.bubbles).toBe(true);
    expect(capturedEvent.composed).toBe(true);
    expect(capturedEvent.detail).toEqual(detailPayload);
  });
});
