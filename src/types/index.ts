export type UserRole = "owner" | "editor" | "viewer";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentCollaborator {
  userId: string;
  role: UserRole;
}

export interface IDocument {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: IDocumentCollaborator[];
  yjsState?: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
