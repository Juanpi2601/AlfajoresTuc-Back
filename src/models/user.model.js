import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El campo es requerido"],
    },
    userName: {
      type: String,
      required: [true, "El campo es requerido"],
    },
    email: {
      type: String,
      required: [true, "El campo es requerido"],
    },
    dni: {
      type: String,
      required: [true, "El campo es requerido"]
    },
    password: {
      type: String,
      required: [true, "El campo es requerido"],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
  },
  { timestamps: true }
);
userSchema.methods.toJSON = function () {
  const { password, ...user } = this.toObject();
  return user;
};
export default model("User", userSchema);
