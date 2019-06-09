import uuid from '../utils/uuid';
import math from '../utils/math';

export default class ColorStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.__init();
  }

  __init() {
    this.__mount();
    this.__initCanvasEnvironment();
    this.__drawHueRing();
    this.__drawWheel();
    this.__addCanvasListeners();
  }

  __mount() {
    const containerStyle = 'position: relative;';
    const canvasStyle = 'position: absolute;';

    this.__sceneCanvasId = uuid();
    this.shadowRoot.innerHTML = `
      <div style="${containerStyle}">
        <canvas id="${this.__sceneCanvasId}" style="${canvasStyle}"></canvas>
      </div>
    `;
  }

  __initCanvasEnvironment() {
    const { shadowRoot } = this;
    this.__shapeRegistry = {};
    this.__size = parseInt(this.getAttribute('size'), 10);
    this.__padding = parseInt(this.getAttribute('padding'), 10);
    this.__half = this.__size / 2;
    this.__scene = shadowRoot.getElementById(this.__sceneCanvasId);
    this.__sceneCtx = this.__scene.getContext('2d');
    this.__hitCanvas = document.createElement('canvas');
    this.__hitCtx = this.__hitCanvas.getContext('2d');
    this.__padding = parseInt(this.getAttribute('padding'), 10);
    this.__scene.width = this.__size;
    this.__scene.height = this.__size;
    this.__hitCanvas.width = this.__size;
    this.__hitCanvas.height = this.__size;
    // document.body.appendChild(this.__hitCanvas);
    this.__sceneCtx.translate(this.__half, this.__half);
    this.__hitCtx.translate(this.__half, this.__half);
  }

  __drawHueRing() {
    this.hueRingOuterR = this.__half - this.__padding;
    this.hueRingInnerR = this.hueRingOuterR * 0.75;
    this.hueRingRectH = this.hueRingOuterR - this.hueRingInnerR;

    const sceneCtx = this.__sceneCtx;
    const hitCtx = this.__hitCtx;

    for (let i = 0; i < 360; i += 1) {
      sceneCtx.save();
      sceneCtx.rotate(math.degToRad(i));
      const p1 = [this.hueRingInnerR, 0];
      const p2 = [this.hueRingOuterR, 0];
      const p3 = Object.values(math.getPosFromDegAndRadius(1, this.hueRingOuterR));
      const p4 = Object.values(math.getPosFromDegAndRadius(1, this.hueRingInnerR));
      const p3Cp = Object.values(math.getPosFromDegAndRadius(0.5, this.hueRingOuterR));
      const p4Cp = Object.values(math.getPosFromDegAndRadius(0.5, this.hueRingInnerR));
      sceneCtx.fillStyle = `hsl(${i}, 100%, 50%)`;
      sceneCtx.strokeStyle = `hsl(${i}, 100%, 50%)`;
      sceneCtx.moveTo(...p1);
      sceneCtx.beginPath();
      sceneCtx.lineTo(...p2);
      sceneCtx.quadraticCurveTo(...p3Cp, ...p3);
      sceneCtx.lineTo(...p4);
      sceneCtx.quadraticCurveTo(...p4Cp, ...p1);
      sceneCtx.closePath();
      sceneCtx.fill();
      sceneCtx.stroke();
      sceneCtx.restore();
      sceneCtx.moveTo(0, 0);
    }

    this.__shapeRegistry.ring = this.__getRandomColor();
    hitCtx.fillStyle = this.__shapeRegistry.ring;
    hitCtx.beginPath();
    hitCtx.arc(0, 0, this.hueRingOuterR, 0, Math.PI * 2, false);
    hitCtx.arc(0, 0, this.hueRingInnerR, 0, Math.PI * 2, true);
    hitCtx.fill();
    hitCtx.closePath();
  }

  __drawWheel() {
    const sceneCtx = this.__sceneCtx;
    const hitCtx = this.__hitCtx;

    this.__wheelR = this.hueRingOuterR / 1.61;
    sceneCtx.beginPath();
    sceneCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    sceneCtx.fillStyle = 'pink';
    sceneCtx.closePath();
    sceneCtx.fill();

    this.__shapeRegistry.wheel = this.__getRandomColor();
    hitCtx.beginPath();
    hitCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    hitCtx.fillStyle = this.__shapeRegistry.wheel;
    hitCtx.closePath();
    hitCtx.fill();
  }

  __getRandomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b})`;
  }

  __addCanvasListeners() {
    const self = this;
    this.__scene.addEventListener('mousemove', (e) => {
      const mousePos = {
        x: e.clientX - self.parentElement.offsetLeft,
        y: e.clientY - self.parentElement.offsetTop,
      };
      const { data } = this.__hitCtx.getImageData(mousePos.x, mousePos.y, 1, 1);
      const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      if (
        color === self.__shapeRegistry.ring
        || color === self.__shapeRegistry.wheel
      ) {
        self.__scene.style.cursor = 'pointer';
      } else {
        self.__scene.style.cursor = 'default';
      }
    });
  }

  __save() {
    this.__sceneCtx.save();
    this.__hitCtx.save();
  }

  __restore() {
    this.__sceneCtx.restore();
    this.__hitCtx.restore();
  }
}
