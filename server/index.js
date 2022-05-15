//requiring all the modules 
const http=require("http");
const express=require("express");
const cors=require("cors");
const socket=require("socket.io");
//initalizing an array of objects to store the user according to the socket id 
//which is passes every time
const users=[{}];
//above are all required modules
//initating express
const app=express();
//the below line will allow cors on every page for more info on cors visit: https://stackabuse.com/handling-cors-with-node-js/
app.use(cors());
const server=http.createServer(app);
//below line intitalize socket.io by passing the http server object
const io=socket(server);
const port=4000||process.env.port;
app.get('/',(req,res)=>{
    res.send("It's working ");
});
//socket is a single user 
//whiel io is the whole circuit
//the below code is listening for new connection event and logs it 
io.on('connection',(socket)=>{
    socket.on('joined',({user})=>{
        //The user data is recieved from the client side 
        //and here we are using destructuring concept 
        //here joined is an event 
        users[socket.id]=user;
        console.log(`${user} joined`);
        //broadcast.emit sends message to everyone other than the user joined
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
         //socket.emit only sends the message to the user joined
    socket.emit('intro',{user:'Admin',message:"Welcome to the chat"});
    })
    //use disconnec bcz it was saying that disconnect is reserved
   socket.on('disconnect',()=>{
       socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left the chat`})
       console.log("user disconnected");
   })
   socket.on('message',({message,id})=>{
       io.emit('sendmessage',({user:users[id],message,id}))
   })
});
//This is another way using http we can make the server listen 
//In express app.listen , we are doing the same thing but the code is hidden inside the add.listen 
//method of expresss
server.listen(port,()=>{
    console.log(`The server is working on port ${port}`);
})