# [README DRAFT]

# ColorDisc.js
[Procreate-ish](https://procreate.art/) disc color picker for the web

## Installation

### Yarn/npm

`yarn add color-disc`

`npm install --save color-disc`

Add this snippet to your main javascript file:

```javascript
  import ColorDisc from 'color-disc';
```

### From cdn
`<script src="https://unpkg.com/color-disc@1.0.0/color-disc.min.js"></script>`

## Usage

All you need to do is to add `color-disc` tag to your HTML markup:

```html
<color-disc></color-disc>
```

By default, Color Disc has absolute position and a size of `390px`, but you can customize it with native css styles and by setting following attributes:

- `size` - number (in pixels)
- `format` - output color format - `hsl`, `hsv`, `rgb` or `hex`

So the custom configuration can look like this:

```html
<color-disc size="200" format="hsv"></color-disc>
```

To read the picked color use `element.getAttribute()` method:

```javascript
const color = document
  .querySelector('color-disc')
  .getAttribute('color');
```