/* eslint-disable @typescript-eslint/no-unused-vars */
import { AttachMoney, MonetizationOn, RemoveRedEye, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Dialog,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Moment from 'react-moment'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import Spacer from '../ui/Spacer'
import { actions } from './slice'

export function Details() {
  const dispatch = useAppDispatch()
  const show = useAppSelector(state => state.canvas.showDetails)
  const item = useAppSelector(state => state.canvas.active)
  const close = () => dispatch(actions.patch({ showDetails: false }))
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MonetizationOn />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Switch value={item?.sell} checkedIcon={<AttachMoney />} />}
            label="Monetize"
          />
          <FormControlLabel
            control={<Switch value={item?.private} checkedIcon={<VisibilityOff />} />}
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
