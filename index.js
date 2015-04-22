var websocket = require('websocket-stream')
var dataplex = require('dataplex')

module.exports = function(url, app){

  var hub = {}

  var channels = {}

  var ws = websocket(url, null, {autoDestroy: false})
  
  var plex = dataplex()

  ws.pipe(plex).pipe(ws)

  hub.subscribe = function(channel){
    if(channels[channel]) return channels[channel]
    var pipe = plex.remote('/v1/subscribe/' + app + '/' + channel)
    channels[channel] = pipe 
    return pipe
  }

  hub.broadcast = function(channel, msg){
    var pipe = plex.remote('/v1/broadcast/' + app + '/' + channel)
    msg = typeof msg === 'String' ? msg : JSON.stringify(msg)
    pipe.end(msg)
  }

  return hub 

}



