import { PrismaClient } from "@prisma/client";
import express from "express";
import winston from "winston";

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

const app = express();
app.use(express.json());

const client = new PrismaClient();

app.get("/", (req, res) => {
  logger.info("Received a GET request");
  res.json({
    message: process.env.STRIPE_SECRET + "---------test",
  });
});

app.post("/", async (req, res) => {
  try {
    const newUser = await client.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
      },
    });
    logger.info(`New user created: ${newUser.id}`);
    res.json({
      message: "Done signing up!",
    });
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(500).json({
      message: "Failed to sign up.",
    });
  }
});

app.listen(3000, () => {
  logger.info("App is running at port 3000");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} reason: ${error}`);
});
