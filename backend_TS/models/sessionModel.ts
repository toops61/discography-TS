import mongoose, { Model, model, Schema } from "mongoose";

export interface SessionType {
  _id?: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionModelType extends SessionType, Document {}

const sessionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  userAgent: String,
  ip: String
}, {
  timestamps: true,
  collection: "sessions"
});

const SessionModel = (mongoose.models.SessionModel as Model<SessionModelType>) 
?? model<SessionModelType>("SessionModel", sessionSchema);

export { SessionModel };