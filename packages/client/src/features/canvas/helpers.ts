export function adjustResolution(canvas: HTMLCanvasElement) {
  if (!canvas) {
    return
  }

  const dpr = window.devicePixelRatio
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.getContext('2d')?.scale(dpr, dpr)
  //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
}

export function adjustOffscreenResolution(
  canvas: OffscreenCanvas,
  width: number,
  height: number,
  dpr: number
) {
  if (!canvas) {
    return
  }
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.getContext('2d')?.scale(dpr, dpr)
}

export function createOffscreen(width: number, height: number, dpr: number) {
  const offline = new OffscreenCanvas(width, height)
  adjustOffscreenResolution(offline, width, height, dpr)
  const context = offline.getContext('2d') as OffscreenCanvasRenderingContext2D
  if (!context) {
    return
  }
  context.lineWidth = 5
  return context
}
