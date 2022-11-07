import { Container, Slider, styled } from '@mui/material'
import config from '../../shared/config'
import { useAppDispatch, useAppSelector } from 'src/shared/store'
import { actions } from './slice'

const ContainerStyled = styled(Container)({
  position: 'absolute',
  bottom: '3%',
  left: '20%',
  width: '70%',
})

export default function LineSize() {
  const activeSize = useAppSelector(state => state.canvas.size)
  const dispatch = useAppDispatch()
  const onSize = (e: Event, v: number | number[]) => dispatch(actions.patch({ size: v as number }))
  return (
    <ContainerStyled>
      <Slider
        value={activeSize || config.defaultLineSize}
        onChange={onSize}
        min={1}
        max={100}
        valueLabelDisplay="auto"
        title="Line size"
      />
    </ContainerStyled>
  )
}
