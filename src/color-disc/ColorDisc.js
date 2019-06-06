import styles from './color-disc.scss';

export default class ColorDisc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'size',
      'color',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'size':
          this._render();
          break;
      }
    }
  }

  connectedCallback() {
    this._render();
  }


  _render() {
    const { locals } = styles;
    this.padding = 20;
    this._size = (parseInt(this.getAttribute('size'), 10) || 390) - this.padding;
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div
        class="${locals.colorDisc}"
        style="width: ${this._size}px; height: ${this._size}px; left: calc(50% - ${this._size}px / 2)"
      >
        <main class="${locals.colorDisc__content}">
          <canvas-content size="${this._size}" hue="0"></canvas-content>
        </main>
      </div>
      `;
  }
}
