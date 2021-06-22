const express= require('express');
const app= express();
const server= require('http').createServer(app);
const io=require('socket.io')(server,{
	cors:{origin:"*"}
})

//Declare static folder
app.use(express.static('./views'));

let playState=false;
let currentSong='Come Alive';
let theTrackName='come-alive';
let theTimer=0;

io.on('connection',(socket)=>{
	console.log( "user connected "+socket.id);
	
	//sends welcome message
	// socket.emit('message','Hi. Welcome to my bedroom');
	
	socket.on('welcome',(newName)=>{
		
		socket.emit('welcome',`Hi ${newName}. Welcome to my bedroom`,currentSong,theTrackName,playState,theTimer);
		// socket.emit('welcome',`Currently playing: ${currentSong}`);
		socket.broadcast.emit('message',`${newName} entered the bedroom`)
	})
	
	socket.on('display',()=>{
		socket.emit('display',socket.id)
	})
	
	socket.on('chatMessage',(msg,presentName)=>{
		console.log(msg)
		io.emit('message', `${presentName}: ${msg}`)
	})
	
	socket.on('trackPlay',(trackName,innerName)=>{
		playState=true;
		currentSong=innerName;
		theTrackName=trackName
		io.emit('trackPlay',trackName,innerName)
	})
	
	
	socket.on('soundOn',(msg,room)=>{
		playState=!playState;
		io.emit('soundOn',playState)
		// socket.to(room).emit('soundOn')
		// socket.emit('coloring')
	})
	
	socket.on('stopAudio',()=>{
		playState=false;
		io.emit('stopAudio',playState)
	})
	
	
	socket.on('tracker',(timer)=>{
		theTimer=timer;
		// console.log(theTimer)
	})
	
	
})


const PORT= process.env.PORT || 3000;

server.listen(PORT, ()=>console.log(`server on port ${PORT}`))