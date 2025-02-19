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


app.get('/', (req,res) => {
    res.send('Hello');
});

app.listen(PORT, () => {
    console.log(`App is running successfully on PORT ${PORT}`);
})