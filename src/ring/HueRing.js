import styles from './hue-ring.scss';

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

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {
      switch (name) {
        case 'size':
          this._render();
          this._renderRing();
          break;
      }
    }
  }

  connectedCallback() {
    this.setAttribute('hue', 0);
    this._render();
    this._renderRing();
    this._renderPicker();
    this._addRingEvents();
  }

  _render() {
    const { locals } = styles;
    this._size = parseInt(this.getAttribute('size'), 10);
    this._translation = this._size / 2;
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div class="${locals.hueRing}">
        <svg xmlns="www.w3.org/2000/svg" width="${this._size}" height="${this._size}">
          <filter id="circle-shadow">
            <feGaussianBlur stdDeviation="2" in="SourceAlpha" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <g id="picker-area" transform="translate(${this._translation} ${this._translation})">
            <g id="color-cells"></g>
          </g>
        </svg>
      </div>
    `;
  }

  _renderRing() {
    this._outerRadius = this._size / 2;
    this._innerRadius = this._size / 2.86;
    this._cellWidth = this._size / 56;
    this._cellHeight = this._outerRadius - this._innerRadius;
    this._pointsAmount = 360;

    const cells = this.shadowRoot.getElementById('color-cells');

    for (let i = 0; i <= this._pointsAmount; i += 1) {
      cells.insertAdjacentHTML('beforeend', `
          <rect
            class="color-cell"
            x="${this._innerRadius}"
            y="0"
            width="${this._cellHeight}"
            height="${this._cellWidth}"
            fill="hsl(${i}, 100%, 50%)"
            transform="rotate(${i})"
          />
      `);
    }
  }

  _renderPicker() {
    const { locals } = styles;
    const { shadowRoot } = this;
    const area = shadowRoot.getElementById('picker-area');
    this._pickerRadius = this._cellHeight / 2;
    this._pickerPathRadius = this._innerRadius + this._pickerRadius;

    area.insertAdjacentHTML('beforeend', `
      <circle
        class="${locals.hueRing__picker}"
        id="hue-picker"
        cx="${this._innerRadius + this._pickerRadius}"
        cy="0"
        r="${this._pickerRadius - 1}"
        fill="hsl(0, 100%, 50%)"
        stroke="#fcfcfc"
        filter="url(#circle-shadow)"
      />
    `);
    this.picker = shadowRoot.getElementById('hue-picker');
    this._addPickerEvents();
  }

  _addRingEvents() {
    const cells = this.shadowRoot.getElementById('color-cells');
    cells.addEventListener(
      'click',
      () => {
        // const x = e.target.
      },
    );
  }

  _addPickerEvents() {
    const self = this;

    function onMouseMove(e) {
      const clientXY = self._getClientXY(e);
      const ringCoords = self._getRingClientCoordinates(clientXY);
      const hue = self._getHueAngle(ringCoords);
      const currentRadius = Math.sqrt(
        ringCoords.x * ringCoords.x + ringCoords.y * ringCoords.y,
      );
      const isRadiusDifferent = (
        currentRadius > self._pickerPathRadius
        || currentRadius < self._pickerPathRadius
      );
      const x = isRadiusDifferent
        ? self._pickerPathRadius * Math.cos(self._degToRad(hue)) : ringCoords.x;
      const y = isRadiusDifferent
        ? self._pickerPathRadius * Math.sin(self._degToRad(hue)) : ringCoords.y;

      self.picker.setAttribute('cx', x);
      self.picker.setAttribute('cy', y);
      self.picker.setAttribute('fill', `hsl(${hue}, 100%, 50%)`);
      self.setAttribute('hue', hue);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('mouseup', onMouseUp);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('touchend', onMouseUp);

      return self._preventDefault(e);
    }

    function onMouseDown(e) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove);
      return self._preventDefault(e);
    }

    function onMouseUp(e) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
      document.removeEventListener('mouseup', onMouseUp);
      return self._preventDefault(e);
    }

    this.picker.addEventListener('mousedown', onMouseDown);
    this.picker.addEventListener('touchstart', onMouseDown);
  }

  _getHueAngle(coords) {
    let angle = Math.atan2(coords.y, coords.x);
    if (angle < 0) angle += Math.PI * 2;
    return this._radToDeg(angle);
  }

  _radToDeg(rad) {
    return rad * 180 / Math.PI;
  }

  _degToRad(deg) {
    return deg * Math.PI / 180;
  }

  _getRingClientCoordinates(coords) {
    const ringLeft = this.getBoundingClientRect().left;
    const ringTop = this.getBoundingClientRect().top;
    const middleX = ringLeft + this._outerRadius;
    const middleY = ringTop + this._outerRadius;
    return {
      x: coords.x - middleX,
      y: coords.y - middleY,
    };
  }

  _getClientXY(e) {
    return {
      x: e.type === 'touchmove'
        ? e.touches[0].clientX : e.clientX,
      y: e.type === 'touchmove'
        ? e.touches[0].clientY : e.clientY,
    };
  }

  _preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}
