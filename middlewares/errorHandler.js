import { configDotenv } from "dotenv";

configDotenv();

const errorHandler = (err, userMessage, req, res, next) => {
    const statusCode = Number.isInteger(err.status) && err.status >= 100 && err.status < 600 ? err.status : 500;
    const env = process.env.NODE_ENV || "development";

    if (env === "development") {
        console.error("Error:", err.message);
        console.error("Stack Trace:", err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: userMessage || (env === "development" ? err.message : "Something went wrong!"),
    });
};


// Catch uncaught errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

// Catch unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

export default errorHandler;
