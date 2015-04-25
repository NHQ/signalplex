var wsServer = require('ws').Server 
var wsStream = require('websocket-stream')
var wss = new wsServer({noServer: true})
var ecstatic = require('ecstatic')
var www = ecstatic(__dirname + '/public')
var dataplex = require('dataplex')
var through = require('through2')
var upgrade = require('./upgrade')

var server = require('http').createServer(function(req, res){
  www(req, res)
})

server.on('upgrade',  upgrade)

module.exports = server

//answer(server, 11010)
