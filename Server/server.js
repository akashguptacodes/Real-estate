const path = require('path');
const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const {cloudinaryConnect} = require('./config/cloudinary')
const fileUpload = require('express-fileupload')
const cors = require('cors')


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',

    })
)


const Database = require('./config/Database')
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const PORT = process.env.PORT || 4000;

Database.DbConnect();
cloudinaryConnect();


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/chats',chatRoutes);
app.use('/api/v1/messages',messageRoutes)

// ==========Deployement===================

const __dirname1 = path.resolve();
// console.log(__dirname1);

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname1, '/client/dist')));
    app.get('*' , (req,res)=>{
        res.sendFile(path.resolve(__dirname1, 'client','dist','index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running');
    })
}

// ==========Deployement===================

 const server = app.listen(PORT, () => {
    console.log(`App is running successfully on PORT ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin:process.env.CLIENT_URL
    }
});

let onlineUser = [];

const addUser = (userId, socketId) => {    
    const userExists = onlineUser.find((user)=>user.userId === userId);
    if(!userExists){
        onlineUser.push({userId, socketId});
    }
}

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user)=>user.socketId !== socketId);
}

const getUser = (userId) => {    
    return onlineUser.find((user)=>user.userId === userId);
}

io.on("connection", (socket)=> {
    socket.on("newUser", (userId)=>{
        addUser(userId, socket.id);            
    })

    socket.on("sendMessage", ({receiverId, data}) => {
        const receiver = getUser(receiverId);
        io.to(receiver?.socketId).emit("getMessage", data);
        
    })

    socket.on("disconnect",() => {
        removeUser(socket.id);
    })
})
