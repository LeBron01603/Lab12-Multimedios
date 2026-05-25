/**
 * Global Constants for App Events to prevent hardcoding strings.
 */
export const APP_EVENTS = {
  USER_GREETING: 'user-greeting'
};

/**
 * Utility to dispatch CustomEvents bubbling and composed (crossing Shadow DOM boundaries).
 * @param {HTMLElement} element - Element that dispatches the event
 * @param {string} eventName - Name of the event
 * @param {object} detail - Detail payload
 */
export function dispatchCustomEvent(element, eventName, detail = {}) {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail
    })
  );
}
