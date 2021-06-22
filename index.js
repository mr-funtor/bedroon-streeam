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
let users=[]

io.on('connection',(socket)=>{
	console.log( "user connected "+socket.id);
	
	//sends welcome message
	// socket.emit('message','Hi. Welcome to my bedroom');
	
	socket.on('welcome',(newName)=>{
		
		socket.emit('welcome',`Hi ${newName}. Welcome to my bedroom`,currentSong,theTrackName,playState,theTimer);
		// socket.emit('welcome',`Currently playing: ${currentSong}`);
		socket.broadcast.emit('message',`${newName} entered the bedroom`);
		users.push({
			username:newName,
			id: socket.id,
		})
	})
	
	socket.on('display',()=>{
		socket.emit('display',socket.id)
	})
	
	socket.on('chatMessage',(msg,presentName)=>{
		
		io.emit('message', `${presentName}: ${msg}`)
	})
	
	socket.on('trackPlay',(trackName,innerName)=>{
		playState=true;
		currentSong=innerName;
		theTrackName=trackName
		io.emit('trackPlay',trackName,innerName);
		console.log(playState)
	})
	
	
	// socket.on('soundOn',(msg)=>{
		// console.log(playState,'start');
		
		// playState=!playState;
		// io.emit('soundOn',playState,theTimer);
		// console.log(playState,'end')
	// })
	
	socket.on('playOn',(msg)=>{
		console.log(playState,'start');
		
		playState=true;
		io.emit('soundOn',playState,theTimer);
		console.log(playState,'end')
	})
	
	socket.on('pauseOn',(msg)=>{
		console.log(playState,'start');
		
		playState=false;
		io.emit('soundOn',playState,theTimer);
		console.log(playState,'end')
	})
	
	socket.on('stopAudio',()=>{
		playState=false;
		io.emit('stopAudio',playState)
	})
	
	
	socket.on('tracker',(timer)=>{
		theTimer=timer;
		// console.log(theTimer)
	})
	
	socket.on('disconnect',()=>{
		if (users.length<1)return;
		const goneUser=users.find(user=>socket.id===user.id);
		// let theName=goneUser.username;
		
		if(goneUser){
			socket.broadcast.emit('message',`${goneUser.username} left the bedroom`);
		}
		
		
		
		users=users.filter(user=>socket.id !== user.id);
		console.log(users);
	})
	
	
})


const PORT= process.env.PORT || 3000;

server.listen(PORT, ()=>console.log(`server on port ${PORT}`))