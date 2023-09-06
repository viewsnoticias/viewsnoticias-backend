import WebSocket from "App/Services/WebSocket";

WebSocket.boot()
WebSocket.io.on('connection', (_socket) => {

    console.log('cliente conectado')
    // socket.emit('news', { hello: 'world' })
  
    // socket.on('my other event', (data) => {
    //   console.log(data)
    // })
})