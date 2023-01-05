const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");
const indexRouter = require("./components/home/index");
const usersRouter = require("./components/users/usersRouter");
const authRouter = require("./components/auth/authRouter");
const groupRouter = require("./components/group/groupRouter");
const rolesRouter = require("./components/roles/rolesRouter");
const presentationRouter = require("./components/presentation/presentRouter");
const slideRouter = require("./components/slide/slideRouter");
const handlerSocket = require("./components/socket/handleSocket");
const questionsRouter = require("./components/questions/questionsRouter");
require("dotenv").config();

const app = express();
const server = http.Server(app);

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(function (req, res, next) {
  res.io = io;
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/groups", groupRouter);
app.use("/roles", rolesRouter);
app.use("/presentations", presentationRouter);
app.use("/slides", slideRouter);
app.use("/questions", questionsRouter);

// Socket
const onConnection = (socket) => {
  handlerSocket(io, socket);
};

io.on("connection", onConnection);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };
