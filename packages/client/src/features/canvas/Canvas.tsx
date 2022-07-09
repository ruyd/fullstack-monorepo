import React, { useEffect } from 'react'
import { Fab, Stack } from '@mui/material'
import { useCanvas } from './CanvasContext'

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    finishDrawing,
    draw,
    saveCanvas,
    clearCanvas,
  } = useCanvas()

  useEffect(() => {
    prepareCanvas()
  }, [prepareCanvas])

  return (
    <>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <Stack sx={{ position: 'absolute', right: '1rem', bottom: '10%' }}>
        <Fab onClick={clearCanvas}>Clear</Fab>
        <Fab onClick={saveCanvas}>Save</Fab>
      </Stack>
    </>
  )
}
