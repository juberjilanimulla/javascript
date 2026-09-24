import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db.js";
import path from "path";
import config from "./config.js";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();
const port = config.PORT;
const prod = config.PRODDEV === "prod";

app.set("trust proxy", true);

morgan.token("remote-addr", function (req) {

  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
});

morgan.token("url", (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return req.originalUrl;
});

app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);

//middleware
app.use(express.json());
if (!prod) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.json({ limit: "10mb" }));
}

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ error: 'Invalid JSON input' });
  }
  next(err); // Pass to the next middleware if not a JSON error
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});


dbConnect()
.then(()=>{
 app.listen(port, () =>{
    console.log(`Server is listening at${port}`)
 })
}).catch((error)=>{
  console.log("unable to connected database",error)
})