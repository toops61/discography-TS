import { Model, model, models, Schema } from "mongoose";

export interface sessionType {
    userId: string;
    sessionId?: string;
    createdAt?: string;
    expiresAt?: string;
}

export interface sessionModelType extends sessionType, Document {}

const sessionSchema = new Schema<sessionModelType>({
    userId: {
        type:String,
        required:true
    },
    expiresAt: {
        type:String,
        required:true,
        index: { expireAfterSeconds: 0}
    }
},{timestamps:true,collection:"sessions"})

const SessionModel = (models.SessionModel as Model<sessionModelType>) 
?? model<sessionModelType>("SessionModel", sessionSchema);

export { SessionModel };