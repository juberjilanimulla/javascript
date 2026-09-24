import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import dbConnect, { pool } from "./db.js";
import config from "./config.js";
import authRouter from "./routes/Authroutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorHandler, { notFoundHandler } from "./middleware/errorHandler.js";
import userRouter from "./routes/Userroutes.js";
import productRouter from "./routes/Productroutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const port = Number(config.PORT) || 4000;

app.set("trust proxy", true);

morgan.token("remote-addr", (req) => req.headers["x-forwarded-for"] || req.socket.remoteAddress);
app.use(morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms"));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));


app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.use(notFoundHandler);
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON input" });
  }
  next(err);
});
app.use(errorHandler);

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to database", error);
    process.exit(1);
  });