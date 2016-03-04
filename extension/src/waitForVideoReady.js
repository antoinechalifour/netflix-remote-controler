export const waitForVideoReady = () => {
  console.log('[NRC] 🤖  > Waiting for video to be ready...')
  const MAX_ATTEMPTS = 5000
  let attempts = 0
  return new Promise((resolve, reject) => {
    let $video
    let $name
    let $season
    let $episode
    const detectVideo = () => {
      if(attempts > MAX_ATTEMPTS) {
        console.log(`[NRC] 🤖  > Could not detect video after ${attempts} attempts.`)
        return reject()

      }
      attempts += 1
      console.log(`[NRC] 🤖  > Detecting video (attempt ${attempts})...`)
      setTimeout(() => {

        if(!$video) {
          $video = document.querySelector('video')
        }

        if(!$name) {
          $name = document.querySelector('.player-status span:first-child')
        }

        if(!$season) {
          $season = document.querySelector('.player-status span:nth-child(2)')
        }

        if(!$episode) {
          $episode = document.querySelector('.player-status span:nth-child(3)')
        }

        if($video && $name && $season && $episode) {
          console.log(`[NRC] 🤖  > Done detecting elements.`)
          const video = {
            name: $name.innerHTML.replace(/&nbsp;/g, ' ').replace(/ +/g, ' '),
            season: $season.innerHTML.replace(/&nbsp;/g, ' ').replace(/ +/g, ' '),
            episode: $episode.innerHTML.replace(/&nbsp;/g, ' ').replace(/ +/g, ' '),
            $video,
          }
          resolve(video)
        } else {
          detectVideo()
        }
      }, 500)
    }

    detectVideo()
  })
}