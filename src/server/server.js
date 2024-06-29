import express from "express";
import dotenv from 'dotenv';
import '../dbConnection/dbConnection.js';
import morgan from 'morgan';
import cors from 'cors';
// import cookieParser from 'cookie-parser';
import userRoutes from "../routes/user.routes.js";
import productRoutes from "../routes/product.routes.js"
import cartRoutes from "../routes/cart.routes.js"
import sendmailRoutes from "../routes/sendmail.routes.js"
import novedadRoutes from '../routes/novedad.routes.js'
import addressRoutes from "../routes/address.routes.js"
import merpagoRoutes from "../routes/merpago.routes.js"
import orderRoutes from "../routes/order.routes.js"

export const port = process.env.PORT || 8000;
export const ADMIN_KEY = process.env.ADMIN_KEY;
export const USER_KEY = process.env.USER_KEY;

const app = express();

dotenv.config();
// app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: 'https://alfatuc.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart",cartRoutes);
app.use("/sendmail", sendmailRoutes);
app.use("/novedad", novedadRoutes);
app.use("/address", addressRoutes);
app.use("/mercadopago", merpagoRoutes);
app.use("/order", orderRoutes);


app.listen(port, () => {
  console.log(`Estamos escuchando el puerto ${port}`);
});
