import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType, Drawing } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { deleteAsync, loadAsync, saveAsync } from './thunks'
import { debounce, Fab, Stack, TextField } from '@mui/material'
import { useCallback } from 'react'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import Items from './Items'
import {
  adjustResolution,
  generateThumbnail,
  getDraft,
  isEmptyCanvas,
} from './helpers'

export default function CanvasWrapper() {
  const dispatch = useAppDispatch()
  const history = useAppSelector((state) => state.canvas?.active?.history)
  const name = useAppSelector((state) => state.canvas?.active?.name)
  const id = useAppSelector((state) => state.canvas?.active?.id)
  const brush = useAppSelector((state) => state.canvas?.brush)
  const isDrawing = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const buffer = useRef<DrawAction[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const workerRef = useRef<Worker | null>(null)

  const record = (t: ActionType, x?: number, y?: number) => {
    const w = contextRef.current?.lineWidth
    const st = contextRef.current?.strokeStyle as string
    buffer.current = [...buffer.current, { x, y, t, w, st }]
  }

  const startDrawing = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    const { offsetX, offsetY } = nativeEvent
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

  const newCanvas = () => {
    const active = getDraft()
    dispatch(actions.patch({ active }))
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    buffer.current = []
  }

  const saveCanvas = async () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const payload: {
      history: DrawAction[]
      name?: string
      thumbnail?: string
    } | null = {
      history: buffer.current,
    }
    if (nameRef.current?.value) {
      payload.name = nameRef.current.value
    }
    payload.thumbnail = await generateThumbnail(canvas)
    const result = await dispatch(saveAsync(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('saved')
    }
  }

  const processHistory = React.useCallback(() => {
    if (!canvasRef.current || !contextRef.current) {
      return
    }

    //Lazy worker
    if (!workerRef.current) {
      const worker = new Worker(new URL('./worker.ts', import.meta.url))
      worker.onmessage = (e) => {
        if (!contextRef.current) {
          console.error('no context for result')
        }
        contextRef.current?.putImageData(e.data, 0, 0)
        dispatch(actions.patch({ loading: false }))
      }
      workerRef.current = worker
    }

    //Worker rendering
    dispatch(actions.patch({ loading: true }))

    //Resizing support
    const { width, height } = canvasRef.current.getBoundingClientRect()
    workerRef.current.postMessage({
      buffer: buffer.current,
      width,
      height,
      dpr: window.devicePixelRatio,
    })
  }, [dispatch])

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    canvas.width = window.innerWidth - 20
    canvas.height = window.innerHeight - 80

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    adjustResolution(canvas)
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5

    contextRef.current = context
  }, [])

  React.useEffect(() => {
    dispatch(loadAsync())
    prepareCanvas()
  }, [dispatch, prepareCanvas])

  React.useEffect(() => {
    console.log('onItemChanged', id, history.length, buffer.current.length)
    if (!id) {
      clearCanvas()
      return
    }
    buffer.current = history
    if (isEmptyCanvas(canvasRef.current as HTMLCanvasElement)) {
      startTransition(() => {
        processHistory()
      })
    }
  }, [id, history, processHistory])

  return (
    <>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={onDraw}
        ref={canvasRef}
      />
      <Stack sx={{ position: 'absolute', right: '1rem', bottom: '10%' }}>
        <TextField
          inputRef={nameRef}
          defaultValue={name}
          key={id}
          onChange={debounce(saveCanvas, 1000)}
        />
        <Fab onClick={newCanvas}>New</Fab>
        <Fab onClick={clearCanvas}>Clear</Fab>
        <Fab onClick={saveCanvas}>Save</Fab>
      </Stack>
      <LoadingCanvas />
      <Items />
    </>
  )
}
