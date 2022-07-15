import { ActionType, DrawAction } from '@root/lib'
import { createOffscreen } from './helpers'

export type WorkMessage = {
  buffer: DrawAction[]
  width: number
  height: number
  dpr: number
}

const w = self as Window & typeof globalThis

function processHistory({ buffer, width, height, dpr }: WorkMessage) {
  const background = createOffscreen(width, height, dpr)
  if (!background) {
    return
  }

  buffer.forEach(({ t, x, y }) => {
    if (t === ActionType.Open) {
      background.beginPath()
    }
    if ([ActionType.Open, ActionType.Stroke].includes(t)) {
      background.lineTo(x as number, y as number)
      background.stroke()
    }
    if (t === ActionType.Close) {
      background.closePath()
    }
  })

  const data = background.getImageData(0, 0, width, height)
  try {
    w.postMessage(data, {})
  } catch (err: unknown) {
    console.error(err)
    w.postMessage(data, 'worker')
  }
}

w.onmessage = ({ data }: { data: WorkMessage }) => {
  processHistory(data)
}

export {}
