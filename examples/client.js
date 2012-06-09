var YouTubePlayer = require('youtube-player')

var p = PLAYER = new YouTubePlayer({id: 'yt_player', width: 400, height: 300})

p.on('change', function (state) {
  console.log('change', state, Object.keys(p.player))
})

p.on('ready', function () {
//  p.play('wusGIl3v044')
})

