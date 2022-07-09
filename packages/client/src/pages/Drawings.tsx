import { CanvasProvider } from '../features/canvas/CanvasContext'
import { Canvas } from '../features/canvas/Canvas'

export default function Drawings() {
  return (
    <div>
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </div>
  )
}
