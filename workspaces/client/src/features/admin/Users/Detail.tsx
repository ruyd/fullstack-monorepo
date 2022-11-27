/* eslint-disable @typescript-eslint/no-unused-vars */
import { Person2, SupervisedUserCircle } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import { User } from '@shared/lib'
import React from 'react'

export default function UserDetail({ user }: { user?: User }): JSX.Element {
  const theme = useTheme()
  const [tab, setTab] = React.useState(0)
  return (
    <Box sx={{ borderRadius: '16px' }}>
      <Paper style={{ borderRadius: '16px', padding: 0 }}>
        <CardContent
          sx={{
            background: 'blue',
            minHeight: '10rem',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={user?.picture}
            sx={{ height: '5rem', width: '5rem', background: theme.palette.primary.light }}
          />
          <Typography variant="body1">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </CardContent>
        <Box sx={{ height: '50px' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v as number)}
            centered
            sx={{
              alignItems: 'end',
            }}
          >
            <Tab label="Details" icon={<Person2 />} iconPosition="start" />
            <Tab label="Orders" icon={<Person2 />} iconPosition="start" />
            <Tab label="Gallery" icon={<Person2 />} iconPosition="start" />
          </Tabs>
        </Box>
      </Paper>
    </Box>
  )
}
