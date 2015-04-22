# signalplex

A websocket signal server and client module.  The API is same as [signalhub](https://www.npmjs.com/package/signalhub).

The main entry for this module is the client code.  ```server.js``` is the compatible server. you can use it like so:

```
npm install signalplex 
```

```js
require('signalplex/server')
```

Run that file with node.  It will listen on port 11010 or higher.

In your browser / client code, do:

```js
var sockethub = require('signalplex')

//  two parans, the websocket URI and a name for your app/group

var hub = sockethub('ws://localhost://11010', 'meow-app')

var pipe = hub.subscribe('pow!')

pipe.on('data', function(data){
  console.log(data.toString())
})

setInterval(function(){
  var r = Math.random() * 100
  hub.broadcast('pow!', 'a string is the thing ' + r)

}, 1000)
```
