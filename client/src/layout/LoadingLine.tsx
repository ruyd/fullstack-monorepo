import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { useAppSelector } from '../shared/store'

export default function LoadingLine() {
  const loading = useAppSelector((store) => store.app.loading)
  return (
    <LinearProgress
      className={`${loading ? '' : 'invisible'}`}
      sx={{ height: '1.2px' }}
    />
  )
}
