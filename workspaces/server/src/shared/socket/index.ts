import { Server } from 'http'
import { Server as ServerHttps } from 'https'
import { Server as SocketService, Socket } from 'socket.io'
import { decodeToken } from '../auth'
import logger from '../logger'
import { createOrUpdate } from '../model-api/controller'
import { UserActiveModel } from '../types'
import handlers from './handlers'
import { config } from '../config'
import { getClientSettings } from '../settings'

export type SocketHandler = (io: SocketService, socket: Socket) => void

export let io: SocketService

function onDisconnect(socket: Socket) {
  logger.info('- socket disconnected: ' + socket.id)
  try {
    UserActiveModel.destroy({
      where: {
        socketId: socket.id
      }
    })
  } catch (error) {
    logger.error(error)
  }
}

function onConnect(socket: Socket) {
  logger.info(`⚡️ [socket]: New connection: ${socket.id}`)
  try {
    const decoded = decodeToken(socket.handshake.auth.token)
    logger.info('decoded' + JSON.stringify(decoded))
    createOrUpdate(UserActiveModel, {
      socketId: socket.id,
      userId: decoded?.uid,
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent']
    })
  } catch (error) {
    logger.error(error)
  }
}

export function registerSocket(server: Server | ServerHttps): void {
  io = new SocketService(server, {
    cors: config.cors
  })
  const onConnection = (socket: Socket) => {
    handlers.forEach((handler: SocketHandler) => handler(io, socket))

    socket.send('Helo', {
      notifications: ['Hi!']
    })

    onConnect(socket)

    socket.on('disconnect', () => onDisconnect(socket))
  }
  io.on('connection', onConnection)
}

export async function broadcastChange(eventName: string, data: unknown): Promise<void> {
  // const sockets = await io.except(userId).fetchSockets()
  // io.except(userId).emit('config', { data })
  io.emit(eventName, { data })
}

export async function notifyChange(eventName: string): Promise<void> {
  io.emit(eventName)
}

export async function sendConfig(): Promise<void> {
  const payload = await getClientSettings()
  io.emit('config', { ...payload })
}
