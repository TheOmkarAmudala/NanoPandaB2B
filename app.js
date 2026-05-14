const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fetchSoftware = require("./routes/fetchSoftware")
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/fetchSoftware",fetchSoftware)

// 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;