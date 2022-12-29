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
import { DataGrid } from '@mui/x-data-grid'
import { Drawing, User } from '@lib'
import React from 'react'
import { useGet } from 'src/features/app'
import { BlurBackdrop } from 'src/features/ui/BlurBackdrop'
import Gallery from 'src/features/ui/Gallery'
import TabPanel from 'src/features/ui/TabPanel'
import UserEdit from './UserEdit'
import UserOrders from './UserOrders'

export function UserDetail({ user }: { user?: User }): JSX.Element {
  const theme = useTheme()
  const [tab, setTab] = React.useState(0)
  const [background, setBackground] = React.useState('')

  function onGalleryData(items: Drawing[]) {
    setBackground(`${items[0]?.thumbnail}`)
  }

  return (
    <Box sx={{ borderRadius: '16px' }}>
      <Paper style={{ borderRadius: '16px 16px 0 0', padding: 0 }}>
        <CardContent
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            alignItems: 'flex-start',
            padding: '.7rem .7rem .7rem 8rem',
            position: 'relative',
            minHeight: '100px',
            transition: 'all 0.3s ease',
            [theme.breakpoints.down('sm')]: {
              alignItems: 'center',
              textAlign: 'center',
              padding: '.7rem',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${background})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '200% 200%',
              filter: 'blur(5px)',
            }}
          ></Box>
          <Avatar
            src={user?.picture}
            sx={{
              height: '6rem',
              width: '6rem',
              background: theme.palette.primary.light,
              position: 'absolute',
              bottom: '-70%',
              left: '60px',
              transform: 'translate(-50%, -50%)',
              border: '2px solid',
              borderColor: theme.palette.background.paper,
              transition: 'all 0.3s',
              [theme.breakpoints.down('sm')]: {
                height: '5rem',
                width: '5rem',
                bottom: '-50%',
              },
            }}
          />
          <Box sx={{}}>
            <Typography variant="body1">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2">{user?.email}</Typography>
          </Box>
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
      <TabPanel value={tab} index={0} keepMounted>
        <UserEdit user={user} />
      </TabPanel>
      <TabPanel value={tab} index={1} keepMounted>
        <UserOrders />
      </TabPanel>
      <TabPanel value={tab} index={2} keepMounted>
        <Gallery userId={user?.userId} onData={onGalleryData} />
      </TabPanel>
    </Box>
  )
}

export default UserDetail
