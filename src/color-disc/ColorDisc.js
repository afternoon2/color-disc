import styles from './color-disc.scss';

export default class ColorDisc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    const { locals } = styles;
    this.padding = 20;
    this._size = (parseInt(this.getAttribute('size'), 10) || 350) + this.padding;
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div
        class="${locals.colorDisc}"
        style="width: ${this._size}px; height: ${this._size}px; left: calc(50% - ${this._size}px / 2)"
      >
        <main class="${locals.colorDisc__content}">
          <hue-ring padding="${this.padding}" size="${this._size - this.padding * 2}"></hue-ring>
        </main>
      </div>
      `;
    // <color-wheel size="${this._size - this.padding * 2}"></color-wheel>
  }
}
