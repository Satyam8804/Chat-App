const express = require('express');
const { Socket } = require('socket.io');

const app = express()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000
var users ={};

app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.sendFile(__dirname +'/index.html')
})

http.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})


// socket 

const io = require('socket.io')(http)

io.on('connection', (socket)=>{
    socket.on('new-user-joined',(Name)=>{
        users[socket.id] = Name
        socket.broadcast.emit("user-connected",Name)
    })
    socket.on('message',(msg)=>{
       socket.broadcast.emit('message',msg)
    })
})

