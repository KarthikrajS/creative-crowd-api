import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from 'http';
import authRoutes from "./routes/auth.js";
import tutorRoutes from "./routes/tutors.js";
import studentRotes from "./routes/student.js";
import resourceRoutes from "./routes/resource.js";
import interestRoutes from "./routes/interest.js";
import zoomRoutes from "./routes/zoom.js";
import messageRoutes from "./routes/message.js";
import { errorHandler } from './middleware/error.js';
import cors from "cors";
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();


// Create express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
//cors
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://10.103.142.92:5173",
    "https://creative-crowd-fe.onrender.com",
    "http://localhost:3000/"
  ],
};

app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.use(express.static('dist'));

// Setup database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/student", studentRotes);
app.use("/api/resource", resourceRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/zoom", zoomRoutes);
app.use("/api/chat", messageRoutes(io));


io.on('connection', (socket) => {
  console.log('A user connected');

  // ... Rest of the socket.io implementation ...

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(errorHandler);

//global error handler
app.use((err, req, res, next) => {
  console.log(err);
  return res
    .status(err?.statusCode || 500)
    .json({ errMsg: err.message || "Something went wrong..." });
});

// Start server
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
