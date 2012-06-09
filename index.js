var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

module.exports = YouTubePlayer

var waiting = []
var ready = false

inherits(YouTubePlayer, EventEmitter)

  if (!window['YT'])
    window.YT = {};
 
/*
{ id // element id
, width
, height
// initial video?
*/

var states = ['ready', 'ended', 'playing', 'paused', 'buffering', 'cued']


function YouTubePlayer (options) {
  var self = this, player, ready = false
  options.events = {
    onStateChange: function (state) {
      state = states[state.data + 1]

      /*
        this is really weird, but the first time that youtube
        emits ready, it's not actually ready.
        it hasn't added all the methods yet.
        

      */

      function isReady() {
        if(!self.player.loadVideoById) {
          console.log(state, Object.keys(self.player))
          process.nextTick(isReady)
        } else if(!ready) {
          ready = true
          console.log(state, Object.keys(self.player))
          self.emit('ready')
        } else 
          return true
      }

      if(isReady()) {
        self.emit(state)
        self.emit('change', state)
      }
    },
    onError: function (code) {
      var message = ({
        '2': 'invalid parameter',
        '100': 'video not found',
        '101': 'video not embeddable',
        '150': 'video not embeddable'
      })[code]
      self.emit('error', new Error(message))
    }
  }

  function create() {
    self.player = new YT.Player(options.id, options)
  }

  if(!ready)
    waiting.push(create)
}

function map(a, b) {
  var fn = 'function' == typeof b ? b : function () {
    
  }
  YouTubePlayer.prototype[a] = function () {
    var args = [].slice.call(arguments)
    if('function' == typeof b)
      b.apply(this, args)
    else
      this.player[b].apply(this.player, args)
  }
}

map('load', function (id, seconds, quality) {
  var args = [].slice.call(arguments)
  if(!this.player)
    this.waiting = args
  else
    this.player.loadVideoById(id, seconds, quality) 
})

map('play'    , 'playVideo')
map('stop'    , 'stopVideo')
map('pause'   , 'pauseVideo')
map('clear'   , 'clearVideo')
map('seek'    , 'seekTo')
map('length'  , 'getDuration')

map('mute')
map('unMute')
map('isMuted')
map('setVolume')
map('getVolume')

//global listener... sorry. this is youtube.
window.onYouTubePlayerAPIReady = function () {
  console.log('api') 
  ready = true
  while(waiting.length)
    waiting.shift()()
} 

//this is from http://www.youtube.com/player_api
//gonna inline it here to save a request.
setTimeout(function () {
 if (!YT.Player) {
    (function () {
      console.log('add script')
      var p = document.location.protocol == 'https:' ? 'https:' : 'http:'
      var s = p + '//s.ytimg.com/yt/jsbin/www-widgetapi-vflCAfh6H.js'
      var a = document.createElement('script')
      a.src = s
      a.async = true
      var b = document.getElementsByTagName('script')[0]
      b.parentNode.insertBefore(a, b)
      YT.embed_template = "\u003ciframe width=\"425\" height=\"344\" src=\"\" frameborder=\"0\" allowfullscreen\u003e\u003c\/iframe\u003e"
    })()
  }
}, 1)
