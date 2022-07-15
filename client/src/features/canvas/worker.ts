import { ActionType, DrawAction } from '@root/lib'
import { createOffscreen } from './helpers'

export type WorkMessage = {
  buffer: DrawAction[]
  width: number
  height: number
  dpr: number
}

const w = self as Window & typeof globalThis

function processHistory(
  { buffer, width, height, dpr }: WorkMessage,
  source?: MessageEventSource
) {
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
    console.log(source)
    w?.postMessage(data, 'render')
  } catch (err: unknown) {
    console.error(err)
    // eslint-disable-next-line no-debugger
    debugger
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
w.onmessage = ({ data, ev }: { data: WorkMessage; ev?: MessageEvent<any> }) => {
  processHistory(data, ev?.ports[0])
}

export {}
