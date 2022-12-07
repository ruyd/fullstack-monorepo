import { AttachMoney, MonetizationOn, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Dialog,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Moment from 'react-moment'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { Drawing } from '../../../../lib/src/types'
import { Method, notify, request } from '../app'
import { actions } from './slice'

export function Details() {
  const dispatch = useAppDispatch()
  const show = useAppSelector(state => state.canvas.showDetails)
  const item = useAppSelector(state => state.canvas.active)
  const close = () => dispatch(actions.patch({ showDetails: false }))
  const update = async (id?: string, field?: string, value?: unknown) => {
    const response = await request<Drawing>('/drawing', { id, field, value }, Method.PATCH)
    dispatch(actions.onSave(response.data))
    dispatch(notify(response.status === 200 ? 'Properties updated' : 'Error updating properties'))
  }

  return (
    <Dialog open={!!show} onClose={close}>
      <Box
        sx={{
          m: '1rem 2rem 3rem 2rem',
        }}
      >
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center', mb: '1rem' }}>
          {item?.name}
        </Typography>
        <FormGroup>
          <TextField
            label="Price"
            placeholder="0.00"
            type="number"
            variant="filled"
            sx={{ my: 2 }}
            value={item?.price || 0}
            onChange={e => update(item.id, 'price', Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOn />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Switch
                onChange={e => update(item.id, 'sell', e.target.checked)}
                checked={!!item?.sell}
                checkedIcon={<AttachMoney />}
              />
            }
            label="Monetize"
          />
          <FormControlLabel
            control={
              <Switch
                name="private"
                onChange={e => update(item.id, 'private', e.target.checked)}
                checked={!!item?.private}
                checkedIcon={<VisibilityOff />}
              />
            }
            label="Don't show in gallery"
          />

          <Typography
            sx={{
              color: 'text.secondary',
              marginTop: '1rem',
              lineHeight: 1.5,
              fontWeight: 400,
              fontSize: '0.75rem',
              textAlign: 'right',
            }}
          >
            Modified:&nbsp;
            <Moment fromNow>{item.updatedAt}</Moment>
          </Typography>
        </FormGroup>
      </Box>
    </Dialog>
  )
}

export default Details
