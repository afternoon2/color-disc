# ColorDisc.js
## [Procreate](https://procreate.art/)-like disc color picker for the web

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/color-disc)

[Demo on CodePen](https://codepen.io/jakub_antolak/pen/LKxzpJ)

<p style="width: 240px; height: auto;">
  <img src="https://github.com/afternoon2/color-disc/blob/assets/color-disc.png?raw=true" alt="Color Disc Screen" />
</p>

## Installation

### Yarn/npm

`yarn add color-disc`

`npm install --save color-disc`

Add this snippet to your root javascript file:

```javascript
  import 'color-disc';
```

### CDN
`<script src="https://unpkg.com/color-disc@1.0.1/dist/color-disc.min.js"></script>`

## Usage

Add `color-disc` to your HTML markup:

```html
<color-disc size="220" format="hex"></color-disc>
```

Where

- `size` - is a number (in pixels, defaults to 390px)
- `format` - is an output color format - `hsl`, `rgb` or `hex` (defaults to hsl)

To read the picked color use `element.getAttribute()` method:

```javascript
const color = document
  .querySelector('color-disc')
  .getAttribute('color');
```