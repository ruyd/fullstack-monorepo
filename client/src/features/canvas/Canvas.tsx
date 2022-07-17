import React from 'react'

import { ActionType } from '@root/lib'
import { adjustResolution } from './helpers'

export function Canvas({
  canvasRef,
  contextRef,
  record,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>
  record: (t: ActionType, x?: number, y?: number) => void
}) {
  console.log('canvas')
  const isDrawing = React.useRef<boolean>(false)

  const draw = React.useCallback(
    (offsetX: number, offsetY: number, hist = false) => {
      if (!contextRef?.current) {
        return
      }
      contextRef.current.lineTo(offsetX, offsetY)
      contextRef.current.stroke()
      if (!hist) {
        record(ActionType.Stroke, offsetX, offsetY)
      }
    },
    [contextRef, record]
  )

  const startDrawing = (offsetX: number, offsetY: number) => {
    if (!contextRef.current || !canvasRef.current) {
      return
    }
    contextRef.current.beginPath()
    contextRef.current.lineTo(offsetX + 1, offsetY + 1)
    contextRef.current.stroke()
    isDrawing.current = true
    canvasRef.current.style.cursor = 'crosshair'
    record(ActionType.Open, offsetX + 1, offsetY + 1)
  }

  const finishDrawing = () => {
    if (!contextRef.current || !canvasRef.current) {
      return
    }
    contextRef.current.closePath()
    isDrawing.current = false
    canvasRef.current.style.cursor = 'default'
    record(ActionType.Close)
    if (!contextRef.current) {
      return
    }
  }

  //Events
  const onMouseStart = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent
    startDrawing(offsetX, offsetY)
  }

  const onMouseMove = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    if (!isDrawing.current || !contextRef?.current) {
      return
    }
    const { offsetX, offsetY } = nativeEvent
    draw(offsetX, offsetY)
  }

  const touchStart = (e: React.TouchEvent) => {
    if (e.touches?.length > 1) return
    const offsetX = e.touches[0].clientX
    const offsetY = e.touches[0].clientY
    startDrawing(offsetX, offsetY)
  }

  const touchMove = (e: React.TouchEvent) => {
    if (e.touches?.length > 1) return
    const offsetX = e.touches[0].clientX
    const offsetY = e.touches[0].clientY
    draw(offsetX, offsetY)
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    canvas.width = window.innerWidth - 20
    canvas.height = window.innerHeight - 80
    adjustResolution(canvas)

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5

    contextRef.current = context
  }, [canvasRef])

  return (
    <>
      <canvas
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={finishDrawing}
        onMouseDown={onMouseStart}
        onMouseUp={finishDrawing}
        onMouseMove={onMouseMove}
        ref={canvasRef}
      />
    </>
  )
}
