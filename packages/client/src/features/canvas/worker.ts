import { ActionType, DrawAction } from '@root/lib'
import { createOffscreen } from './helpers'

export type WorkMessage = {
  buffer: DrawAction[]
  width: number
  height: number
  dpr: number
}

function processHistory({ buffer, width, height, dpr }: WorkMessage) {
  console.log('processing history')
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
  /* eslint-disable-next-line no-restricted-globals */
  self.postMessage(data)
}

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = ({ data }: { data: WorkMessage }) => {
  processHistory(data)
}

export {}