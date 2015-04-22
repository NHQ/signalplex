var sockethub = require('./')

var hub = sockethub('ws://' + window.location.host, 'meow')

var pipe = hub.subscribe('pow!')

pipe.on('data', function(data){
  console.log(data)
})

setInterval(function(){
  pipe.write('s string is the thing')
  //hub.broadcast('pow!', 'a string is the thing')
}, 1000)

