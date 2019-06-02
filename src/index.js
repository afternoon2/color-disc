import ColorDisc from './color-disc/ColorDisc';
import HueRing from './hue-ring/HueRing';
import ColorWheel from './color-wheel/ColorWheel';

(() => {
  const elements = [
    { tag: 'hue-ring', node: HueRing },
    { tag: 'color-wheel', node: ColorWheel },
    { tag: 'color-disc', node: ColorDisc },
  ];
  elements.forEach((element) => {
    if (!customElements.get(element.tag)) {
      customElements.define(element.tag, element.node);
    }
  });
})();
