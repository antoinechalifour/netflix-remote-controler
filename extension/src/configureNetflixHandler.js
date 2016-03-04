export const configureNetflixHandler = (socket, video) => () => {
  console.log(`[NRC] 🤖  > Connected. Have fun!`)
  const VOLUME_CHANGE_STEP = 0.15
  const $video = video.$video
  let lastVolume = false

  socket.on('video:play', () => $video.play())
  socket.on('video:pause', () => $video.pause())
  socket.on('vol:mute', () => {
    lastVolume = $video.volume
    $video.volume = 0
  })
  socket.on('vol:unmute', () => {
    if(lastVolume !== 0 && !lastVolume) {
      $video.volume = lastVolume
    }
  })
  socket.on('vol:up', () => $video.volume = ($video.volume + VOLUME_CHANGE_STEP > 1) ?
      1 :
      $video.volume + VOLUME_CHANGE_STEP)
  socket.on('vol:down', () => $video.volume = ($video.volume - VOLUME_CHANGE_STEP < 0) ?
      0 :
      $video.volume = VOLUME_CHANGE_STEP)

  const { name, season, episode } = video
  socket.emit('video:new', {
    video: { name, season, episode }
  })
}