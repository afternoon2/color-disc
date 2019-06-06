import Konva from 'konva';
import math from '../utils/math';

export default (classElement) => {
  Object.defineProperties(classElement.prototype, {
    createRing: {
      value: function createRing() {
        const {
          innerRadius,
          outerRadius,
        } = this.config.ring;

        this.ring = new Konva.Layer();
        this.ring.offsetX(-(this.size / 2));
        this.ring.offsetY(-(this.size / 2));
        for (let i = 0; i < 360; i += 1) {
          const arc = new Konva.Arc({
            innerRadius,
            outerRadius,
            fill: math.getRgb(i),
            angle: -(i + 0.03),
          });
          arc.rotation(i);
          arc.on('click touch', this.onRingTouch.bind(this));
          this.pointerOnHover(arc);
          this.ring.add(arc);
        }
      },
    },
    createPicker: {
      value: function createPicker() {
        const { innerRadius } = this.config.ring;

        this.picker = new Konva.Circle({
          x: innerRadius + this.pickerRadius,
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
        const { innerRadius } = this.config.ring;
        const r = innerRadius + this.pickerRadius;
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
        const r = this.config.ring.innerRadius + this.pickerRadius;
        const angle = e.currentTarget.attrs.rotation;
        this.picker.setPosition({
          x: r * Math.cos(math.degToRad(angle)),
          y: r * Math.sin(math.degToRad(angle)),
        });
        const hue = angle;
        this.setAttribute('hue', hue);
        this.angle = angle;
        this.picker.fill(math.getRgb(hue));
        this.stage.draw();
      },
    },
  });
  return classElement;
};
