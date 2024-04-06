require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const indexRoutes = require("./routes/indexRoutes");
const ErrorHandler = require("./utils/errorHandler");
const cors = require('cors')

// mongodb connection
require("./models/database").connectDatabase();

// logger
const logger = require("morgan");
app.use(logger("tiny"));

// bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({credentials:true,origin:true}));


// expressSession and cookie parser
const session = require('express-session');
const cookieparser = require('cookie-parser');

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.EXPRESS_SESSION_SECRET,
}));

app.use(cookieparser());

// express file-uploader

const fileUploade = require('express-fileupload');
app.use(fileUploade());

// routes
app.use("/", indexRoutes);
app.use('/resume', require("./routes/resumeRoutes"));
app.use('/employe', require("./routes/employeRoutes"));

// error handling
const { generatedErrors } = require("./middlewares/error");
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404));
});

app.use(generatedErrors);

app.listen(
  process.env.PORT,
  console.log(`server running on ${process.env.PORT}`)
);
