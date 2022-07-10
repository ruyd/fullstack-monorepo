import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { loadAsync, saveAsync } from './thunks'
import {
  CircularProgress,
  debounce,
  Fab,
  Stack,
  TextField,
} from '@mui/material'
import { useCallback } from 'react'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import Items from './Items'

export default function CanvasWrapper() {
  const dispatch = useAppDispatch()
  const history = useAppSelector((state) => state.canvas?.current?.history)
  const name = useAppSelector((state) => state.canvas?.current?.name)
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
    (offsetX: number, offsetY: number, hist: boolean = false) => {
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

  const scale = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    // Get the DPR and size of the canvas
    var dpr = window.devicePixelRatio
    var rect = canvas.getBoundingClientRect()

    // Set the "actual" size of the canvas
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    // Scale the context to ensure correct drawing operations
    canvas.getContext('2d')?.scale(dpr, dpr)

    // Set the "drawn" size of the canvas
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
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

    const payload: { history: DrawAction[]; name?: string } | null = {
      history: buffer.current,
    }
    if (nameRef.current?.value) {
      payload.name = nameRef.current.value
    }
    const result = await dispatch(saveAsync(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('saved')
    }
  }

  const processHistory = React.useCallback(() => {
    console.log('processing history')
    if (!canvasRef.current) {
      return
    }

    if (history.length !== buffer.current.length) {
      console.log('setting history')
      buffer.current = history
    }

    if (!workerRef.current) {
      const worker = new Worker(
        new URL('../../shared/worker.ts', import.meta.url)
      )
      worker.onmessage = (e) => {
        contextRef.current?.putImageData(e.data, 0, 0)
        dispatch(actions.patch({ loading: false }))
      }
      workerRef.current = worker
    }

    contextRef.current?.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )

    dispatch(actions.patch({ loading: true }))
    workerRef.current.postMessage({
      buffer: buffer.current,
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    })
  }, [history, draw, dispatch])

  const prepareCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const w = window.innerWidth - 20
    const h = window.innerHeight - 80

    canvas.width = w
    canvas.height = h

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5

    contextRef.current = context
  }, [])

  React.useEffect(() => {
    console.log('loading items and prep')
    dispatch(loadAsync())
    prepareCanvas()
  }, [dispatch, prepareCanvas])

  React.useEffect(() => {
    startTransition(() => {
      processHistory()
    })
  }, [history, processHistory])

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
          onChange={debounce(saveCanvas, 1000)}
        />
        <Fab onClick={processHistory}>New</Fab>
        <Fab onClick={clearCanvas}>Clear</Fab>
        <Fab onClick={saveCanvas}>Save</Fab>
      </Stack>
      <LoadingCanvas />
      <Items />
    </>
  )
}
