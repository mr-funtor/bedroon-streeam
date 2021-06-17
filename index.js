const express= require('express');
const app= express();
const server= require('http').createServer(app);
const io=require('socket.io')(server,{
	cors:{origin:"*"}
})

//Declare static folder
app.use(express.static('./views'))

io.on('connection',(socket)=>{
	console.log( "user connected "+socket.id);
	
	
	socket.on('display',()=>{
		socket.emit('display',socket.id)
	})
	
	// socket.on('message',(data)=>{
		// console.log(data);
		// socket.broadcast.emit('message', data)
	// })
	
	socket.on('message',(msg,room)=>{
		console.log(msg);
		// socket.to(room).emit('message',msg)
		io.to(room).emit('message',msg,room)
	})
	
	socket.on('coloring',(msg,room)=>{
		// io.emit('coloring',room)
		socket.to(room).emit('coloring')
		socket.emit('coloring')
		console.log('colorin')
	})
	
	socket.on('soundOn',(msg,room)=>{
		// io.emit('coloring',room)
		socket.to(room).emit('soundOn')
		// socket.emit('coloring')
	})
	
	socket.on('joinRoom',(room)=>{
		
		socket.join(room)
		socket.emit('joinRoom',room)
	})
	
})


const PORT= process.env.PORT || 3000;

server.listen(PORT, ()=>console.log(`server on port ${PORT}`))