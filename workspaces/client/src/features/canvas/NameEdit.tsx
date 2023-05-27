import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

const FieldStyled = styled(TextField)({
  position: 'absolute',
  top: '10%',
  left: '20%'
})

export default function NameEdit({
  inputRef,
  save
}: {
  inputRef: React.RefObject<HTMLInputElement>
  save: () => void
}) {
  const active = useAppSelector(state => state.canvas?.active)
  const dispatch = useAppDispatch()
  const onNameChange = React.useCallback(
    (e: { target: { value: string } }) => {
      dispatch(actions.patchActive({ name: e.target.value }))
    },
    [dispatch]
  )
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      save()
    }
  }
  return (
    <FieldStyled
      variant="standard"
      autoFocus={active.drawingId === 'draft'}
      accessKey="N"
      inputRef={inputRef}
      value={active?.name || ''}
      onChange={onNameChange}
      key={`${active.drawingId}-${active.createdAt}`}
      onKeyUp={onKeyUp}
    />
  )
}
