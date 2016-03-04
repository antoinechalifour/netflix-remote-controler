'use strict'

const config = require('./config')
const vorpal = require('vorpal')()
const socket = require('socket.io-client')(config.v1.server);
let videos = {}
const connected = new Promise((resolve, reject) => {
  vorpal.log('[C-18] 🤖  > Waiting for remote server...')
  socket.on('connect', () => {
    vorpal.log('[C-18] 🤖  > Your are now connected to the server, master.')
    vorpal.log('[C-18] 🤖  > Type "help" to get a list of commands')
    vorpal
      .delimiter('[C-18] 🤖  > What are your orders master ? $  ')
      .show()
    resolve()

    socket.on('video:list', data => {
      vorpal.log('[C-18] 🤖  > New videos available ! Run "list" to know more.')
      videos = data.videos
    })

    socket.on('video:delete', data => {
      vorpal.log('[C-18] 🤖  > Video list changed ! Run "list" to know more.')
      videos = data.videos
    })
    
  })
})

vorpal
  .command('play all', 'Plays video on all running players')
  .action((args, cb) => {
    connected.then(() => {
      socket.emit('video:play')
    })
    cb()
  })

vorpal
  .command('pause all', 'Pauses video on all running players')
  .action((args, cb) => {
    connected.then(() => {
      socket.emit('video:pause')
    })
    cb()
  })

vorpal
  .command('play [id]', 'Plays the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('video:play', { id })
    })
    cb()
  })

vorpal
  .command('pause [id]', 'Plays the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('video:pause', { id })
    })
    cb()
  })

vorpal
  .command('mute [id]', 'Mutes the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('vol:mute', { id })
    })
    cb()
  })

vorpal
  .command('unmute [id]', 'Unmute the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('vol:unmute', { id })
    })
    cb()
  })

vorpal
  .command('up [id]', 'Turns the volume up for the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('vol:up', { id })
    })
    cb()
  })

vorpal
  .command('down [id]', 'Turns the volume down the specified video')
  .action((args, cb) => {
    const id = args.id

    if(typeof id === 'undefined') {
      vorpal.log('[C-18] 🤖  > An id is required')
      return cb()
    }
    connected.then(() => {
      socket.emit('vol:down', { id })
    })
    cb()
  })

vorpal
  .command('list', 'Lists all Netflix players runnning')
  .action((args, cb) => {
    const table = Object.keys(videos).map(k => {
      const video = videos[k]
      return `${k} \t ${video.name} \t ${video.season} \t ${video.episode}`
    })
    .join('\n')

    vorpal.log(table)
    cb()
  })