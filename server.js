var wsServer = require('ws').Server 
var wsStream = require('websocket-stream')
var wss = new wsServer({noServer: true})
var ecstatic = require('ecstatic')
var connexions = {}
var www = ecstatic(__dirname + '/public')
var dataplex = require('dataplex')
var through = require('through2')

var server = require('http').createServer(function(req, res){
  www(req, res)
})

server.listen(11010, function(){
  console.log('server running at http://localhost:11010')
})

var plex = dataplex()

plex.add('/v1/subscribe/:name/:channel', function(params, cb){
  return through(function(buf, enc, next){
    this.push(buf)
    next()
  })
})

plex.on('error', function(e){
  console.log(e)
})

server.on('upgrade', function(req, socket, head){
  wss.handleUpgrade(req, socket, head, function(ws){
    var stream = wsStream(ws, {autoDestroy: false})
    stream.pipe(plex).pipe(stream) 
    stream.on('error', function(e){console.log(e)})
  })
})

