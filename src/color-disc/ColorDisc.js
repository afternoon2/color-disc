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
    if (oldValue !== newValue && this.shadowRoot.childNodes.length > 0) {
      switch (name) {
        case 'size':
          this.__render();
          this.__observeStage();
          break;
        case 'format':
          this.__onColorFormatChange(newValue, this.shadowRoot.querySelector('color-stage'));
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
    const formats = this.__getAllFormats(0, 100, 50);
    this.setAttribute('color', formats[this.getAttribute('format')]);
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
    const self = this;
    const target = this.shadowRoot.querySelector('color-stage');
    const config = { attributes: true };
    const callback = (mutationsList) => {
      mutationsList.forEach(mutation => this.__onColorFormatChange(
        self.getAttribute('format'),
        mutation.target,
      ));
    };
    this.__colorObserver = new MutationObserver(callback);
    this.__colorObserver.observe(target, config);
  }

  __onColorFormatChange(format, stage) {
    const h = parseInt(stage.getAttribute('h'), 10);
    const s = parseInt(stage.getAttribute('s'), 10);
    const l = parseInt(stage.getAttribute('l'), 10);
    const formats = this.__getAllFormats(h, s, l);
    this.setAttribute('color', formats[format]);
  }

  __getAllFormats(h, s, l) {
    return {
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      rgb: math.getRgb(h, s, l),
      hex: math.getHex(
        ...Object.values(math.getRgb(h, s, l, true)),
      ),
    };
  }
}
