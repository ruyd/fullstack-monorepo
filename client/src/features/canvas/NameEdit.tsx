import { TextField, debounce } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'

export default function NameEdit({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>
}) {
  const active = useAppSelector((state) => state.canvas?.active)
  const dispatch = useAppDispatch()
  const onNameChange = React.useCallback(
    (e: { target: { value: string } }) => {
      dispatch(actions.patchActive({ name: e.target.value }))
    },
    [dispatch]
  )

  return (
    <TextField
      inputRef={inputRef}
      defaultValue={active?.name}
      onChange={debounce(onNameChange, 100)}
      key={`${active.id}-${active.createdAt}`}
    />
  )
}
