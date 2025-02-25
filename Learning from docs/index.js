import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url'; // This module is used to convert the filepaths which are not supported in es6 to url
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
const app= express();

const server= createServer(app);
const io= new Server(server); // This attaches the webserver using socket.io

// console.log(dirname(fileURLToPath(import.meta.url)));

const __dirname= dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res)=>{
    // res.send('<h1>Hello world</h1>')
    res.sendFile(join(__dirname, 'index.html'));
})

io.on('connection',(socket)=>{
    console.log('A user connected');
    // socket.on('disconnect',()=>{
    //     console.log('user disconnected');
    // })

    socket.on('chat message',(msg)=>{
        // console.log('message',msg);
        io.emit('chatting',msg);
    })
})

server.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})