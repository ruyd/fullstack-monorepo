import React from 'react'

import { ActionType } from '@root/lib'

export function Canvas({
  canvasRef,
  contextRef,
  record,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>
  contextRef: React.RefObject<CanvasRenderingContext2D>
  record: (t: ActionType, x?: number, y?: number) => void
}) {
  const isDrawing = React.useRef<boolean>(false)

  const startDrawing = (offsetX: number, offsetY: number) => {
    if (!contextRef.current) {
      return
    }
    contextRef.current.beginPath()
    contextRef.current.lineTo(offsetX + 1, offsetY + 1)
    contextRef.current.stroke()
    isDrawing.current = true
    record(ActionType.Open, offsetX + 1, offsetY + 1)
  }

  const finishDrawing = () => {
    if (!contextRef.current) {
      return
    }
    contextRef.current.closePath()
    isDrawing.current = false
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

  const onDraw = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    if (!isDrawing.current || !contextRef?.current) {
      return
    }
    const { offsetX, offsetY } = nativeEvent
    draw(offsetX, offsetY)
  }

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
    []
  )

  return (
    <>
      <canvas
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={finishDrawing}
        onMouseDown={onMouseStart}
        onMouseUp={finishDrawing}
        onMouseMove={onDraw}
        ref={canvasRef}
      />
    </>
  )
}
