import { Arc, Circle, Layer } from 'konva';
import math from '../utils/math';

export default (classElement) => {
  Object.defineProperties(classElement.prototype, {
    createRing: {
      value: function createRing() {
        this.ring = new Layer();
        this.alignCenter(this.ring);
        for (let i = 0; i < 360; i += 1) {
          const arc = new Arc({
            innerRadius: this.ringInnerRadius,
            outerRadius: this.ringOuterRadius,
            fill: math.getRgb(i),
            angle: -(i + 0.1),
            stroke: 'transparent',
            strokeWidth: 0.5,
          });
          arc.rotation(i);
          arc.on('click touchstart', this.onRingTouch.bind(this));
          this.pointerOnHover(arc);
          this.ring.add(arc);
        }
      },
    },
    createPicker: {
      value: function createPicker() {
        this.picker = new Circle({
          x: this.ringInnerRadius + this.pickerRadius,
          y: 0,
          radius: this.pickerRadius,
          stroke: 'white',
          strokeWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.35)',
          shadowBlur: 2,
          shadowOffset: { x: 0, y: 2 },
          draggable: true,
          dragBoundFunc: this.onPickerDrag.bind(this),
        });
        this.pointerOnHover(this.picker);
        this.ring.add(this.picker);
        this.stage.add(this.ring);
      },
    },
    onPickerDrag: {
      value: function onPickerDrag(pos) {
        const r = this.ringInnerRadius + this.pickerRadius;
        const x = this.stage.width() / 2;
        const y = this.stage.height() / 2;
        const hue = math.getAngleFromPos({
          x: pos.x - this.size / 2,
          y: pos.y - this.size / 2,
        });

        this.setAttribute('hue', hue);
        this.angle = math.getAngleFromPos(pos);
        this.picker.fill(math.getRgb(hue));

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
      },
    },
    onRingTouch: {
      value: function onRingTouch(e) {
        const angle = e.currentTarget.attrs.rotation;
        this.setPickerPos(angle);
        const hue = angle;
        this.setAttribute('hue', hue);
        this.angle = angle;
        this.picker.fill(math.getRgb(hue));
        this.stage.draw();
      },
    },
    setPickerPos: {
      value: function setPickerPos(angle) {
        const radius = this.ringInnerRadius + this.pickerRadius;
        this.picker.setPosition({
          x: radius * Math.cos(math.degToRad(angle)),
          y: radius * Math.sin(math.degToRad(angle)),
        });
      },
    },
  });
  return classElement;
};
