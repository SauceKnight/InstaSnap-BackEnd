const express = require("express");
require('dotenv').config();
const morgan = require("morgan");
const cors = require('cors');
const { environment } = require('./config');
const app = express();

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const indexRouter = require('./routes/index');

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true }));

//Routers are last middleware passed in ALWAYS
app.use(usersRouter);
app.use(postsRouter);
app.use(indexRouter);

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.status = 404;
    next(err);
});

// Custom error handlers.

// Generic error handler.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        stack: isProduction ? null : err.stack,
        errors: err.errors
    });
});


module.exports = app;