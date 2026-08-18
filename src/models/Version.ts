import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const VersionSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

VersionSchema.index({ documentId: 1, createdAt: -1 });

export type VersionDocument = InferSchemaType<typeof VersionSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Version: Model<VersionDocument> =
  (mongoose.models.Version as Model<VersionDocument>) ||
  mongoose.model<VersionDocument>("Version", VersionSchema);

export default Version;
