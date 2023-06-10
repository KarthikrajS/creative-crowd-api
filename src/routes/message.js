import express from 'express';
import crypto from 'crypto';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/message.middleware.js';

const router = express.Router();

const messageRoutes = (io) => {
  router.post('/', authenticate, async (req, res, next) => {
    try {
      const { sender, content } = req.body;

      const message = new Message({
        sender,
        content,
      });

      await message.save();

      res.status(201).json({ message: 'Message saved successfully' });

      // Broadcast the message to connected clients
      io.emit('chat message', content);
    } catch (error) {
      console.error('Failed to save message:', error);
      next(error);
    }
  });

  return router;
};

export default messageRoutes;
