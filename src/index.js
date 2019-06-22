import ColorDisc from './color-disc/ColorDisc';
import ColorStage from './color-stage/ColorStage';

const elements = [
  { tag: 'color-stage', node: ColorStage },
  { tag: 'color-disc', node: ColorDisc },
];
elements.forEach((element) => {
  if (!customElements.get(element.tag)) {
    customElements.define(element.tag, element.node);
  }
});
