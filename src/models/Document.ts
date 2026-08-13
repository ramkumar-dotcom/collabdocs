import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CollaboratorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      default: "editor",
    },
  },
  { _id: false }
);

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "Untitled document",
    },
    // Fallback HTML/JSON snapshot (Yjs state is source of truth for live collab)
    content: {
      type: String,
      default: "",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collaborators: {
      type: [CollaboratorSchema],
      default: [],
    },
    // Binary Yjs document state for persistence between sessions
    yjsState: {
      type: Buffer,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ ownerId: 1, updatedAt: -1 });
DocumentSchema.index({ "collaborators.userId": 1 });

export type DocumentDocument = InferSchemaType<typeof DocumentSchema> & {
  _id: mongoose.Types.ObjectId;
};

const DocumentModel: Model<DocumentDocument> =
  (mongoose.models.Document as Model<DocumentDocument>) ||
  mongoose.model<DocumentDocument>("Document", DocumentSchema);

export default DocumentModel;
