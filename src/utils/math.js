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
};
