import { ActionType, DrawAction } from '@root/lib'

const processHistory = (
  buffer: DrawAction[],
  width: number,
  height: number
) => {
  console.log('processing history')

  const off = new OffscreenCanvas(width, height)
  const background = off.getContext('2d') as OffscreenCanvasRenderingContext2D

  if (!background) {
    return
  }

  background.lineWidth = 5

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
self.onmessage = ({
  data,
}: {
  data: {
    buffer: DrawAction[]
    width: number
    height: number
  }
}) => {
  processHistory(data.buffer, data.width, data.height)
}

export {}
