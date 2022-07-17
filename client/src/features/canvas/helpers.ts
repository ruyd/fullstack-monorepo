import { Drawing } from '@root/lib'
import config from '../../shared/config'

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

export async function generateThumbnail(
  canvas: HTMLCanvasElement,
  width = config.thumbnails.width,
  height = config.thumbnails.width
): Promise<string> {
  const data = canvas.toDataURL()
  const img = new Image(canvas.width, canvas.height)
  img.src = data
  img.height = width
  img.width = height

  const srcAsync = (): Promise<string> =>
    new Promise((resolve) => {
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
    id: 'draft',
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
  active.history.forEach((h) => {
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
