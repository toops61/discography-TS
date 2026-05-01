import mongoose from "mongoose";
export async function connectToDB() {
    if (!mongoose || !mongoose.connection) {
        throw new Error("Mongoose is not properly initialized");
    }
    if (mongoose.connection.readyState === 1)
        return;
    if (!process.env.URI) {
        throw new Error("MONGO environment variable is not defined");
    }
    try {
        await mongoose.connect(process.env.URI);
        console.log("Connected to database:", mongoose.connection.name);
    }
    catch (error) {
        console.error("Database connection error:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to connect to the Database: ${error.message}`);
        }
        throw new Error("Failed to connect to the Database: unknown error");
    }
}
