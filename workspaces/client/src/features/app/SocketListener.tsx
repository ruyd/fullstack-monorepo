/* eslint-disable no-console */
import React from 'react'
import { io, Socket } from 'socket.io-client'

import { useAppDispatch, useAppSelector } from '../../shared/store'
import { AppNotification, AppState, patch } from '.'
import { config } from '../../shared/config'

import loadConfig, { setConfig } from '../../shared/loadConfig'
import { ClientConfig } from '@lib'

export default function SocketListener() {
  const dispatch = useAppDispatch()
  const socketRef = React.useRef<Socket>()
  const token = useAppSelector(state => state.app.token)
  const { activeMenuItem } = useAppSelector(state => state.admin)
  const { notifications } = useAppSelector(state => state.app)

  React.useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = undefined
      }
      return
    }

    if (socketRef.current) {
      return
    }

    const socket = io(config.backendUrl, {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      auth: {
        token,
      },
    })
    socketRef.current = socket
    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.onAny((eventName, type, payload) => {
      // called for each packet received
      console.log('backend', eventName, type, payload)
    })

    socket.on('ban', () => {
      dispatch(patch({ token: undefined }))
    })

    socket.on('setting', () => {
      loadConfig()
    })

    socket.on('state', (state: AppState) => {
      dispatch(patch({ ...state }))
    })

    socket.on('config', (config: ClientConfig) => {
      setConfig(config)
    })

    socket.on('notification', (notification: AppNotification) => {
      dispatch(patch({ notifications: [...notifications, notification] }))
    })
  }, [dispatch, notifications, token])

  React.useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit('menu', activeMenuItem)
    }
  }, [activeMenuItem])

  return null
}
