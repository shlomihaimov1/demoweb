import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { specs, swaggerUi } from '../swaggerConfig';

// Routes
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();

// DB Configuration
const mongoUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/default';

mongoose.connect(mongoUri);
const db: mongoose.Connection = mongoose.connection;

db.on('error', (error: Error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*',
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
})

// Use swaggerUi and specs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

export const initApp = async (): Promise<Express> => {
  await mongoose.connect(mongoUri);
  return app;
};

export default app;
