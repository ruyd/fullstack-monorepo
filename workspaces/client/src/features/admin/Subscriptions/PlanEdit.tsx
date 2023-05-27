import { PaymentSource, PaymentSources, SubscriptionPlan } from '@lib'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import useTheme from '@mui/material/styles/useTheme'
import { Theme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  }
}

const intervals = ['Daily', 'Weekly', 'Monthly', '3 months', '6 months', 'Yearly']
export default function PlanEdit({
  item,
  setState
}: {
  item?: SubscriptionPlan
  setState?: React.SetStateAction<unknown>
}): JSX.Element {
  const theme = useTheme()
  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // const data = new FormData(e.currentTarget)
  }
  // get products which contain prices/intervals

  const handleMapChange = function (source: string, field: string, value: unknown) {
    if (typeof setState === 'function') {
      setState({
        ...item,
        mappings: {
          ...item?.mappings,
          [source]: { ...item?.mappings[source as PaymentSource], [field]: value }
        }
      })
    }
  }

  const [personName, setPersonName] = React.useState<string[]>([])

  const handleMenuChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value }
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box component="form" sx={{}} onSubmit={submitHandler} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                required
                fullWidth
                id="name"
                name="name"
                label="Name"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="amount"
                name="amount"
                label="Price"
                autoComplete="off"
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                <InputLabel id="interval-label">Interval</InputLabel>
                <Select
                  value={personName}
                  onChange={handleMenuChange}
                  input={<OutlinedInput />}
                  renderValue={selected => {
                    if (selected.length === 0) {
                      return <em>Interval</em>
                    }

                    return selected.join(', ')
                  }}
                  MenuProps={MenuProps}
                  labelId="interval-label"
                  inputProps={{ 'aria-label': 'interval' }}
                >
                  <MenuItem disabled value="">
                    <em>Interval</em>
                  </MenuItem>
                  {intervals.map(name => (
                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Subscription Providers</Typography>
            </Box>
            <Grid container>
              <Grid item xs={1}>
                <Typography variant="subtitle1">Provider</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1">Product ID</Typography>
              </Grid>
            </Grid>
            {Object.keys(PaymentSources).map(source => (
              <Grid container key={source}>
                <Grid item xs={1}>
                  {source}{' '}
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    value={item?.mappings[source as PaymentSource]?.productId || ''}
                    onChange={e => handleMapChange(source, 'productId', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        value={item?.mappings[source as PaymentSource]?.enabled}
                        onChange={e => handleMapChange(source, 'enabled', e.target.value)}
                      />
                    }
                    label="Enabled"
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
