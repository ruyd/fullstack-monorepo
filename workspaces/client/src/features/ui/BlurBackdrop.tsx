import styled from '@mui/material/styles/styled'

const StyledDiv = styled('div')`
  backdrop-filter: blur(6px);
  position: absolute;
  right: 0;
  left: 0;
`
export function BlurBackdrop({
  height,
  bottom
}: {
  height?: string | number
  bottom?: string | number
}): JSX.Element {
  return (
    <StyledDiv
      style={{
        height: height || '25%',
        bottom: bottom || '5%'
      }}
    />
  )
}
