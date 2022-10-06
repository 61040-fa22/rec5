import express, { Request, Response } from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import http from 'http';
import fs from "fs";
import dotenv from "dotenv";
import * as validator from '../routes/middleware';

// load environmental variables
dotenv.config({});

// initalize an express app
const app = express();

// declare the root directory
app.use(express.static(path.join(__dirname, '../public')));

// view engine setup
app.engine('html', engine({ extname: '.html', defaultLayout: false }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../public'));

// set the port
app.set('port', process.env.PORT || 3000);

// log requests in the terminal
app.use(logger('dev'));

// parse incoming requests with JSON payloads ('content-type: application/json' in header)
app.use(express.json());

// parse incoming requests with urlencoded payloads ('content-type: application/x-www-form-urlencoded' in header)
app.use(express.urlencoded({ extended: false }));

// parse Cookie header
app.use(cookieParser());

// initialize cookie session
app.use(session({
  secret: '6170',
  resave: true,
  saveUninitialized: false
}));

// use declaration merging to add other properties to SessionData
declare module 'express-session' {
  export interface SessionData {
    userId: string;
  }
}

// this makes sure that if a user is logged in, they still exist in the database
// app.use(validator.isCurrentSessionUserExists);

// add routers from routes folder
fs.readdirSync(path.join(__dirname, '../routes')).forEach((file: string) => {
  const filename: string = file.split(".")[0]

  // add all routes besides middleware and utilities
  if (filename !== "middleware" && filename !== "utilities") {
    const { prefix, router } = require(`../routes/${filename}`)
    app.use(prefix, router);
  }
})

// catch all the other routes and display error message
app.all('*', (req: Request, res: Response) => {
  res.status(400).render('error');
});

// create server to listen to request at specified port
const server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log('Express server running at http://localhost:' + app.get('port'))
})
