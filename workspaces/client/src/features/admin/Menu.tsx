import { Link } from 'react-router-dom'
import config from '../../shared/config'
export default function Menu() {
  const home = config.admin.path
  return (
    <div>
      <h1>Manage</h1>
      <Link to={home}>Dashboard</Link>
      {config.admin.models.map(name => (
        <Link key={name} to={`${home}/${name}`}>
          {name}
        </Link>
      ))}
    </div>
  )
}
