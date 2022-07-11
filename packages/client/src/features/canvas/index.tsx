import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { saveAsync } from './thunks'
import { debounce, Fab, Stack, TextField } from '@mui/material'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import Items from './Items'
import { generateThumbnail, getDraft } from './helpers'
import { Canvas } from './Canvas'
import Color from './Color'
import Player from './Player'

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

  const clearCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    buffer.current = []
    bufferId.current = null
  }, [])

  const newHandler = React.useCallback(() => {
    clearCanvas()
    const active = getDraft()
    dispatch(actions.patch({ active }))
  }, [clearCanvas, dispatch])

  const saveCanvas = React.useCallback(async () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    const payload = {
      history: buffer.current,
      thumbnail: await generateThumbnail(canvas),
    }
    const result = await dispatch(saveAsync(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('saved')
    }
  }, [dispatch])

  const renderHistory = React.useCallback(() => {
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
      renderHistory()
    })
  }, [id, history, renderHistory, clearCanvas])

  return (
    <>
      <Canvas canvasRef={canvasRef} contextRef={contextRef} record={record} />
      <Color />
      <Stack sx={{ position: 'absolute', right: '1rem', bottom: '10%' }}>
        <TextField
          inputRef={nameRef}
          defaultValue={name}
          onChange={debounce(onNameChange, 400)}
          key={`${id}${name}`}
        />
        <Fab onClick={newHandler}>New</Fab>
        <Fab onClick={clearCanvas}>Clear</Fab>
        <Fab onClick={saveCanvas}>Save</Fab>
      </Stack>
      <LoadingCanvas />
      <Player buffer={buffer} />
      <Items />
    </>
  )
}
