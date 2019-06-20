export default {
  degToRad(deg) {
    return deg * Math.PI / 180;
  },
  radToDeg(rad) {
    return rad * 180 / Math.PI;
  },
  getAngleFromPos(pos, radians = false) {
    let angle = Math.atan2(pos.y, pos.x);
    if (angle < 0) angle += Math.PI * 2;
    if (radians) {
      return angle;
    }
    return this.radToDeg(angle);
  },
  getPosFromDegAndRadius(deg, radius) {
    const angleRad = this.degToRad(deg);
    return {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad),
    };
  },
  keepOnRadius(radius, position, stageWidth) {
    const x = stageWidth / 2;
    const y = stageWidth / 2;
    const powX = (position.x - x) ** 2;
    const powY = (position.y - y) ** 2;
    const hypotenuse = Math.sqrt(powX, powY);
    const scale = radius / hypotenuse;
    if (scale < 1 || scale > 1) {
      return {
        x: Math.round((position.x - x) * scale + x),
        y: Math.round((position.y - y) * scale + y), 
      };
    }
    return position;
  },
  getHsl(r, g, b, objectOutput = false) {
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    if (objectOutput) {
      return { h, s, l };
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
  },
  getHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (r.length === 1) r = `0${r}`;
    if (g.length === 1) g = `0${g}`;
    if (b.length === 1) b = `0${b}`;
    return `#${r}${g}${b}`;
  },
};
