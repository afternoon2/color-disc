import uuid from '../utils/uuid';

export default class HueRing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'size',
    ];
  }

  connectedCallback() {
    this._canvasId = uuid();
    this._pickerId = uuid();
    this._size = this.getAttribute('size');
    this._outerRadius = this._size / 2;
    this._innerRadius = this._size / 2.86;
    this._cellWidth = this._size / 100;
    this._cellHeight = this._outerRadius - this._innerRadius;
    this._pointsAmount = 360;
    this._globalRotation = -120;
    this._render();
    this._renderRing();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const { shadowRoot } = this;
    if (newValue !== oldValue && shadowRoot.childNodes.length > 0) {
      switch (name) {
        case 'size':
          this._render();
          this._renderRing();
          break;
      }
    }
  }

  _render() {
    const halfSize = this.getAttribute('size') / 2;
    this.shadowRoot.innerHTML = `
      <svg
        xmlns="www.w3.org/2000/svg"
        width="${this.getAttribute('size')}"
        height="${this.getAttribute('size')}"
      >
        <foreignObject width="100%" height="100%">
          <canvas id="${this._canvasId}"></canvas>
        </foreignObject>
        <g transform="translate(${halfSize} ${halfSize})">
          <circle id="${this._pickerId}></circle>
        </g>
      </svg>
    `;
  }

  _renderRing() {
    const canvas = this.shadowRoot.getElementById(this._canvasId);
    const ctx = canvas.getContext('2d');

    canvas.width = this._size;
    canvas.height = this._size;

    ctx.translate(this._outerRadius, this._outerRadius);
    ctx.rotate(this._globalRotation * Math.PI / 180);
    ctx.save();

    for (let i = 1; i <= this._pointsAmount; i += 1) {
      ctx.save();
      ctx.rotate(-(i * Math.PI / 180));
      ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
      ctx.fillRect(0, this._innerRadius, this._cellWidth, this._cellHeight);
      ctx.restore();
    }
  }

  // _renderPicker() {
  //   const picker = this.shadowRoot.getElementById(this._pickerId);
  // }
}
