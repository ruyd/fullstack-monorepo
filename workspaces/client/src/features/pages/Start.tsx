import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
} from '@mui/material'

export default function StartPage() {
  return (
    <Container>
      <Card>
        <CardHeader title="Hello, Fresh Install" />
        <CardContent>
          <Typography>
            Database is totally empty. Please create an account to get started.
          </Typography>
          <TextField label="Email" />
        </CardContent>
        <CardActions>
          <Button>Start</Button>
        </CardActions>
      </Card>
    </Container>
  )
}
