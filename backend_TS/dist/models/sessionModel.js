var _a;
import mongoose, { model, Schema } from "mongoose";
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
const SessionModel = (_a = mongoose.models.SessionModel) !== null && _a !== void 0 ? _a : model("SessionModel", sessionSchema);
export { SessionModel };
