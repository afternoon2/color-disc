import CanvasContent from './canvas-content/CanvasContent';
import ColorDisc from './color-disc/ColorDisc';

(() => {
  const elements = [
    { tag: 'canvas-content', node: CanvasContent },
    { tag: 'color-disc', node: ColorDisc },
  ];
  elements.forEach((element) => {
    if (!customElements.get(element.tag)) {
      customElements.define(element.tag, element.node);
    }
  });
})();
