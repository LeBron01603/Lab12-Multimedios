// Import and register all Web Components
import './components/user-dashboard.js';
import './components/user-card.js';
import './components/weather-time.js';
import './components/warning-badge.js';

// Import helpers and events to showcase module integration
import { formatTemperature, getCurrentTimeFormatted } from './modules/helpers.js';
import { APP_EVENTS } from './modules/events.js';

console.group('[app.js] JavaScript Modules cargados');
console.log('Componentes registrados: user-dashboard, user-card, weather-time, warning-badge');
console.log('Helpers cargados: formatTemperature, getCurrentTimeFormatted');
console.log('Eventos configurados:', APP_EVENTS);
console.groupEnd();

// Interactive controls for testing the components' reactivity and properties
document.addEventListener('DOMContentLoaded', () => {
  const weatherComp = document.querySelector('weather-time');
  const warningComp = document.querySelector('warning-badge');

  // Control elements
  const cityInput = document.getElementById('ctrl-city');
  const tempInput = document.getElementById('ctrl-temp');
  const weatherSelect = document.getElementById('ctrl-weather');
  const pulseToggle = document.getElementById('ctrl-pulse');

  // Bind city attribute updates
  if (cityInput && weatherComp) {
    cityInput.addEventListener('input', (e) => {
      weatherComp.setAttribute('city', e.target.value);
    });
  }

  // Bind temperature attribute updates
  if (tempInput && weatherComp) {
    tempInput.addEventListener('input', (e) => {
      weatherComp.setAttribute('temperature', e.target.value);
    });
  }

  // Bind weather attribute updates
  if (weatherSelect && weatherComp) {
    weatherSelect.addEventListener('change', (e) => {
      weatherComp.setAttribute('weather', e.target.value);
    });
  }

  // Bind pulsing manual toggle
  if (pulseToggle && warningComp) {
    pulseToggle.checked = warningComp.hasAttribute('pulsing');
    
    pulseToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        warningComp.setAttribute('pulsing', '');
      } else {
        warningComp.removeAttribute('pulsing');
      }
    });

    // React to attribute mutations on warning-badge to sync checkbox state (e.g. when triggered by user-card event)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'pulsing') {
          pulseToggle.checked = warningComp.hasAttribute('pulsing');
        }
      });
    });
    observer.observe(warningComp, { attributes: true });
  }
});
