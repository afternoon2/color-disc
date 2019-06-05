import Konva from 'konva';
import uuid from '../utils/uuid';
import math from '../utils/math';

export default class CanvasContent extends HTMLElement {
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
          this.renderRing();
          break;
      }
    }
  }

  connectedCallback() {
    this.mount();
    this.init();
    this.renderRing();
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
    this.ringConfig = {
      hue: 0,
      angle: 0,
      innerRadius: this.size / 2.86,
      outerRadius: this.size / 2 - this.padding,
    };
    this.pickerRadius = (this.ringConfig.outerRadius - this.ringConfig.innerRadius) / 2;
    this.stage = new Konva.Stage({
      container: this.shadowRoot.getElementById(this.containerId),
      width: this.size,
      height: this.size,
    });
    this.ring = new Konva.Layer();
    this.wheel = new Konva.Layer();
    this.picker = null;
  }

  renderRing() {
    const {
      innerRadius,
      outerRadius,
    } = this.ringConfig;

    this.ring.offsetX(-(this.size / 2));
    this.ring.offsetY(-(this.size / 2));

    for (let i = 0; i < 360; i += 1) {
      const arc = new Konva.Arc({
        innerRadius,
        outerRadius,
        fill: math.getRgb(i),
        angle: -(i + 0.02),
      });
      arc.rotation(i);
      arc.on('click touch', this.onRingTouch.bind(this));
      this.pointerOnHover(arc);
      this.ring.add(arc);
    }

    this.picker = new Konva.Circle({
      x: innerRadius + this.pickerRadius,
      y: 0,
      radius: this.pickerRadius,
      fill: math.getRgb(0),
      stroke: 'white',
      shadowColor: 'rgba(0, 0, 0, 0.35)',
      shadowBlur: 2,
      shadowOffset: { x: 0, y: 2 },
      draggable: true,
      dragBoundFunc: this.onPickerDrag.bind(this),
    });
    this.pointerOnHover(this.picker);
    this.ring.add(this.picker);
    this.stage.add(this.ring);
  }

  onPickerDrag(pos) {
    const {
      innerRadius,
    } = this.ringConfig;
    const r = innerRadius + this.pickerRadius;
    const x = this.stage.width() / 2;
    const y = this.stage.height() / 2;

    this.angle = math.getAngleFromPos(pos);
    this.hue = math.getAngleFromPos({
      x: pos.x - this.size / 2,
      y: pos.y - this.size / 2,
    });
    this.picker.fill(math.getRgb(this.hue));
    const scale = r / Math.sqrt(
      ((pos.x - x) ** 2) + ((pos.y - y) ** 2),
    );
    if (scale < 1 || scale > 1) {
      return {
        y: Math.round((pos.y - y) * scale + y),
        x: Math.round((pos.x - x) * scale + x),
      };
    }
    return pos;
  }

  onRingTouch(e) {
    const r = this.ringConfig.innerRadius + this.pickerRadius;
    const angle = e.currentTarget.attrs.rotation;
    this.picker.setPosition({
      x: r * Math.cos(math.degToRad(angle)),
      y: r * Math.sin(math.degToRad(angle)),
    });
    this.angle = angle;
    this.hue = angle;
    this.picker.fill(math.getRgb(this.hue));
    this.stage.draw();
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
