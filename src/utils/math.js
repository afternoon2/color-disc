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
  getRgb(h, s = 100, l = 50) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    // eslint-disable-next-line no-mixed-operators
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `rgb(${r}, ${g}, ${b})`;
  },
};
