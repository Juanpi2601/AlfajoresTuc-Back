import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/user.routes.js';


export const port = process.env.PORT || 8000;
export const ADMIN_KEY = process.env.ADMIN_KEY;
export const USER_KEY = process.env.USER_KEY;


dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(
    cors({
      origin: 'https://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
      withCredentials: true,
    })
);

app.use("/user", userRoutes);

app.listen(port, () => {
    console.log(`Estamos escuchando el puerto ${port}`);
  });
  


