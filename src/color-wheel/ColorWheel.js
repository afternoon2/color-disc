import styles from './color-wheel.scss';
import uuid from '../utils/uuid';

export default class ColorWheel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'size',
      'hue',
    ];
  }

  connectedCallback() {
    this._render();
    this._init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'size':
          this._render();
          this._init();
          break;
      }
    }
  }

  _render() {
    const { locals } = styles;
    this._size = parseInt(this.getAttribute('size'), 10) * 0.5;
    const topAndLeft = `calc(50% - ${this._size / 2}px)`;
    const canvasId = uuid();
    this.shadowRoot.innerHTML = `
      <style>
      ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div 
        class="${locals.colorWheel}"
        style="width: ${this._size}px; height: ${this._size}px; top: ${topAndLeft}; left: ${topAndLeft};"
      >
        <div class="${locals.colorWheel__wrapper}">
          <canvas
            id="${canvasId}"
            class="${locals.colorWheel__canvas}"
          ></canvas>
        </div>
      </div>
    `;
    this._canvas = this.shadowRoot.getElementById(canvasId);
  }

  _init() {
    this._canvas.width = this._size;
    this._canvas.height = this._size;

    const ctx = this._canvas.getContext('2d');

    ctx.fillStyle = 'pink';
    ctx.translate(this._size / 2, this._size / 2);
    ctx.arc(0, 0, this._size, 0, Math.PI * 2);
    ctx.fill();
  }
}
