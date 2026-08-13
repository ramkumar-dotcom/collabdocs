import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;
