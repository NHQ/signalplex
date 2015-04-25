var websocket = require('websocket-stream')
var dataplex = require('dataplex')

module.exports = function(url, app){

  var hub = {}

  var channels = {}

  var ws, plex

  var retry = Date.now()

  var delta = 1000 

  var plex = dataplex()

  connect(false)

  function connect(un){
  
    if(un) plex.unpipe(ws)

    ws = websocket(url, null, {autoDestroy: false})
 
    ws.pipe(plex).pipe(ws)

    ws.on('error', function(e){
      console.log(e)
    })

    ws.on('close', function(){
      /*    
      var now = Date.now()
      if(!(now - retry < delta)){
        setTimeout(function(){
          connect(true)
        }, delta - (now - retry) )
      }
      else 
      */
      connect(true)
    })
  }

  hub.subscribe = function(channel){
    if(channels[channel]) return channels[channel]
    var pipe = plex.remote('/v1/subscribe/' + app + '/' + channel)
    channels[channel] = pipe 
    return pipe
  }

  hub.broadcast = function(channel, msg){
    var pipe = plex.open('/v1/broadcast/' + app + '/' + channel)
    pipe.on('error', function(e){
      console.log(e)
    })
    pipe.end(JSON.stringify(msg))
  }

  return hub 

}



