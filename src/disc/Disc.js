import styles from './disc.scss';

export default class Disc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._size = this.getAttribute('size') || 400;
    this._mount();
  }

  _mount() {
    const { locals } = styles;
    this.shadowRoot.innerHTML = `
      <div class="${locals.colorDisc}">
        <main>
          <hue-ring size="${this._size}"></hue-ring>
        </main>
      </div>
    `;
  }
}
