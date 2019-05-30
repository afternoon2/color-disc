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
        </g>
      </svg>
    `;
  }

  _renderRing() {
    const canvas = this.shadowRoot.getElementById(this._canvasId);
    const ctx = canvas.getContext('2d');
    const size = this.getAttribute('size');
    const outerRadius = size / 2;
    const innerRadius = size / 2.86;
    const cellWidth = size / 100;
    const cellHeight = outerRadius - innerRadius;
    const pointsAmount = 360;
    const globalRotation = -120;

    function init() {
      canvas.width = size;
      canvas.height = size;
    }

    function prepare() {
      ctx.translate(outerRadius, outerRadius);
      ctx.rotate(globalRotation * Math.PI / 180);
      ctx.save();
    }

    function drawCells() {
      for (let i = 1; i <= pointsAmount; i += 1) {
        ctx.save();
        ctx.rotate(-(i * Math.PI / 180));
        ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
        ctx.fillRect(0, innerRadius, cellWidth, cellHeight);
        ctx.restore();
      }
    }

    init();
    prepare();
    drawCells();
  }
}
