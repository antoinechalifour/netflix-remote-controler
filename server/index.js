'use strict'

const http = require('http')
const server = http.createServer()
const io = require('socket.io')(server)

// Namespace for the controller part
const app = io.of('/v1/app')

// Namespace for the extension part
const extension = io.of('/v1/extension')

// Video set.
// Each 'local network' gets its own space
// e.g. videos = {
//  <some_ip> :{
//    video,
//    video,...
//  },
//  <some_other_ip>: {... you get it}
// }
const videos = {}

const simpleCmd = (socket, cmd) => data => {
  const socketIp = socket.client.conn.remoteAddress
  let to
  if(data && typeof data.id !== 'undefined') {
    to = videos[socketIp][data.id]._socket
  } else {
    to = socketIp
  }

  console.log(`🤖  ${cmd} -> 🖥  ${to}`)
  extension.to(to).emit(cmd)
}

// Handles connections for the 'controller' part
app.on('connection', socket => {
  const socketIp = socket.client.conn.remoteAddress
  console.log(`🙀 > New Terminal connected ${socketIp}`)
  socket.join(socketIp)

  // Inits network space if needed
  if(typeof videos[socketIp] === 'undefined') {
    videos[socketIp] = {
      _counter: 0
    }
  }


  socket.on('video:play', simpleCmd(socket, 'video:play'))
  socket.on('video:pause', simpleCmd(socket, 'video:pause'))
  socket.on('vol:mute', simpleCmd(socket, 'vol:mute'))
  socket.on('vol:unmute', simpleCmd(socket, 'vol:unmute'))
  socket.on('vol:up', simpleCmd(socket, 'vol:up'))
  socket.on('vol:down', simpleCmd(socket, 'vol:down'))

  console.log('🙀 > emitting video:list')
  const list = Object.assign({}, videos[socketIp])
  delete list._counter
  delete list._socket
  socket.emit('video:list', {
    videos: list
  })
})

// Handles connections for Chrome extensions
extension.on('connection', socket => {
  const socketIp = socket.client.conn.remoteAddress
  console.log(`🙀 > New extension connected : ${socketIp}`)

  // Inits network space if needed
  if(typeof videos[socketIp] === 'undefined') {
    videos[socketIp] = {
      _counter: 0
    }
  }

  socket.join(socketIp)

  // Adds a new video to the network space
  socket.on('video:new', data => {
    console.log(`🙀 > Adding new video`)
    const id = videos[socketIp]._counter
    videos[socketIp]._counter += 1

    // To keep track of the video id
    socket.netflixId = id
    videos[socketIp][id] = Object.assign({}, data.video, {
      _socket: socket.id
    })

    const list = Object.assign({}, videos[socketIp])
    delete list._counter
    delete list._socket
    app.to(socketIp).emit('video:list', {
      videos: list
    })
  })

  // Deletes the video from the network space
  socket.on('disconnect', () => {
    console.log(`🙀 > Deletting video`)
    delete videos[socketIp][socket.netflixId]
    app.to(socketIp).emit('video:delete', { videos: videos[socketIp] })
  })
})

server.listen(9999, '0.0.0.0', () => console.log('Socket IO server running on port 9999'))