import Disc from './disc/ColorDisc';
import HueRing from './ring/HueRing';

(() => {
  const elements = [
    { tag: 'color-disc', node: Disc },
    { tag: 'hue-ring', node: HueRing },
  ];
  elements.forEach((element) => {
    if (!customElements.get(element.tag)) {
      customElements.define(element.tag, element.node);
    }
  });
})();
