import { styled } from '@mui/system'
import react from './images/react.svg'
import ts from './images/ts.svg'
import redux from './images/redux.svg'
import query from './images/query.svg'
import sequelize from './images/sequelize.svg'
import nodejs from './images/nodejs.svg'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'

const h = 80
const w = 80

const Logo = styled('img')({
  height: h,
  width: w
})

const logos = [
  ['TypeScript', ts],
  ['React', react],
  ['React Query', query],
  ['Redux Toolkit', redux],
  ['Sequelize', sequelize],
  ['NodeJS', nodejs]
]

const StyledCard = styled(Card)({
  borderRadius: '14px',
  transition: 'all .2s ease-in-out',
  ':hover': {
    transform: 'scale(0.97)'
  }
})

export default function Logos() {
  return (
    <Box sx={{ margin: '5rem' }}>
      <Typography variant="h4" align="center" mb=".5rem" sx={{ fontWeight: 700 }}>
        Frontend and Backend Monorepo
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {logos.map((l, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StyledCard variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {l[0]}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Logo src={l[1]} alt={l[0]} title={l[0]} height={h} width={w} />
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
