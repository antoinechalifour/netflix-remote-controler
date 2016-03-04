import io from 'socket.io-client'
import { config } from 'config'
import { configureNetflixHandler } from './configureNetflixHandler'
import { waitForVideoReady } from './waitForVideoReady'

window.addEventListener('load', () => {
  waitForVideoReady()
  .then(video => {
    console.log(`[NRC] 🤖  > Waiting for server...`)
    const socket = io.connect(config.v1.server)
    socket.on('connect', configureNetflixHandler(socket, video))
  })
})