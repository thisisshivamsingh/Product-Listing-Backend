const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const productRouter = require("./routes/index");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Body parser, reading data from body into req.body
app.use(cors({ origin: "*" }));
app.use(express.json());

// 1) GLOBAL MIDDLEWARES
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/devcore02.cimet.io", productRouter);

app.use(globalErrorHandler);

module.exports = app;
