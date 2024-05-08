import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectDB from './config/connectdb.js'
import cors from 'cors'
import customResponse from './config/jsonRenderer.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

import {Server} from 'socket.io'
import http from 'http'
import { setupSocket } from './socket_manager/socketManager.js'

const app= express()
const server=http.Server(app)
const io=new Server(server,{
    cors: {
        origin: "*", // Allow only this domain or use '*' to allow all
        methods: ["GET", "POST"],     // Allowed request methods
        credentials: true             // Allow credentials
    }
    })
const port=process.env.PORT || 8000



// CORS Policy
app.use(cors());


// Database Connection
connectDB(process.env.MONGOURL)



// JSON Configuration
app.use(express.json())
app.use(customResponse);


// Load Routes
app.use("/api/user/", userRoutes)
app.use("/api/post/", postRoutes)

// socket function link
setupSocket(io)

server.listen(port, ()=>{
    console.log(`Server listening at port ${port}`)
})

export {io}