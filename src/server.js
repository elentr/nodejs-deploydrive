import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contacts from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import usersRouter from './routers/auth.js';
import { auth } from './middlewares/auth.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

// Читаємо змінну оточення PORT
const PORT = Number(process.env.PORT) || 3000;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(cookieParser());
  app.use('/auth', usersRouter);
  app.use('/contacts', auth, contacts);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
