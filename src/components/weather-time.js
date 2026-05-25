import { formatTemperature, getCurrentTimeFormatted } from '../modules/helpers.js';

class WeatherTime extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-main, sans-serif);
        }
        .widget {
          background: var(--weather-bg, rgba(255, 255, 255, 0.85));
          border: var(--card-border, 1px solid rgba(255, 255, 255, 0.5));
          border-radius: var(--radius-md, 16px);
          padding: 20px;
          box-shadow: var(--card-shadow, 0 10px 25px rgba(124, 58, 237, 0.08));
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 240px;
          transition: var(--transition-smooth, all 0.3s ease);
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .city-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main, #1e1b4b);
        }
        .weather-icon-wrapper {
          font-size: 1.8rem;
          line-height: 1;
        }
        .temp-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .temperature {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--primary-color, #7c3aed);
        }
        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 12px;
          font-size: 0.85rem;
          color: var(--text-muted, #5b586e);
        }
        .status {
          font-weight: 600;
          text-transform: capitalize;
          color: var(--primary-color, #7c3aed);
        }
        .time {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          background: var(--primary-light, #f5f3ff);
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid rgba(124, 58, 237, 0.1);
        }
      </style>
      <div part="widget" class="widget">
        <div class="header">
          <div part="city" id="city" class="city-name">Liberia</div>
          <div part="icon" id="weather-icon" class="weather-icon-wrapper">☀️</div>
        </div>
        <div class="temp-row">
          <div part="temperature" id="temp" class="temperature">31 °C</div>
        </div>
        <div class="info-row">
          <span part="status" id="weather-status" class="status">Sunny</span>
          <span part="time" id="local-time" class="time">--:--:--</span>
        </div>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['city', 'temperature', 'weather'];
  }

  connectedCallback() {
    this._updateContent();
    this._startClock();
  }

  disconnectedCallback() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._updateContent();
    }
  }

  _updateContent() {
    const cityEl = this.shadowRoot.getElementById('city');
    const tempEl = this.shadowRoot.getElementById('temp');
    const statusEl = this.shadowRoot.getElementById('weather-status');
    const iconEl = this.shadowRoot.getElementById('weather-icon');

    const city = this.getAttribute('city') || 'Liberia';
    const temp = formatTemperature(this.getAttribute('temperature') || '31 °C');
    const weather = this.getAttribute('weather') || 'Sunny';

    if (cityEl) cityEl.textContent = city;
    if (tempEl) tempEl.textContent = temp;
    if (statusEl) statusEl.textContent = weather;
    
    if (iconEl) {
      const lower = weather.toLowerCase();
      if (lower.includes('sun') || lower.includes('clear') || lower.includes('sol') || lower.includes('despejado')) {
        iconEl.textContent = '☀️';
      } else if (lower.includes('rain') || lower.includes('lluv') || lower.includes('drizzle')) {
        iconEl.textContent = '🌧️';
      } else if (lower.includes('cloud') || lower.includes('nub') || lower.includes('overcast')) {
        iconEl.textContent = '☁️';
      } else if (lower.includes('snow') || lower.includes('niev')) {
        iconEl.textContent = '❄️';
      } else if (lower.includes('wind') || lower.includes('vient')) {
        iconEl.textContent = '💨';
      } else if (lower.includes('thunder') || lower.includes('torment')) {
        iconEl.textContent = '⚡';
      } else {
        iconEl.textContent = '🌤️';
      }
    }
  }

  _startClock() {
    const updateTime = () => {
      const timeEl = this.shadowRoot.getElementById('local-time');
      if (timeEl) {
        timeEl.textContent = getCurrentTimeFormatted();
      }
    };
    updateTime();
    this._timer = setInterval(updateTime, 1000);
  }

  get city() {
    return this.getAttribute('city') || 'Liberia';
  }

  set city(val) {
    this.setAttribute('city', val);
  }

  get temperature() {
    return this.getAttribute('temperature') || '31 °C';
  }

  set temperature(val) {
    this.setAttribute('temperature', val);
  }

  get weather() {
    return this.getAttribute('weather') || 'Sunny';
  }

  set weather(val) {
    this.setAttribute('weather', val);
  }
}

customElements.define('weather-time', WeatherTime);
export default WeatherTime;
