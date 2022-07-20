import CircularProgress from '@mui/material/CircularProgress'
import { useAppSelector } from '../../shared/store'

export default function LoadingCanvas() {
  const loading = useAppSelector((store) => store.canvas.loading)
  return (
    <>
      <CircularProgress
        className={`${loading ? '' : 'invisible'}`}
        sx={{ position: 'absolute', left: '50%', top: '50%' }}
      />
    </>
  )
}
