import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType, Drawing } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { getAsync, saveAsync } from './thunks'
import { Box, Container, Fab, Stack } from '@mui/material'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import Items from './Items'
import { generateThumbnail, getDraft } from './helpers'
import { Canvas } from './Canvas'
import Color from './Color'
import NameEdit from './NameEdit'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from 'src/shared/routes'
import LineSize from './LineSize'

export default function CanvasControl() {
  const dispatch = useAppDispatch()
  const history = useAppSelector((state) => state.canvas?.active?.history)
  const id = useAppSelector((state) => state.canvas?.active?.id)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const buffer = useRef<DrawAction[]>([])
  const bufferId = useRef<string | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const { id: paramId } = useParams()
  const navigate = useNavigate()

  const record = React.useCallback((t: ActionType, x?: number, y?: number) => {
    const w = contextRef.current?.lineWidth
    const c = contextRef.current?.strokeStyle as string
    const ts = new Date().getTime()
    buffer.current = [...buffer.current, { x, y, t, w, c, ts }]
  }, [])

  const clearCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    buffer.current = []
    bufferId.current = null
    navigate(`${Paths.Draw}`, { replace: true })
  }, [navigate])

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
    await dispatch(saveAsync(payload))
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

    //Resizing, retina support
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
    if (id === 'draft') {
      clearCanvas()
      return
    }

    if (bufferId.current !== id) {
      const savedDraft = bufferId.current === 'draft' && !!id && id !== 'draft'
      bufferId.current = id as string
      if (savedDraft) {
        return
      }
      buffer.current = history
    } else {
      return
    }

    startTransition(() => {
      renderHistory()
    })
  }, [id, history, renderHistory, clearCanvas])

  React.useEffect(() => {
    async function run() {
      if (paramId && id !== paramId) {
        const res = await dispatch(getAsync(paramId))
        if ((res?.payload as Drawing)?.id === 'copy') {
          navigate(`${Paths.Draw}`, { replace: true })
        }
      }
    }
    run()
  }, [dispatch, id, navigate, paramId])

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ display: 'flex', flexFlow: 'column' }}
    >
      <Canvas canvasRef={canvasRef} contextRef={contextRef} record={record} />
      <NameEdit inputRef={nameRef} save={saveCanvas} />
      <Box sx={{ position: 'absolute', top: '30%', right: '3%' }}>
        <Color />
        <Stack spacing={1} mt="1rem">
          <Fab color="secondary" onClick={newHandler}>
            New
          </Fab>
          <Fab color="secondary" onClick={clearCanvas}>
            Clear
          </Fab>
          <Fab color="secondary" onClick={saveCanvas}>
            Save
          </Fab>
        </Stack>
      </Box>
      <LineSize />
      <LoadingCanvas />
      <Items sx={{ mb: '1rem' }} />
    </Container>
  )
}
