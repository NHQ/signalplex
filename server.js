var wsServer = require('ws').Server 
var wsStream = require('websocket-stream')
var wss = new wsServer({noServer: true})
var ecstatic = require('ecstatic')
var www = ecstatic(__dirname + '/public')
var dataplex = require('dataplex')
var through = require('through2')
var answer = require('answerver')

var server = require('http').createServer(function(req, res){
  www(req, res)
})

answer(server, 11010)

//server.listen(11010, function(){
//  console.log('server running at http://localhost:11010')
//})

var plex = dataplex()

var conx = {}

plex.add('/v1/subscribe/:name/:channel', function(params, cb){

  var n = params.name, c = params.channel
  if(!conx[n]) {
    conx[n] = {}
  }
  if(!conx[n][c]){
    conx[n][c] = through(function(buf, x, next){
      this.push(buf)
      next()
    })
  }
  
  return conx[n][c]
})


plex.add('/v1/broadcast/:name/:channel', function(params, cb){
  var n = params.name, c = params.channel
  if(!conx[n]) {
    conx[n] = {}
  }
  if(!conx[n][c]){
    conx[n][c] = through(function(buf, x, next){
      this.push(buf)
      next()
    })
  }
  
  return through(function(buf, enc, next){
    conx[n][c].write(buf)
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
    stream.on('finish', function(e){stream.unpipe(plex);plex.unpipe(stream)})
  })
})

