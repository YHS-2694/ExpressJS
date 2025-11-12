import express from "express";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- REQUEST LOGGER MIDDLEWARE ---
const requestLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  const method = req.method;
  const url = req.url;

  console.log(`[${time}] ${method} request to ${url}`);

  next();
};

// Register the middleware: It runs for every request.
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Hello from Express inside a Dev Container!", name: "Young Ha Shin" });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.get("/api/time", (req, res) => {
  const currentTime = new Date();

  const timeString = currentTime.toISOString();

  res.status(200).json({
    currentTime: timeString,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});