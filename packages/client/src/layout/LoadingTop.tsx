import LinearProgress from '@mui/material/LinearProgress'
import { useAppSelector } from '../shared/store'

export default function LoadingTop() {
  const loading = useAppSelector((store) => store.app.loading)
  return <LinearProgress className={`${loading ? '' : 'invisible'}`} />
}
