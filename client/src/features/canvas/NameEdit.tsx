import { Container, styled, TextField } from '@mui/material'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store'
import { actions } from './slice'
import { saveAsync } from './thunks'

const ContainerStyled = styled(Container)({
  position: 'absolute',
  top: '10%',
  left: '20%',
})

export default function NameEdit({
  inputRef,
  save,
}: {
  inputRef: React.RefObject<HTMLInputElement>
  save: () => void
}) {
  const active = useAppSelector((state) => state.canvas?.active)
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
    <ContainerStyled>
      <TextField
        autoFocus
        accessKey="N"
        inputRef={inputRef}
        value={active?.name || ''}
        onChange={onNameChange}
        key={`${active.id}-${active.createdAt}`}
        onKeyUp={onKeyUp}
      />
    </ContainerStyled>
  )
}
