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
          this.__render();
          break;
      }
    }
  }

  connectedCallback() {
    this.__render();
  }


  __render() {
    const { locals } = styles;
    this.padding = 20;
    this._size = (parseInt(this.getAttribute('size'), 10) || 390);
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div
        class="${locals.colorDisc}"
        style="width: ${this._size}px; height: ${this._size}px;"
      >
        <color-stage size="${this._size}" padding="${this.padding}"></color-stage>
      </div>
      `;
  }
}
