var sockethub = require('./')

var hub = sockethub('ws://' + window.location.host, 'meow')

var pipe = hub.subscribe('pow!')

pipe.on('data', function(data){
  console.log(data.toString())
})

setTimeout(function(){
}, 3000)

setInterval(function(){
  var r = Math.random() * 100
  console.log(r)
  hub.broadcast('pow!', 'a string is the thing ' + r)

}, 1000)

