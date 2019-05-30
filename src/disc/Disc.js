import styles from './disc.scss';

export default class Disc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._defaultSize = 400;
    this._mount();
  }

  _mount() {
    const { locals } = styles;
    this.shadowRoot.innerHTML = `
      <div
        class="${locals.colorDisc}"
        style="width: ${this.getAttribute('size') || this._defaultSize}px; height: ${this.getAttribute('size') || this._defaultSize}px"
      >
        <main style="width: 100%; height: ${this.getAttribute('size') || this._defaultSize}px">
          <hue-ring size="${this.getAttribute('size') || this._defaultSize}"></hue-ring>
        </main>
      </div>
    `;
  }
}
