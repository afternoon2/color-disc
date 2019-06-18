import uuid from '../utils/uuid';
import math from '../utils/math';
import styles from './color-stage.scss';

export default class ColorStage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.__init();
  }

  __init() {
    this.__hue = 0;
    this.__mount();
    this.__initCanvasEnvironment();
    this.__drawHueRing();
    this.__drawWheel();
    this.__drawHuePicker();
    this.__addCanvasListeners();
  }

  __mount() {
    const containerStyle = 'position: relative;';
    const canvasStyle = 'position: absolute;';

    this.__sceneCanvasId = uuid();
    this.__containerId = uuid();
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div id="${this.__containerId}" style="${containerStyle}">
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
    this.__sceneCtx.translate(this.__half, this.__half);
    this.__hitCtx.translate(this.__half, this.__half);
  }

  __drawHueRing() {
    this.__hueRingOuterR = this.__half - this.__padding;
    this.__hueRingInnerR = this.__hueRingOuterR * 0.75;
    this.__hueRingRectH = this.__hueRingOuterR - this.__hueRingInnerR;

    const sceneCtx = this.__sceneCtx;
    const hitCtx = this.__hitCtx;

    for (let i = 0; i < 360; i += 1) {
      sceneCtx.save();
      sceneCtx.rotate(math.degToRad(i));
      const p1 = [this.__hueRingInnerR, 0];
      const p2 = [this.__hueRingOuterR, 0];
      const p3 = Object.values(math.getPosFromDegAndRadius(1, this.__hueRingOuterR));
      const p4 = Object.values(math.getPosFromDegAndRadius(1, this.__hueRingInnerR));
      const p3Cp = Object.values(math.getPosFromDegAndRadius(0.5, this.__hueRingOuterR));
      const p4Cp = Object.values(math.getPosFromDegAndRadius(0.5, this.__hueRingInnerR));
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
    hitCtx.arc(0, 0, this.__hueRingOuterR, 0, Math.PI * 2, false);
    hitCtx.arc(0, 0, this.__hueRingInnerR, 0, Math.PI * 2, true);
    hitCtx.fill();
    hitCtx.closePath();
  }

  __drawWheel() {
    const sceneCtx = this.__sceneCtx;
    const hitCtx = this.__hitCtx;

    this.__wheelR = this.__hueRingOuterR / 1.61;

    const brightnessGradient = sceneCtx.createLinearGradient(
      -this.__wheelR,
      -this.__wheelR,
      -this.__wheelR,
      this.__wheelR,
    );
    brightnessGradient.addColorStop(0, 'white');
    brightnessGradient.addColorStop(1, 'black');

    const hueGradient = sceneCtx.createLinearGradient(
      -this.__wheelR,
      -this.__wheelR,
      this.__wheelR,
      -this.__wheelR,
    );
    hueGradient.addColorStop(0, `hsla(${this.__hue},100%,50%,0)`);
    hueGradient.addColorStop(1, `hsla(${this.__hue},100%,50%,1)`);

    sceneCtx.beginPath();
    sceneCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    sceneCtx.closePath();
    sceneCtx.fillStyle = brightnessGradient;
    sceneCtx.fill();
    sceneCtx.fillStyle = hueGradient;
    sceneCtx.globalCompositeOperation = 'multiply';
    sceneCtx.fill();
    sceneCtx.globalCompositeOperation = 'source-over';


    this.__shapeRegistry.wheel = this.__getRandomColor();
    hitCtx.beginPath();
    hitCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    hitCtx.fillStyle = this.__shapeRegistry.wheel;
    hitCtx.closePath();
    hitCtx.fill();
  }

  __drawHuePicker() {
    const { locals } = styles;
    const container = this.shadowRoot.getElementById(this.__containerId);

    this.__huePicker = document.createElement('a');
    this.__huePicker.classList.add(locals.huePicker);
    this.__huePicker.style.width = `${this.__hueRingRectH}px`;
    this.__huePicker.style.height = `${this.__hueRingRectH}px`;
    this.__huePicker.style.backgroundColor = this.getAttribute('color');
    this.__huePicker.style.left = `${this.__size - this.__padding - this.__hueRingRectH}px`;
    this.__huePicker.style.top = `${this.__half - this.__hueRingRectH / 2}px`;
    this.__addHueRingEvents();

    container.appendChild(this.__huePicker);
  }

  __addHueRingEvents() {
    const self = this;
    function onMouseMove(evt) {
      const clientXY = self.__getClientXY(evt);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('touchend', onMouseUp);
      const canvasXY = {
        x: clientXY.x - self.__half,
        y: clientXY.y - self.__half,
      };
      const requiredR = self.__hueRingInnerR;
      const currentR = Math.sqrt(
        (canvasXY.x ** 2) + (canvasXY.y ** 2),
      );
      const isDifferent = (
        currentR > requiredR
        || currentR < requiredR
      );
      const angle = math.getAngleFromPos(canvasXY);
      const pickerPathCoords = math.getPosFromDegAndRadius(angle, requiredR);
      const x = isDifferent
        ? pickerPathCoords.x + requiredR : canvasXY.x + requiredR;
      const y = isDifferent
        ? pickerPathCoords.y + requiredR : canvasXY.y + requiredR;

      self.__huePicker.style.top = `${y}px`;
      self.__huePicker.style.left = `${x}px`;

      return self.__preventDefault(evt);
    }
    function onMouseUp(evt) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      return self.__preventDefault(evt);
    }

    function onMouseDown(e) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove);
      return self.__preventDefault(e);
    }

    this.__huePicker.addEventListener('mousedown', onMouseDown);
    this.__huePicker.addEventListener('touchstart', onMouseDown);
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
      const mousePos = self.__getCanvasPos(e);
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

  __getCanvasPos(e) {
    return {
      x: e.clientX - this.parentElement.offsetLeft,
      y: e.clientY - this.parentElement.offsetTop,
    };
  }

  __getClientXY(e) {
    return {
      x: e.type === 'touchmove'
        ? e.touches[0].clientX : e.clientX,
      y: e.type === 'touchmove'
        ? e.touches[0].clientY : e.clientY,
    };
  }

  __preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
