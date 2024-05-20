import express from "express";
import dotenv from 'dotenv';
import '../dbConnection/dbConnection.js';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js"
import cartRoutes from "../routes/cart.routes.js"
import sendmailRoutes from "../routes/sendmail.routes.js"
import addressRoutes from "../routes/address.routes.js"

export const port = process.env.PORT || 8000;
export const ADMIN_KEY = process.env.ADMIN_KEY;
export const USER_KEY = process.env.USER_KEY;

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    withCredentials: true,
  })
);


app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart",cartRoutes);
app.use("/sendmail", sendmailRoutes);
app.use("/address", addressRoutes);

app.listen(port, () => {
  console.log(`Estamos escuchando el puerto ${port}`);
});
