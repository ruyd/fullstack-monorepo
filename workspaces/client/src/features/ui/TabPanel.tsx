import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface TabPanelProps {
  children?: React.ReactNode
  index?: number
  value?: number
  tabs?: string
}

export function TabPanel(props: TabPanelProps = { tabs: 'tabs' }) {
  const { children, value, index, tabs, ...other } = props
  const id = tabs?.toLowerCase().replace(/ /g, '-')

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-panel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

export default TabPanel
