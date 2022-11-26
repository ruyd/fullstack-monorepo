import { Server } from 'http'
import { Server as ServerHttps } from 'https'
import { Server as SocketService, Socket } from 'socket.io'
import logger from '../logger'
import handlers from './handlers'

export type SocketHandler = (io: SocketService, socket: Socket) => void

export function registerSocket(server: Server | ServerHttps): void {
  const io = new SocketService(server, {
    cors: {
      origin: '*',
    },
  })
  const onConnection = (socket: Socket) => {
    handlers.forEach((handler: SocketHandler) => handler(io, socket))

    logger.info(`⚡️[socket]: New connection: ${socket.id}`)
    socket.on('disconnect', () => {
      logger.info('user disconnected' + socket.id)
    })

    socket.send('Helo', {
      config: {
        test: true,
      },
      notifications: ['Hi!'],
    })
  }
  io.on('connection', onConnection)
}
