import { ActionType, DrawAction } from '@root/lib'
import { createOffscreen } from './helpers'

export type WorkMessage = {
  buffer: DrawAction[]
  width: number
  height: number
  dpr: number
  stopAt?: number
  stream?: boolean
}

const w = self as Window & typeof globalThis

function send(
  background: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number
) {
  try {
    const data = background.getImageData(0, 0, width, height)
    // eslint-disable-next-line
    w?.postMessage(data)
  } catch (err: unknown) {
    console.error(err)
  }
}

function processHistory({
  buffer,
  width,
  height,
  dpr,
  stream,
  stopAt,
}: WorkMessage) {
  const background = createOffscreen(width, height, dpr)
  if (!background) {
    return
  }

  let i = 0
  for (const { t, x, y, c, w } of buffer) {
    if (c) {
      background.strokeStyle = c
    }
    if (w) {
      background.lineWidth = w
    }
    if (t === ActionType.Open) {
      background.beginPath()
    }
    if ([ActionType.Open, ActionType.Stroke].includes(t)) {
      background.lineTo(x as number, y as number)
      background.stroke()
    }
    if (t === ActionType.Close) {
      background.closePath()
      if (stream) {
        send(background, width, height)
      }
    }
    if (stopAt === i) {
      return
    }
    i += 1
  }
  send(background, width, height)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
w.onmessage = ({ data }: { data: WorkMessage; ev?: MessageEvent<any> }) => {
  processHistory(data)
}

export {}
