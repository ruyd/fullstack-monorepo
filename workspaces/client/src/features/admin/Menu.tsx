import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import config from '../../shared/config'
export default function Menu({ ...props }) {
  const home = config.admin.path
  return (
    <Box {...props}>
      <Link to={home}>Dashboard</Link>
      {config.admin.models.map(name => (
        <Link key={name} to={`${home}/${name}`}>
          {name}
        </Link>
      ))}
    </Box>
  )
}
