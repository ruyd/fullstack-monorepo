import { Drawing } from '@lib'
import { config } from '../../shared/config'

export function setBrushDefaults(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
) {
  context.strokeStyle = config.defaultColor
  context.lineWidth = config.defaultLineSize
  context.lineCap = 'round'
  context.lineJoin = 'round'
  //context.miterLimit = 2
}

function setWH(canvas: HTMLCanvasElement, w: number, h: number) {
  const context = canvas.getContext('2d')
  const existing = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height)
  const dpr = window.devicePixelRatio
  canvas.width = w * dpr
  canvas.height = h * dpr
  context?.scale(dpr, dpr)
  //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  if (existing) {
    context?.putImageData(existing, 0, 0)
  }
}

export function adjustToResolution(canvas: HTMLCanvasElement, resize?: boolean) {
  if (!canvas) {
    return
  }
  const min = {
    w: 375,
    h: 667,
  }
  const iw = window.innerWidth - 20
  const ih = window.innerHeight - 95
  const w = iw < min.w ? min.w : iw
  const h = ih < min.h ? min.h : ih
  if ((resize && w < canvas.width) || h < canvas.height) {
    return
  }
  setWH(canvas, w, h)
}

export function adjustOffscreenResolution(
  canvas: OffscreenCanvas,
  width: number,
  height: number,
  dpr: number,
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

  setBrushDefaults(context)

  return context
}

export async function generateThumbnail(
  canvas: HTMLCanvasElement,
  width = config.thumbnails.width,
  height = config.thumbnails.height,
): Promise<string> {
  const data = canvas.toDataURL()
  const img = new Image(canvas.width, canvas.height)
  img.src = data
  img.height = height
  img.width = width

  const srcAsync = (): Promise<string> =>
    new Promise(resolve => {
      img.onload = () => {
        const off = document.createElement('canvas')
        off.width = width
        off.height = height
        const context = off.getContext('2d') as CanvasRenderingContext2D
        context.drawImage(img, 0, 0, width, height)
        const result = context.canvas.toDataURL()
        resolve(result)
      }
    })

  const result = await srcAsync()
  return result
}

export function getDraft() {
  let draft: Drawing = {
    drawingId: 'draft',
    name: 'New Draft',
    history: [],
  }
  const persisted = localStorage.getItem('canvas')
  if (persisted?.includes('{')) {
    draft = JSON.parse(persisted) as Drawing
  }
  return draft
}

export function getCopy(original: Drawing) {
  const active = { ...original, id: 'copy', name: 'Copy' }
  active.createdAt = new Date()
  active.updatedAt = active.createdAt
  const ts = active.createdAt.getTime()
  active.history.forEach(h => {
    h.ts = ts
  })
  return active
}

export function isEmptyCanvas(canvas: HTMLCanvasElement) {
  const blank = document.createElement('canvas')
  blank.width = canvas.width
  blank.height = canvas.height
  return canvas.toDataURL() === blank.toDataURL()
}
