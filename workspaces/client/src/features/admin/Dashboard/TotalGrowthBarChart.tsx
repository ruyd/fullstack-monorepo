import { useState, useEffect } from 'react'

import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'
import SkeletonTotalGrowthBarChart from '../../ui/Card/Skeleton/TotalGrowthBarChart'
import MainCard from '../../ui/Card'
import { gridSpacing } from '../../../shared/constant'
import chartData from './chart-data/total-growth-bar-chart'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
]

const TotalGrowthBarChart = ({ isLoading }: { isLoading: boolean }) => {
  const [value, setValue] = useState('today')
  // const theme = useTheme()

  useEffect(() => {
    const newChartData = {
      ...chartData?.options
    }

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData)
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">$2,324.00</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField
                    id="standard-select-currency"
                    select
                    value={value}
                    onChange={e => setValue(e.target.value)}
                  >
                    {status.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...(chartData as object)} />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  )
}

export default TotalGrowthBarChart
