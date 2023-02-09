/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Grid,
  TextField,
  Button,
  Box,
  Radio,
  ToggleButton,
  Switch,
  FormControlLabel,
  FormGroup,
  Paper,
  List,
  ListItem,
  Select,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material'
import { PaymentSources, SubscriptionPlan, User } from '@lib'
import { Delete } from '@mui/icons-material'

export default function PlanEdit({
  item,
  setState,
}: {
  item?: SubscriptionPlan
  setState?: React.SetStateAction<unknown>
}): JSX.Element {
  const submitHandler = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
  }
  const newHandler = function (e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (typeof setState === 'function') {
      setState({
        ...item,
        mappings: [...(item?.mappings || []), { source: PaymentSources.Stripe, productId: '123' }],
      })
    }
  }
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
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
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Paper sx={{ padding: 2, background: 'unset' }} variant="outlined">
              <FormGroup sx={{ alignItems: 'center' }}>
                <FormControlLabel
                  control={<Switch value={item?.enabled as boolean} />}
                  label="Enabled"
                />
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item>
            <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Product Mappings</Typography>
              <Button variant="outlined" onClick={newHandler}>
                Add New
              </Button>
            </Box>
            <List>
              {item?.mappings?.map((mapping, index) => (
                <ListItem key={index}>
                  <Select label="Source" fullWidth>
                    {Object.keys(PaymentSources).map(source => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField fullWidth value={mapping.productId} />
                  <IconButton>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
