import React, {
  useContext,
  useRef,
  createContext,
  PropsWithChildren,
  RefObject,
} from 'react'
import { DrawAction } from '@root/lib'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { loadAsync, saveAsync } from './thunks'

export type CanvasContextType = {
  canvasRef: RefObject<HTMLCanvasElement>
  contextRef: RefObject<CanvasRenderingContext2D>
  prepareCanvas: () => void
  startDrawing: (e: React.MouseEvent<HTMLElement>) => void
  finishDrawing: () => void
  clearCanvas: () => void
  saveCanvas: () => void
  draw: (e: { nativeEvent: MouseEvent }) => void
  processHistory: () => void
}

const CanvasContext = createContext<CanvasContextType>({} as CanvasContextType)

export const CanvasProvider = ({ children }: PropsWithChildren<{}>) => {
  const dispatch = useAppDispatch()
  const current = useAppSelector((state) => state.canvas.current)
  const isDrawing = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const history = useRef<DrawAction[]>([])

  const prepareCanvas = () => {
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

    contextRef.current = context
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
    // record(offsetX + 1, offsetY + 1)
  }

  const finishDrawing = () => {
    if (!contextRef.current) {
      return
    }
    contextRef.current.closePath()
    isDrawing.current = false
    if (!contextRef.current) {
      return
    }
  }

  const record = (x: number, y: number) => {
    history.current = [...history.current, { x, y, open: isDrawing.current }]
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
        record(offsetX, offsetY)
      }
    },
    []
  )

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    history.current = []
  }

  const saveCanvas = async () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      return
    }
    console.log('saving canvas')
    const result = await dispatch(saveAsync(history.current))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('saved')
    }
  }
  const processHistory = React.useCallback(() => {
    console.log('processing history')
    if (current.history.length !== history.current.length) {
      console.log('setting history')
      history.current = current.history
    }

    history.current.forEach((action) => {
      if (action.open) {
        contextRef.current?.beginPath()
      } else {
        contextRef.current?.closePath()
      }
      draw(action.x, action.y, true)
    })
  }, [current.history, draw])

  React.useEffect(() => {
    dispatch(loadAsync())
    processHistory()
  }, [draw, current.history, processHistory, dispatch])

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        saveCanvas,
        draw: onDraw,
        processHistory,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => useContext(CanvasContext)
