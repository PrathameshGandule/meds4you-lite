import { connect } from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        process.env.NODE_ENV === 'development' ? console.log('MongoDB connected') : null;
} catch (err) {
        process.env.NODE_ENV === 'development' ? console.log("Error: \n", err) : null;
        process.exit(1);
    }
};

export default connectDB;