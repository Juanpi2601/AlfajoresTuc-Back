import dotenv from 'dotenv';
dotenv.config();
import  mongoose from "mongoose";
mongoose.connect(process.env.DB_URL);

  mongoose.connection.on("connected", () =>{
    console.log("Conectado a la base de datos de MongoDB ");
  })
  mongoose.connection.on("error", (error) => {
    console.log(`Ha occurrido un error ${error}`);
  });



