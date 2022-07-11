import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { loadAsync, saveAsync } from './thunks'
import { debounce, Fab, Stack, TextField } from '@mui/material'
import { useCallback } from 'react'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import Items from './Items'
import { adjustResolution, generateThumbnail, getDraft } from './helpers'
import { Canvas } from './Canvas'

export default function CanvasControl() {
  const dispatch = useAppDispatch()
  const history = useAppSelector((state) => state.canvas?.active?.history)
  const name = useAppSelector((state) => state.canvas?.active?.name)
  const id = useAppSelector((state) => state.canvas?.active?.id)
  const brush = useAppSelector((state) => state.canvas?.brush)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const buffer = useRef<DrawAction[]>([])
  const bufferId = useRef<string | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const workerRef = useRef<Worker | null>(null)

  const record = (t: ActionType, x?: number, y?: number) => {
    const w = contextRef.current?.lineWidth
    const st = contextRef.current?.strokeStyle as string
    buffer.current = [...buffer.current, { x, y, t, w, st }]
  }

  const onNameChange = React.useCallback(
    (e: { target: { value: string } }) => {
      dispatch(actions.patchActive({ name: e.target.value }))
    },
    [dispatch]
  )

  const newCanvas = () => {
    clearCanvas()
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
    bufferId.current = null
  }

  const saveCanvas = async () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const payload: {
      history: DrawAction[]
      thumbnail: string
    } = {
      history: buffer.current,
      thumbnail: await generateThumbnail(canvas),
    }
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

  /**
   * onLoad
   */
  React.useEffect(() => {
    dispatch(loadAsync())
    prepareCanvas()
  }, [dispatch, prepareCanvas])

  /**
   * onItemChanged
   */
  React.useEffect(() => {
    if (!id) {
      clearCanvas()
      return
    }

    if (bufferId.current !== id) {
      const afterDraftSave = !bufferId.current && !!id && !history.length
      bufferId.current = id as string
      if (afterDraftSave) {
        return
      }
      buffer.current = history
    } else {
      return
    }

    if (!history.length) {
      return
    }
    startTransition(() => {
      processHistory()
    })
  }, [id, history, processHistory])

  return (
    <>
      <Canvas canvasRef={canvasRef} contextRef={contextRef} record={record} />
      <Stack sx={{ position: 'absolute', right: '1rem', bottom: '10%' }}>
        <TextField
          inputRef={nameRef}
          defaultValue={name}
          onChange={debounce(onNameChange, 400)}
          key={`${id}${name}`}
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
