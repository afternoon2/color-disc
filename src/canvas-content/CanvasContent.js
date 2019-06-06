import Konva from 'konva';
import uuid from '../utils/uuid';
import compose from '../utils/compose';
import ring from './ring';
import wheel from './wheel';

class CanvasContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'color',
      'hue',
      'size',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'size':
          this.run();
          break;
        case 'hue':
          this.setPickerPos(parseInt(newValue, 10));
          this.updateHueGradient();
          break;
      }
    }
  }

  connectedCallback() {
    this.run();
  }

  run() {
    this.mount();
    this.init();
    this.createRing();
    this.createPicker();
    this.createWheel();
  }

  mount() {
    this.containerId = uuid();
    this.shadowRoot.innerHTML = `
      <div id="${this.containerId}"></div>
    `;
  }

  init() {
    this.padding = 10;
    this.size = parseInt(this.getAttribute('size'), 10);
    this.ringInnerRadius = this.size / 2.86;
    this.ringOuterRadius = this.size / 2 - this.padding;
    this.pickerRadius = (this.ringOuterRadius - this.ringInnerRadius) / 2;
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

  alignCenter(layer) {
    layer.offsetX(-(this.size / 2));
    layer.offsetY(-(this.size / 2));
  }
}

export default compose(
  ring,
  wheel,
)(CanvasContent);
