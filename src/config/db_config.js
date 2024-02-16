import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_URL, {         
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Unable to connect to the database");
    }
}


connectToDatabase();


const db = mongoose.connection;

export default db;

