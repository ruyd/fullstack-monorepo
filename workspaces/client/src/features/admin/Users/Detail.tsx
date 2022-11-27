import { User } from '@shared/lib'

export default function UserDetail({ user }: { user?: User }): JSX.Element {
  return (
    <div>
      <h1>User Detail</h1>
      <p>{user?.email}</p>
    </div>
  )
}
