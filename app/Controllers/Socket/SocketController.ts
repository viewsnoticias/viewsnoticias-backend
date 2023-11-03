


export const socketController = (socket) => {


        console.log('cliente conectado')
        socket.emit('news', { hello: 'desde el servidorr' })
      
        socket.on('my other event', (data) => {
          console.log(data)
        })
   
}

export const socketNotify = (socket) => {
    console.log('cliente conectado sss')
        socket.emit('news', { hello: 'world' })
      
        socket.on('my other event', (data) => {
          console.log(data)
        })
}