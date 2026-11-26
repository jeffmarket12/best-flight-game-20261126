export class InputHandler {
  constructor(canvas) {
    this.keys = {};
    this.mouse = { x: 0, y: 0, active: false };
    this.canvas = canvas;

    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / canvas.clientWidth - 0.5;
      const ny = (e.clientY - rect.top) / canvas.clientHeight - 0.5;
      this.mouse.x = nx * 2;
      this.mouse.y = ny * 2;
      this.mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });
  }

  isDown(code) {
    return !!this.keys[code];
  }
}
