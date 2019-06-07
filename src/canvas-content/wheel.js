import { Circle, Layer } from 'konva';
import math from '../utils/math';

export default (classElement) => {
  Object.defineProperties(classElement.prototype, {
    createWheel: {
      value: function createWheel() {
        const gradientConfig = {
          x: 0,
          y: 0,
          radius: this.wheelRadius,
        };

        this.wheelSize = this.size / 1.75;
        this.wheelRadius = this.wheelSize / 2;
        this.wheel = new Layer();

        this.wheel.offsetX(-this.size / 2);
        this.wheel.offsetY(-this.size / 2);

        this.brightnessGradient = new Circle({
          fillLinearGradientStartPoint: {
            x: -this.wheelRadius,
            y: -this.wheelRadius,
          },
          fillLinearGradientEndPoint: {
            x: this.wheelRadius,
            y: this.wheelRadius,
          },
          fillLinearGradientColorStops: [0.2, 'white', 0.8, 'black'],
          globalCompositeOperation: 'source-over',
          ...gradientConfig,
        });
        this.wheel.add(this.brightnessGradient);
        this.pointerOnHover(this.wheel);
        this.hueGradient = new Circle({
          fillLinearGradientStartPoint: {
            x: -this.wheelRadius,
            y: this.wheelRadius,
          },
          fillLinearGradientEndPoint: {
            x: this.wheelRadius,
            y: -this.wheelRadius,
          },
          fillLinearGradientColorStops: this.getHueGradientStops(this.getAttribute('hue')),
          globalCompositeOperation: 'multiply',
          ...gradientConfig,
        });
        this.hueGradient.on('click touchstart', this.setWheelPickerPosition.bind(this));

        this.wheel.add(this.hueGradient);

        this.wheelPicker = new Circle({
          radius: 12,
          x: 0,
          y: 0,
          stroke: 'white',
          strokeWidth: 0.5,
          fill: 'pink',
          shadowColor: 'rgba(0, 0, 0, 0.35)',
          shadowBlur: 2,
          shadowOffset: { x: 0, y: 2 },
          draggable: true,
          dragBoundFunc: this.onWheelPickerDrag.bind(this),
        });
        this.wheel.add(this.wheelPicker);

        this.stage.add(this.wheel);
      },
    },
    getHueGradientStops: {
      value: function getHueGradientStops(hue) {
        const _hue = parseInt(hue, 10);
        const hsl = math.getRgb(_hue, 100, 50, true);
        const startPoint = `rgba(${Object.values(hsl)}, 0)`;
        const endPoint = `rgba(${Object.values(hsl)}, 1)`;
        return [0.03, startPoint, 0.97, endPoint];
      },
    },
    updateHueGradient: {
      value: function updateHueGradient() {
        const hue = this.getAttribute('hue');
        const stops = this.getHueGradientStops(hue);
        this.hueGradient.setAttr(
          'fillLinearGradientColorStops',
          stops,
        );
        this.wheel.draw();
      },
    },
    setWheelPickerPosition: {
      value: function setWheelPickerPosition(event) {
        const discOffset = event.evt.target.getBoundingClientRect();
        const zeroPointOffset = {
          x: discOffset.left + this.size / 2,
          y: discOffset.top + this.size / 2,
        };
        const pickerPosition = {
          x: event.evt.clientX - zeroPointOffset.x,
          y: event.evt.clientY - zeroPointOffset.y,
        };
        this.wheelPicker.position(pickerPosition);
        this.wheel.draw();
      },
    },
    onWheelPickerDrag: {
      value: function onWheelPickerDrag(pos) {
        const wheelPos = {
          x: pos.x - this.size / 2,
          y: pos.y - this.size / 2,
        };
        const r = Math.sqrt(
          // eslint-disable-next-line no-mixed-operators
          wheelPos.x ** 2 + wheelPos.y ** 2,
        );
        const angle = math.getAngleFromPos(wheelPos);
        const properWheelPos = math.getPosFromDegAndRadius(angle, this.wheelRadius);
        if (r > this.wheelRadius) {
          return {
            x: properWheelPos.x + this.size / 2,
            y: properWheelPos.y + this.size / 2,
          };
        }
        return pos;
      },
    },
  });
  return classElement;
};
