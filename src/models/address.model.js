import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // },
    address: {
      type: String,
      required: true,
    },
    floor: String,
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

addressSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Address.deleteMany({ userId: doc._id });
  }
});

export default model('Address', addressSchema);
