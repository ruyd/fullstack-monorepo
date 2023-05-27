import React, { useRef, startTransition } from 'react'
import { DrawAction, ActionType, Drawing } from '@lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { getAsync, saveAsync } from './thunks'
import LoadingCanvas from './LoadingCanvas'
import { actions } from './slice'
import { patch as patchApp } from '../app'
import Items from './Items'
import { generateThumbnail, getDraft } from './helpers'
import { Canvas } from './Canvas'
import NameEdit from './NameEdit'
import { useNavigate, useParams } from 'react-router-dom'
import { Paths } from '../../shared/routes'
import { Details } from './Details'
import Toolbar from './Toolbar'
import Container from '@mui/material/Container'

export function CanvasContainer() {
  const dispatch = useAppDispatch()
  const authenticated = useAppSelector(state => state.app.token)
  const history = useAppSelector(state => state.canvas?.active?.history)
  const id = useAppSelector(state => state.canvas?.active?.drawingId)
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

  const saveHandler = React.useCallback(async () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }

    if (!authenticated) {
      dispatch(patchApp({ dialog: 'onboard' }))
      return
    }

    const payload = {
      history: buffer.current,
      thumbnail: await generateThumbnail(canvas)
    }
    await dispatch(saveAsync(payload))
  }, [authenticated, dispatch])

  const renderHistory = React.useCallback(() => {
    if (!canvasRef.current || !contextRef.current) {
      return
    }

    //Lazy worker
    if (!workerRef.current) {
      const worker = new Worker(new URL('./worker.ts', import.meta.url))
      worker.onmessage = e => {
        if (!contextRef.current) {
          // eslint-disable-next-line no-console
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
      dpr: window.devicePixelRatio
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
        if ((res?.payload as Drawing)?.drawingId === 'copy') {
          navigate(`${Paths.Draw}`, { replace: true })
        }
      }
    }
    run()
  }, [dispatch, id, navigate, paramId])

  return (
    <Container maxWidth={false} disableGutters sx={{ display: 'flex', flexFlow: 'column' }}>
      <Canvas canvasRef={canvasRef} contextRef={contextRef} record={record} />
      <NameEdit inputRef={nameRef} save={saveHandler} />
      <Toolbar newHandler={newHandler} saveHandler={saveHandler} clearHandler={clearCanvas} />
      <LoadingCanvas />
      <Items sx={{ mb: '1rem' }} />
      <Details />
    </Container>
  )
}

export default CanvasContainer
