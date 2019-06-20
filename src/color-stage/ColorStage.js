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

  static get observedAttributes() {
    return ['h', 's', 'l'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      switch (name) {
        case 'h':
          if (oldVal) {
            this.__wheelPicker.style.backgroundColor = math.getRgb(
              newVal,
              parseFloat(this.getAttribute('s')),
              parseFloat(this.getAttribute('l')),
            );
          }
          break;
      }
    }
  }

  __init() {
    this.setAttribute('h', 0);
    this.__hue = 0;
    this.__mount();
    this.__initCanvasEnvironment();
    this.__drawHueRing();
    this.__drawWheel();
    this.__drawWheelPicker();
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

  __drawWheelPicker() {
    const { locals } = styles;
    const container = this.shadowRoot.getElementById(this.__containerId);
    this.__wheelPickerR = this.__size / 20;
    this.__wheelPicker = document.createElement('a');
    this.__wheelPicker.classList.add(locals.wheelPicker);
    this.__wheelPicker.style.width = `${this.__wheelPickerR}px`;
    this.__wheelPicker.style.height = `${this.__wheelPickerR}px`;
    this.__wheelPicker.style.left = `${this.__half}px`;
    this.__wheelPicker.style.top = `${this.__half}px`;
    const { data } = this.__sceneCtx.getImageData(
      this.__half,
      this.__half,
      1,
      1,
    );
    const bgColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    this.__wheelPicker.style.backgroundColor = bgColor;
    const hslObj = math.getHsl(data[0], data[1], data[2], true);
    this.setAttribute('s', Math.round(hslObj.s));
    this.setAttribute('l', Math.round(hslObj.l));
    container.appendChild(this.__wheelPicker);
  }

  __redrawWheel() {
    this.__brightnessGradient = this.__sceneCtx.createLinearGradient(
      -this.__wheelR,
      -this.__wheelR,
      -this.__wheelR,
      this.__wheelR,
    );
    this.__brightnessGradient.addColorStop(0, 'white');
    this.__brightnessGradient.addColorStop(1, 'black');
    const hueGradient = this.__sceneCtx.createLinearGradient(
      -this.__wheelR,
      -this.__wheelR,
      this.__wheelR,
      -this.__wheelR,
    );
    hueGradient.addColorStop(0, `hsla(${this.getAttribute('h')},100%,50%,0)`);
    hueGradient.addColorStop(1, `hsla(${this.getAttribute('h')},100%,50%,1)`);
    this.__sceneCtx.beginPath();
    this.__sceneCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    this.__sceneCtx.closePath();
    this.__sceneCtx.fillStyle = this.__brightnessGradient;
    this.__sceneCtx.fill();
    this.__sceneCtx.fillStyle = hueGradient;
    this.__sceneCtx.globalCompositeOperation = 'multiply';
    this.__sceneCtx.fill();
    this.__sceneCtx.globalCompositeOperation = 'source-over';
    this.__sceneCtx.save();
  }

  __drawWheel() {
    this.__wheelR = this.__hueRingOuterR / 1.61;
    this.__redrawWheel();
    this.__shapeRegistry.wheel = this.__getRandomColor();
    this.__hitCtx.beginPath();
    this.__hitCtx.arc(0, 0, this.__wheelR, 0, Math.PI * 2);
    this.__hitCtx.fillStyle = this.__shapeRegistry.wheel;
    this.__hitCtx.closePath();
    this.__hitCtx.fill();
  }

  __drawHuePicker() {
    const { locals } = styles;
    const container = this.shadowRoot.getElementById(this.__containerId);
    this.__huePicker = document.createElement('a');
    this.__huePicker.classList.add(locals.huePicker);
    this.__huePicker.style.width = `${this.__hueRingRectH}px`;
    this.__huePicker.style.height = `${this.__hueRingRectH}px`;
    this.__huePicker.style.backgroundColor = `hsl(${this.getAttribute('hue')}, 100%, 50%)`;
    this.__huePicker.style.left = `${this.__size - this.__padding - this.__hueRingRectH}px`;
    this.__huePicker.style.top = `${this.__half - this.__hueRingRectH / 2}px`;
    this.__huePicker.addEventListener('mousedown', this.__onHuePickerDown.bind(this));
    this.__huePicker.addEventListener('touchstart', this.__onHuePickerDown.bind(this));
    container.appendChild(this.__huePicker);
  }

  __onHuePickerDown(e) {
    const self = this;
    function onUp(evt) {
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('mousemove', onMove);
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
      return self.__preventDefault(evt);
    }
    function onMove(evt) {
      self.__positionHuePicker(evt);
      self.__redrawWheel();
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchend', onUp);
      return self.__preventDefault(evt);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    return this.__preventDefault(e);
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
      const color = self.__getHitColor(e);
      if (
        color === self.__shapeRegistry.ring
        || color === self.__shapeRegistry.wheel
      ) {
        self.__scene.style.cursor = 'pointer';
      } else {
        self.__scene.style.cursor = 'default';
      }
    });
    this.__scene.addEventListener('click', (e) => {
      const color = self.__getHitColor(e);
      if (color === self.__shapeRegistry.ring) {
        self.__positionHuePicker(e);
        self.__redrawWheel();
      } else if (color === self.__shapeRegistry.wheel) {
        self.__positionWheelPicker(e);
      }
    });
  }

  __positionHuePicker(e) {
    const angle = this.__getAngleFromClientXY(e);
    const halfPickerRadius = this.__hueRingOuterR - this.__hueRingRectH / 2;
    const translatedPickerPos = math.getPosFromDegAndRadius(angle, halfPickerRadius);
    const absolutePickerPos = this.__getAbsoluteCanvasPos(translatedPickerPos);
    this.__huePicker.style.left = `${absolutePickerPos.x}px`;
    this.__huePicker.style.top = `${absolutePickerPos.y}px`;
    this.__huePicker.style.backgroundColor = `hsl(${angle}, 100%, 50%)`;
    this.__wheelPicker.style.backgroundColor = `hsl(${angle}, ${this.getAttribute('s')}%, ${this.getAttribute('l')}%)`;
    this.setAttribute('h', angle);
  }

  __positionWheelPicker(e) {
    const clientXY = this.__getClientXY(e);
    const angle = this.__getAngleFromClientXY(e);
    const maxRadius = this.__wheelR;
    const translatedXY = this.__getTranslatedCanvasPos(clientXY);
    const currentRadius = Math.sqrt(
      (translatedXY.x ** 2) + (translatedXY.y ** 2),
    );
    const translatedPickerPos = currentRadius > maxRadius
      ? math.getPosFromDegAndRadius(angle, maxRadius)
      : math.getPosFromDegAndRadius(angle, currentRadius);
    const canvasPickerPos = this.__getAbsoluteCanvasPos(translatedPickerPos);
    const correctedPos = {
      x: canvasPickerPos.x + this.__wheelPickerR,
      y: canvasPickerPos.y + this.__wheelPickerR,
    };
    const { data } = this.__sceneCtx.getImageData(correctedPos.x, correctedPos.y, 1, 1);
    this.__wheelPicker.style.left = `${correctedPos.x}px`;
    this.__wheelPicker.style.top = `${correctedPos.y}px`;
    this.__wheelPicker.style.backgroundColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    const hsl = math.getHsl(data[0], data[1], data[2], true);
    this.setAttribute('s', Math.round(hsl.s));
    this.setAttribute('l', Math.round(hsl.l));
  }

  __getHitColor(e) {
    const clientXY = this.__getClientXY(e);
    const mousePos = this.__getCanvasPos(clientXY);
    const { data } = this.__hitCtx.getImageData(mousePos.x, mousePos.y, 1, 1);
    return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
  }

  __getCanvasPos(pos) {
    return {
      x: pos.x - this.parentElement.offsetLeft,
      y: pos.y - this.parentElement.offsetTop,
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

  __getTranslatedCanvasPos(pos) {
    const middlePoint = {
      x: this.__half + this.parentElement.offsetLeft,
      y: this.__half + this.parentElement.offsetTop,
    };
    return {
      x: Math.round(pos.x - middlePoint.x),
      y: Math.round(pos.y - middlePoint.y),
    };
  }

  __getAbsoluteCanvasPos(translatedXY) {
    return {
      x: Math.round(this.__half + translatedXY.x - this.__hueRingRectH / 2),
      y: Math.round(this.__half + translatedXY.y - this.__hueRingRectH / 2),
    };
  }

  __getAngleFromClientXY(e) {
    const clientXY = this.__getClientXY(e);
    const translatedXY = this.__getTranslatedCanvasPos(clientXY);
    return math.getAngleFromPos(translatedXY);
  }

  __preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
