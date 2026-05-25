class WarningBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--font-main, sans-serif);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background-color: var(--warning-bg, #fee2e2);
          border: var(--warning-border, 1px solid #fecaca);
          color: var(--warning-text, #991b1b);
          border-radius: var(--radius-sm, 10px);
          font-weight: 600;
          font-size: 0.9rem;
          transition: var(--transition-smooth, all 0.3s ease);
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: var(--warning-text, #991b1b);
          border-radius: 50%;
          display: inline-block;
          transition: var(--transition-smooth, all 0.3s ease);
        }
        :host([pulsing]) .badge {
          animation: pulse 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        :host([pulsing]) .dot {
          animation: dot-pulse 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 var(--warning-pulse-shadow, rgba(239, 68, 68, 0.4));
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 15px 5px var(--warning-pulse-shadow, rgba(239, 68, 68, 0.4));
          }
        }
        @keyframes dot-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
        }
      </style>
      <div part="badge" class="badge">
        <span class="dot"></span>
        <slot>Sesión por expirar</slot>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['pulsing'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'pulsing') {
      const isPulsing = newValue !== null;
      // Emit details to console or trigger events if needed for debugging
      console.log(`[warning-badge] pulsing attribute changed: ${isPulsing}`);
    }
  }

  // Define property getters/setters for programmatic access
  get pulsing() {
    return this.hasAttribute('pulsing');
  }

  set pulsing(value) {
    if (value) {
      this.setAttribute('pulsing', '');
    } else {
      this.removeAttribute('pulsing');
    }
  }
}

customElements.define('warning-badge', WarningBadge);
export default WarningBadge;
