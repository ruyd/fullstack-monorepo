import React, {
  useContext,
  useRef,
  createContext,
  PropsWithChildren,
  RefObject,
} from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { saveAsync } from './thunks'

export type CanvasContextType = {
  canvasRef: RefObject<HTMLCanvasElement>
  contextRef: RefObject<CanvasRenderingContext2D>
  prepareCanvas: () => void
  startDrawing: (e: React.MouseEvent<HTMLElement>) => void
  finishDrawing: () => void
  clearCanvas: () => void
  saveCanvas: () => void
  draw: (e: { nativeEvent: MouseEvent }) => void
}

const CanvasContext = createContext<CanvasContextType>({} as CanvasContextType)

export const CanvasProvider = ({ children }: PropsWithChildren<{}>) => {
  const dispatch = useAppDispatch()
  const current = useAppSelector((state) => state.canvas.current)
  const isDrawing = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const history = useRef<{ x: number; y: number }[]>(current.history || [])

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
    history.current.push({ x: offsetX + 1, y: offsetY + 1 })
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

  const draw = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    if (!isDrawing.current || !contextRef?.current) {
      return
    }
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
    history.current.push({ x: offsetX + 1, y: offsetY + 1 })
  }

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
    const result = await dispatch(saveAsync(history.current))
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('saved')
    }
  }

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
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => useContext(CanvasContext)
