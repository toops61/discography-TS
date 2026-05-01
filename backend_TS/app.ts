import express, { Express } from 'express';
import {config} from 'dotenv';
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import discsRoutes from './routes/discsRoutes.js';
import wishesRoutes from './routes/wishesRoutes.js';
import { connectToDB } from './auth/connectToDB.js';
import cookieParser from 'cookie-parser';
import { checksCookiesConnection, updateToken } from './controllers/sessionServerActions.js';

config();

const app: Express = express();

const allowedOrigins = [
  "http://localhost:5175",
  "https://toops61.github.io"
];

await connectToDB();

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin non autorisée par CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

app.use('/', userRoutes);
app.use('/', discsRoutes);
app.use('/', wishesRoutes);
app.post('/refresh', updateToken);
app.post('/check', checksCookiesConnection);

export default app;