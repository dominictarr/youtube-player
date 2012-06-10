#youtube player

emdedding a controllable youtube player is now _mostly harmless_.

inherits from `EventEmitter`

to be used with browserify (or other comonjs bundler?)

``` js
var YouTubePlayer = require('youtube-player')
var p = new YouTubePlayer({id: 'playerElementId', width: 400, height: 300})

p.play(videoID)

p.on('end', function () {
  p.load(anotherVideo) //whatever
})

```

## methods

* `play(id)`  - play a video by id.
* `cue(id)`  - cue a video but don't start it.
* `start()`  - start a cued or paused video.
* `stop()`
* `pause()`
* `length()`  - get the length in seconds. (will return 0 intil metadata is loaded, apparently)
* `seek(seconds)`  - move playhead to specific point.
* `mute()`
* `unMute()`
* `isMuted()`
* `setVolume(volume)` - (out of 100)
* `getVolume()`

## events

* `'error'` - if the video cannot be played for some reason.
* `'ready'` - player is ready for use.
* `'play'` - etc...
* `'buffer'`
* `'end'`
* `'cue'`

## properties

* `player` - reference to youtube player object.
  this has more methods.
* `ready` - boolean. current state of the player (calls to play when ready=false are deffered)

see [youtube player api documentation](https://developers.google.com/youtube/js_api_reference)

