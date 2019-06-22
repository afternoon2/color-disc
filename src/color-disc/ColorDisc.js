import math from '../utils/math';
import styles from './color-disc.scss';

export default class ColorDisc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'size',
      'format',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'size':
          this.__render();
          this.__observeStage();
          break;
      }
    }
  }

  connectedCallback() {
    this.__render();
    this.__observeStage();
  }

  disconnectedCallback() {
    this.__colorObserver.disconnect();
  }

  __render() {
    const { locals } = styles;
    this.setAttribute('color', 'hsl(0, 100%, 50%)');
    this.__padding = 20;
    this.__size = (parseInt(this.getAttribute('size'), 10) || 390);
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div
        class="${locals.colorDisc}"
        style="width: ${this.__size}px;"
      >
        <color-stage
          size="${this.__size}"
          padding="${this.__padding}"
        ></color-stage>
      </div>
      `;
  }

  __observeStage() {
    const target = this.shadowRoot.querySelector('color-stage');
    const config = { attributes: true };
    const callback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        const h = mutation.target.getAttribute('h');
        const s = mutation.target.getAttribute('s');
        const l = mutation.target.getAttribute('l');
        switch (this.getAttribute('format')) {
          case 'hsl':
            this.setAttribute('color', `hsl(${h}, ${s}%, ${l}%)`);
            break;
          case 'rgb':
            this.setAttribute('color', math.getRgb(h, s, l));
            break;
          case 'hex':
            this.setAttribute('color', math.getHex(
              ...Object.values(math.getRgb(h, s, l, true)),
            ));
            break;
          default:
            this.setAttribute('color', `hsl(${h}, ${s}%, ${l}%)`);
            break;
        }
      });
    };
    this.__colorObserver = new MutationObserver(callback);
    this.__colorObserver.observe(target, config);
  }
}
