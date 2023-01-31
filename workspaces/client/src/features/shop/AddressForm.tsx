import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import debouncer from '../../shared/debouncer'
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { Address } from '../../../../lib/src/types'
import { patch } from './slice'
import { v4 as uuid } from 'uuid'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { DeleteOutline } from '@mui/icons-material'
import { request } from '../app'

const newAddress = () => ({
  addressId: '',
  name: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
})

export default function AddressForm() {
  const items = useAppSelector(store => store.shop.addresses)
  const shippingAddressId = useAppSelector(store => store.shop.shippingAddressId)
  const shippingAddress = items?.find(a => a.addressId === shippingAddressId) || newAddress()

  const [selected, setSelected] = useState<Partial<Address>>(shippingAddress)
  const dispatch = useAppDispatch()

  const resetHandler = () => setSelected(newAddress())

  const save = (item: Address) => {
    if (!item.addressId) {
      item.addressId = uuid()
    }
    const addresses = items?.map(a => (a.addressId === item.addressId ? item : a) as Address) || []
    if (!addresses.find(a => a.addressId === item.addressId)) {
      addresses.push(item as unknown as Address)
    }
    setSelected(item)
    dispatch(patch({ addresses }))
    debouncer('address', () => request('address', item), 1000)
  }

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save(selected as Address)
  }

  const deleteHandler = (item: Address) => {
    const addresses = items?.filter(a => a.addressId !== item.addressId) || []
    dispatch(patch({ addresses }))
    if (selected.addressId === item.addressId) {
      setSelected(addresses.find(a => a.addressId !== item.addressId) || newAddress())
    }
    request('address', { ids: [item.addressId] }, 'delete')
  }

  const favoriteHandler = (item: Address) => {
    const addresses =
      items?.map(a =>
        a.addressId === item.addressId
          ? { ...item, favorite: !item.favorite }
          : { ...a, favorite: false },
      ) || []
    dispatch(patch({ addresses }))
  }

  const editHandler = (item: Address) => {
    setSelected(item)
    dispatch(patch({ shippingAddressId: item.addressId }))
  }

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    save({ ...selected, [name]: value } as Address)
  }

  return (
    <Grid container sx={{ justifyContent: 'center', flex: 1 }} spacing={3}>
      <Grid item xs={12} sm={7}>
        <Box component="form" onSubmit={submitHandler}>
          <Typography variant="h6" gutterBottom>
            Shipping address
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="name"
                name="name"
                label="Recipient Name"
                fullWidth
                autoComplete="given-name"
                variant="standard"
                value={selected.name}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="address1"
                name="address1"
                label="Address line 1"
                fullWidth
                autoComplete="address-line1"
                variant="standard"
                value={selected.address1}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="address2"
                name="address2"
                label="Address line 2"
                autoComplete="address-line2"
                fullWidth
                variant="standard"
                value={selected.address2}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="city"
                name="city"
                label="City"
                autoComplete="address-level2"
                fullWidth
                variant="standard"
                value={selected.city}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="state"
                name="state"
                label="State/Province/Region"
                autoComplete="address-level1"
                fullWidth
                variant="standard"
                value={selected.state}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="zip"
                name="zip"
                label="Zip / Postal code"
                fullWidth
                autoComplete="postal-code"
                variant="standard"
                value={selected.zip}
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="country"
                name="country"
                label="Country"
                fullWidth
                autoComplete="country"
                variant="standard"
                value={selected.country}
                onChange={changeHandler}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              disabled={!selected.name || !selected.address1 || !selected.city || !selected.zip}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Box>
      </Grid>
      {!!items?.length && (
        <Grid item xs={12} sm={5}>
          <Button
            onClick={resetHandler}
            fullWidth
            variant="outlined"
            disabled={!selected.addressId}
          >
            New
          </Button>
          <List sx={{ m: 1 }}>
            {items?.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <ButtonGroup>
                    <IconButton onClick={() => favoriteHandler(item)}>
                      {item.favorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton onClick={() => deleteHandler(item)}>
                      <DeleteOutline />
                    </IconButton>
                  </ButtonGroup>
                }
                sx={{ padding: 2, borderRadius: '1rem' }}
              >
                <ListItemButton
                  centerRipple
                  selected={selected.addressId === item.addressId}
                  sx={{ borderRadius: '1rem' }}
                  onClick={() => editHandler(item)}
                >
                  <ListItemText
                    primary={
                      <>
                        <div>{item.name}</div>
                        <div>{item.address1}</div>
                        <div>{item.address2}</div>
                      </>
                    }
                    secondary={`${item.city} ${item.state} ${item.zip} ${item.country}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      )}
    </Grid>
  )
}
