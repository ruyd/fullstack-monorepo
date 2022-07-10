import React, { useEffect } from 'react'
import { Fab, Stack, TextField } from '@mui/material'
import { useAppSelector } from '../../shared/store'
import { ActionType, DrawAction } from '@root/lib'

export function Canvas({
  canvasRef,
  contextRef,
  buffer,
  nameRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>
  contextRef: React.RefObject<CanvasRenderingContext2D>
  buffer: React.RefObject<DrawAction[]>
  nameRef: React.RefObject<HTMLInputElement>
}) {
  const history = useAppSelector((state) => state.canvas?.current?.history)

  const processHistory = React.useCallback(() => {
    console.log('processing history')
    if (history.length !== buffer.current?.length && buffer.current) {
      console.log('setting history')
      //buffer.current = history
    }

    buffer.current?.forEach(({ t, x, y }) => {
      if (t === ActionType.Open) {
        contextRef.current?.beginPath()
      }
      if ([ActionType.Open, ActionType.Stroke].includes(t)) {
        // draw(x as number, y as number, true)
      }
      if (t === ActionType.Close) {
        contextRef.current?.closePath()
      }
    })
  }, [history])

  const prepareCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const w = window.innerWidth - 20
    const h = window.innerHeight - 80

    canvas.width = w
    canvas.height = h
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    //context.scale(2, 2)
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5

    //contextRef.current = context
  }, [])

  return <></>
}
