const vorpal = require('vorpal')()
const socket = require('socket.io-client')('http://antoinechalifour.fr:9999/app');

socket.on('connect', () => {
  vorpal.log('👽 : You are now connected to the server sir')
  vorpal
    .command('play', 'Starts the video')
    .action((args, cb) => {
      socket.emit('nf:play')

      cb()
    })

  vorpal
    .command('pause', 'Pauses the video')
    .action((args, cb) => {
      socket.emit('nf:pause')

      cb()
    })

  vorpal
    .delimiter('👽 : What shall we do sir? $ ')
    .show()
})
