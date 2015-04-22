var sockethub = require('./')

var hub = sockethub('ws://' + window.location.host, 'meow')

var pipe = hub.subscribe('pow!')

pipe.on('data', function(data){
  console.log(data)
})

setInterval(function(){
  hub.broadcast('pow!', 'a string is the thing')
}, 1000)

