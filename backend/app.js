/**
 * Module dependencies.
 */

const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const uuid = require("uuid");
const http = require("http");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");
// const io = require("socket.io")(4000);

const Chat = require("./chat");

const chat = new Chat();
const app = express();

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy({ usernameField: "login" }, (login, password, done) => {
    axios
      .get(`http://localhost:5000/users?login=${login}`)
      .then(res => {
        const user = res.data[0];
        if (!user) {
          return done(null, false, { message: "Invalid credentials.\n" });
        }
        if (password != user.password) {
          return done(null, false, { message: "Invalid credentials.\n" });
        }
        return done(null, user);
      })
      .catch(error => done(error));
  })
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log(
    "Inside serializeUser callback. User id is save to the session file store here"
  );
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  axios
    .get(`http://localhost:5000/users/${id}`)
    .then(res => done(null, res.data))
    .catch(error => done(error, false));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.set("port", process.env.PORT || 4000);
app.use(
  session({
    genid: req => {
      return uuid(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: "secret code cat",
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.logger("dev"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/user", (req, res, next) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.statusCode = 403;
    res.end("User not found");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("logout");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      res.statusCode = 403;
      return res.end(info.message);
    }
    if (err || !user) {
      res.statusCode = 404;
      res.end("User not found");
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
});

app.get("/subscribe", (req, res) => chat.subscribe(res));

app.post("/publish", (req, res) => {
  const message = {
    message: req.body,
    user: req.user.login,
    time: new Date()
  };
  chat.publish(message);
  res.end("ok");
  axios({
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(message),
    url: "http://localhost:5000/messages/"
  });
});

app.get("/messages", (req, res, next) => {
  axios
    .get(`http://localhost:5000/messages`)
    .then(messages => res.end(JSON.stringify(messages.data)))
    .catch(e => console.error(e));
});

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end("Bad request");
});

const staticDir = path.join(__dirname, "front/build");

app.use(express.static(staticDir));

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
