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

        this.wheelRadius = this.size / 3.5;
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

        this.wheel.add(this.hueGradient);
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
  });
  return classElement;
};
