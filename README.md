# ColorDisc.js
## [Procreate](https://procreate.art/)-like disc color picker for the web

## Installation

### Yarn/npm

`yarn add color-disc`

`npm install --save color-disc`

Add this snippet to your root javascript file:

```javascript
  import 'color-disc';
```

### CDN
`<script src="https://unpkg.com/color-disc@1.0.0/color-disc.min.js"></script>`

## Usage

Add `color-disc` to your HTML markup:

```html
<color-disc></color-disc>
```

You can customize ColorDisc by setting following attributes:

- `size` - number (in pixels, defaults to 390px)
- `format` - output color format - `hsl`, `rgb` or `hex` (defaults to hsl)

```html
<color-disc size="200" format="rgb"></color-disc>
```

To read the picked color use `element.getAttribute()` method:

```javascript
const color = document
  .querySelector('color-disc')
  .getAttribute('color');
```