export function createBounds() {
  return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
}

type Bounds = ReturnType<typeof createBounds>;

/*
  by default, canvas rendering is blurry on high-dpi screens.
  this fixes it by scaling the pixel buffer by the devicePixelRatio
  and then setting a matching transform so that the drawing coords
  can stay in CSS pixels.

  see also: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
*/
export function scaleAndObserveCanvasSize(ctx: CanvasRenderingContext2D, bounds: Bounds) {
  const { canvas } = ctx;

  function updateCanvasSize() {
    const { x, y, width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bounds.x = x;
    bounds.y = y;
    bounds.width = width;
    bounds.height = height;
    bounds.centerX = width / 2;
    bounds.centerY = height / 2;
  }

  updateCanvasSize();
  new ResizeObserver(updateCanvasSize).observe(canvas);
}
