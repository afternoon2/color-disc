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
    this._watchHue();
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
          <hue-ring padding="${this.padding}" size="${this._size - this.padding * 2}"></hue-ring>
          <color-wheel size="${this._size - this.padding * 2}" hue="0"></color-wheel>
        </main>
      </div>
      `;
  }

  _watchHue() {
    const hueRing = this.shadowRoot.querySelector('hue-ring');
    const colorWheel = this.shadowRoot.querySelector('color-wheel');
    const MutationObserver = window.MutationObserver
      || window.WebKitMutationObserver
      || window.MozMutationObserver;
    const config = {
      attributes: true,
    };
    const callback = function callback(mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'hue') {
          colorWheel.setAttribute('hue', hueRing.getAttribute('hue'));
        }
      });
    };
    const observer = new MutationObserver(callback);
    observer.observe(hueRing, config);
  }
}
