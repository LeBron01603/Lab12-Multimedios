import { APP_EVENTS } from '../modules/events.js';

class UserDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          font-family: var(--font-main, sans-serif);
        }
        .dashboard {
          background: linear-gradient(135deg, #e0dbec 0%, #f3e8ff 50%, #fae8ff 100%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: var(--radius-lg, 24px);
          padding: 32px;
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.12);
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth, all 0.3s ease);
        }
        .dashboard::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 80%);
          pointer-events: none;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .header {
          border-bottom: 2px solid rgba(124, 58, 237, 0.08);
          padding-bottom: 16px;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main, #1e1b4b);
          margin-bottom: 4px;
        }
        .subtitle {
          font-size: 0.85rem;
          color: var(--text-muted, #5b586e);
        }
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .badge-container {
          grid-column: 1 / 3;
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }
        
        /* Layout slotted selectors */
        ::slotted(user-card) {
          grid-column: 1 / 2;
        }
        ::slotted(weather-time) {
          grid-column: 2 / 3;
        }
        ::slotted(warning-badge) {
          grid-column: 1 / 3;
          justify-self: center;
        }

        /* Toast Alert Notification */
        .toast {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(30, 27, 75, 0.95);
          color: white;
          padding: 12px 24px;
          border-radius: var(--radius-sm, 10px);
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transform: translateY(100px);
          opacity: 0;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
          pointer-events: none;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }
        .toast-icon {
          color: #10b981; /* Emerald-500 */
          font-weight: bold;
        }

        /* Responsive Layout */
        @media (max-width: 768px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          ::slotted(user-card),
          ::slotted(weather-time),
          ::slotted(warning-badge) {
            grid-column: 1 / -1;
            justify-self: stretch;
          }
          ::slotted(warning-badge) {
            justify-self: center;
          }
        }
      </style>
      <div class="dashboard">
        <div class="content">
          <div class="header">
            <h2 class="title">Dashboard Universitario</h2>
            <p class="subtitle">Estructura interactiva basada en componentes Web encapsulados</p>
          </div>
          <div class="grid-layout">
            <slot></slot>
          </div>
        </div>
        <div id="toast" class="toast">
          <span class="toast-icon">✓</span>
          <span id="toast-text"></span>
        </div>
      </div>
    `;
    this._timeoutId = null;
  }

  connectedCallback() {
    // Listen for the custom event bubbling up from user-card
    this.addEventListener(APP_EVENTS.USER_GREETING, (event) => {
      console.log('[user-dashboard] CustomEvent "user-greeting" captured! Detail:', event.detail);
      
      const badge = this.querySelector('warning-badge');
      if (badge) {
        // Activate pulsing attribute on warning-badge (parent-to-child communication)
        badge.setAttribute('pulsing', '');
        
        // Show interactive toast
        this._showToast(`Profesor ${event.detail.name} saludó. ¡Sesión reactivada (pulsing)!`);
        
        // Stop pulsing after 5 seconds to demonstrate reactivity
        if (this._timeoutId) {
          clearTimeout(this._timeoutId);
        }
        this._timeoutId = setTimeout(() => {
          badge.removeAttribute('pulsing');
          console.log('[user-dashboard] pulsing attribute removed from warning-badge.');
        }, 5000);
      }
    });
  }

  disconnectedCallback() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
  }

  _showToast(message) {
    const toast = this.shadowRoot.getElementById('toast');
    const toastText = this.shadowRoot.getElementById('toast-text');
    if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }
}

customElements.define('user-dashboard', UserDashboard);
export default UserDashboard;
