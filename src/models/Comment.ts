import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CommentSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    quote: {
      type: String,
      default: "",
      maxlength: 500,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type CommentDocument = InferSchemaType<typeof CommentSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Comment: Model<CommentDocument> =
  (mongoose.models.Comment as Model<CommentDocument>) ||
  mongoose.model<CommentDocument>("Comment", CommentSchema);

export default Comment;
