import { styled } from '@mui/system'
import react from './images/react.svg'
import ts from './images/ts.svg'
import redux from './images/redux.svg'
import query from './images/query.svg'
import sequelize from './images/sequelize.svg'
import nodejs from './images/nodejs.svg'
import { Box, Grid, Typography } from '@mui/material'

const Logo = styled('img')({
  height: 80,
})

const logos = [
  ['TypeScript', ts],
  ['React', react],
  ['React Query', query],
  ['Redux Toolkit', redux],
  ['Sequelize', sequelize],
  ['NodeJS', nodejs],
]

export default function Logos() {
  return (
    <Box sx={{ margin: '6rem 0 0 0' }}>
      <Typography variant="body1" align="center" mb=".5rem">
        Made with
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {logos.map((l) => (
          <Grid item key={l[0]}>
            <Logo src={l[1]} alt={l[0]} title={l[0]} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
