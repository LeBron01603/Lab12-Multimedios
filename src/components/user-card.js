import { APP_EVENTS, dispatchCustomEvent } from '../modules/events.js';

class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-main, sans-serif);
        }
        .card {
          background: var(--card-bg, rgba(255, 255, 255, 0.85));
          border: var(--card-border, 1px solid rgba(255, 255, 255, 0.5));
          border-radius: var(--radius-md, 16px);
          padding: 20px;
          box-shadow: var(--card-shadow, 0 10px 25px rgba(124, 58, 237, 0.08));
          display: flex;
          align-items: center;
          gap: 20px;
          min-width: 300px;
          transition: var(--transition-smooth, all 0.3s ease);
        }
        .avatar-container {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color, #7c3aed), #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.4rem;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(124, 58, 237, 0.15);
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-grow: 1;
        }
        .name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main, #1e1b4b);
        }
        .role {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted, #5b586e);
          background: var(--primary-light, #f5f3ff);
          padding: 2px 8px;
          border-radius: 12px;
          align-self: flex-start;
          border: 1px solid rgba(124, 58, 237, 0.1);
        }
        .btn-saludar {
          background: var(--primary-color, #7c3aed);
          color: white;
          border: none;
          border-radius: var(--radius-sm, 10px);
          padding: 10px 18px;
          font-family: var(--font-main, sans-serif);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth, all 0.3s ease);
          box-shadow: 0 4px 10px rgba(124, 58, 237, 0.2);
        }
        .btn-saludar:hover {
          background: var(--primary-hover, #6d28d9);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(124, 58, 237, 0.3);
        }
        .btn-saludar:active {
          transform: translateY(0);
        }
        /* Hidden default slot to consume raw light DOM text without disrupting the visual structure */
        .hidden-slot-container {
          display: none;
        }
      </style>
      <div part="card" class="card">
        <div part="avatar" class="avatar-container">
          <slot name="avatar">A</slot>
        </div>
        <div class="user-info">
          <div part="name" class="name">
            <slot name="name">Alonso</slot>
          </div>
          <div part="role" class="role">
            <slot name="role">Profesor</slot>
          </div>
        </div>
        <button part="button" class="btn-saludar" id="greet-btn">
          <slot name="button-text">Saludar</slot>
        </button>
      </div>
      <div class="hidden-slot-container">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    const button = this.shadowRoot.getElementById('greet-btn');
    button.addEventListener('click', () => {
      // Disparar CustomEvent burbujeante y compuesto usando helper modular
      dispatchCustomEvent(this, APP_EVENTS.USER_GREETING, {
        name: this._getUserName(),
        timestamp: new Date().toLocaleTimeString()
      });
    });
  }

  _getUserName() {
    // Check if there is assigned content in the 'name' slot
    const nameSlot = this.shadowRoot.querySelector('slot[name="name"]');
    if (nameSlot) {
      const nodes = nameSlot.assignedNodes();
      if (nodes.length > 0) {
        return nodes[0].textContent.trim();
      }
    }
    return 'Alonso';
  }
}

customElements.define('user-card', UserCard);
export default UserCard;
