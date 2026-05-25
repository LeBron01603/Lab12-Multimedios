# Laboratorio 12: Testing con Vitest y Web Components

Este laboratorio demuestra cómo replicar una estructura modular de Web Components nativos (Shadow DOM, slots, CSS variables, CSS Parts) y aplicar pruebas automatizadas utilizando **Vitest** y **Happy DOM** para garantizar la robustez, mantenibilidad y rendimiento del código.

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```text
Lab12-Multi/
├── src/
│   ├── components/            # Web Components encapsulados
│   │   ├── user-card.js
│   │   ├── user-dashboard.js
│   │   ├── warning-badge.js
│   │   └── weather-time.js
│   ├── modules/               # Módulos JS auxiliares
│   │   ├── events.js
│   │   └── helpers.js
│   ├── tests/                 # Pruebas automatizadas (separadas en carpetas)
│   │   ├── modules/
│   │   │   └── modules.test.js
│   │   ├── components/
│   │   │   └── components.test.js
│   │   └── integration/
│   │       └── integration.test.js
│   ├── app.js                 # Lógica de inicio y controles interactivos
│   ├── index.html             # Estructura HTML base y controles de demo
│   └── styles.css             # Estilo CSS global
├── package.json               # Configuración de dependencias y scripts
└── vite.config.js             # Configuración de Vite/Vitest
```

---

## Testing con Vitest

### 1. Qué se instaló

Se agregaron las siguientes herramientas de desarrollo:
* **`vite`**: Servidor de desarrollo ultra-rápido basado en ESM nativos.
* **`vitest`**: Framework de pruebas unitarias y de integración optimizado para Vite, extremadamente rápido y compatible con la API de Jest.
* **`happy-dom`**: Una alternativa liviana a JSDOM que simula un entorno de navegador en Node.js, ofreciendo soporte nativo rápido para Custom Elements y Shadow DOM.

### 2. Qué comandos corren las pruebas

Para instalar las dependencias y ejecutar las pruebas, se utilizan los siguientes comandos:

* **Instalación de dependencias:**
  ```bash
  pnpm install
  ```

* **Ejecutar pruebas una sola vez (CI):**
  ```bash
  pnpm test
  ```

* **Ejecutar pruebas en modo observador (Watch):**
  ```bash
  pnpm test:watch
  ```

* **Ejecutar pruebas con interfaz gráfica interactiva (UI):**
  ```bash
  pnpm test:ui
  ```

* **Ejecutar el servidor de desarrollo local:**
  ```bash
  pnpm dev
  ```

### 3. Qué tipos de pruebas se realizaron

Las pruebas se dividieron en carpetas para garantizar una separación clara de responsabilidades:

1. **Pruebas unitarias de módulos (`src/tests/modules/`)**:
   * **`helpers.js`**: Pruebas de formateo de temperaturas y capitalización de textos para verificar casos borde (como strings vacíos, nulos, etc.).
   * **`events.js`**: Verificación de la definición de eventos y de la correcta propagación de CustomEvents con `bubbles: true` y `composed: true`.

2. **Pruebas de Web Components (`src/tests/components/`)**:
   * **`<user-card>`**: Verifica el registro correcto, el uso de Shadow DOM, la renderización del botón de saludo, y el disparo del evento al presionar el botón tanto en modo por defecto como con slots.
   * **`<warning-badge>`**: Verifica la reactividad del atributo y la propiedad `pulsing` (verificación de comportamiento reactivo dinámico).
   * **`<weather-time>`**: Valida que renderice la ciudad, clima y temperatura predeterminados, que se actualicen al cambiar sus atributos, y que libere el timer interno (`clearInterval`) en su `disconnectedCallback`.

3. **Prueba de integración principal (`src/tests/integration/`)**:
   * **`<user-dashboard>`**: Recrea dinámicamente un dashboard con una tarjeta de usuario, una tarjeta meteorológica y la alerta. Simula el flujo completo de comunicación: click en botón del card -> emisión del evento burbujeante/compuesto -> captura por el dashboard -> activación de la animación de pulso en el warning-badge y despliegue del toast interactivo.

---

## Relación con el Rendimiento Web y el Mantenimiento del Código

La incorporación de Vitest y el enfoque basado en Web Components nativos tiene un impacto directo en el ciclo de vida y rendimiento del software:

1. **Rendimiento de Ejecución de Pruebas**:
   * **Vitest** es significativamente más rápido que Jest gracias a su integración directa con Vite y el procesamiento en paralelo (Worker threads).
   * Al utilizar **Happy DOM** en lugar de JSDOM, el tiempo de arranque de la suite de pruebas disminuye drásticamente, lo cual agiliza la retroalimentación de desarrollo y los pipelines de integración continua (CI).

2. **Rendimiento de la Aplicación**:
   * Al emplear **Web Components Nativos** sin frameworks pesados, no hay costo de descarga de librerías extras (cero JS runtime overhead).
   * El uso de `disconnectedCallback()` para limpiar intervalos (`clearInterval`) previene **fugas de memoria (memory leaks)**, lo cual es crítico para aplicaciones SPA o de larga duración que corren en dispositivos móviles de bajos recursos.

3. **Mantenibilidad y Robustez**:
   * Mantener los componentes encapsulados con **Shadow DOM** asegura que los estilos internos no colisionen con los globales, facilitando actualizaciones sin regresiones visuales.
   * La automatización de pruebas de integración permite a los desarrolladores refactorizar la lógica interna o los estilos de los componentes con la certeza de que la comunicación y la interactividad del sistema global seguirán funcionando correctamente.
