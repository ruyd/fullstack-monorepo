import { useEffect } from 'react'

import useTheme from '@mui/material/styles/useTheme'
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'
import chartData from './chart-data/bajaj-area-chart'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const BajajAreaChartCard = () => {
  const theme = useTheme()

  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      tooltip: {
        theme: theme.palette.mode
      }
    }
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart)
  }, [theme.palette.mode])

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: theme.palette.secondary.dark }}>
                Bajaj Finery
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: theme.palette.grey[800] }}>
                $1839.00
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ color: theme.palette.grey[800] }}>
            10% Profit
          </Typography>
        </Grid>
      </Grid>
      <Chart {...(chartData as object)} />
    </Card>
  )
}

export default BajajAreaChartCard
