import Konva from 'konva';
import uuid from '../utils/uuid';
import compose from '../utils/compose';
import ring from './ring';

class CanvasContent extends HTMLElement {
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
          this.mount();
          this.init();
          this.createRing();
          this.createPicker();
          break;
      }
    }
  }

  connectedCallback() {
    this.mount();
    this.init();
    this.createRing();
    this.createPicker();
  }

  mount() {
    this.containerId = uuid();
    this.shadowRoot.innerHTML = `
      <div id="${this.containerId}"></div>
    `;
  }

  init() {
    this.setAttribute('hue', 0);
    this.padding = 10;
    this.size = parseInt(this.getAttribute('size'), 10);
    this.config = {
      ring: {
        innerRadius: this.size / 2.86,
        outerRadius: this.size / 2 - this.padding,
      },
    };
    this.pickerRadius = (this.config.ring.outerRadius - this.config.ring.innerRadius) / 2;
    this.stage = new Konva.Stage({
      container: this.shadowRoot.getElementById(this.containerId),
      width: this.size,
      height: this.size,
    });
  }

  pointerOnHover(shape) {
    shape.on('mouseenter', () => {
      this.stage.container().style.cursor = 'pointer';
    });
    shape.on('mouseleave', () => {
      this.stage.container().style.cursor = 'default';
    });
  }
}

export default compose(
  ring,
)(CanvasContent);
