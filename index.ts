const express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const settings = require("./settings.json");
const dataConfig = require("./conf.json");
var dataStore = {};

// DATA STORE SETUP
try {
  Object.keys(dataConfig).map((key) => {
    if (dataStore[key] !== undefined) {
      console.error("object exists");
    } else {
      dataStore[key] = {
        readOnly: dataConfig[key].readOnly,
        value: dataConfig[key].default,
      };
    }
  });
  console.log("DataStore construction complete");
} catch {
  console.log("DataStore construction error");
}

// SERVER SETUP
io.origins("*:*"); //allow CORS on websocket

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

http.listen(settings.port, function () {
  console.log("Started on PORT ", settings.port);
});

// REQUESTS
app.get("/", function (req, res) {
  ///HTTP GET
  //Allow CORS on site (might not be needed at all)
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.send(dataReadAll());
});

io.on("connection", function (socket) {
  ///WEBSOCKET
  console.log("template connected");
  socket.on("getScore", function (args) {
    io.emit("scoreUpdate", dataReadAll());
    console.log("score sent");
  });
});

// UPDATE
app.post("/update", function (req, res) {
  if (
    settings.auth === false ||
    (settings.auth === true &&
      req.headers.user == settings.user &&
      req.headers.password == settings.password)
  ) {
    try {
      Object.keys(req.body).map((key) => {
        dataWrite(key, req.body[key]);
      });

      console.log(req.body, "updated to: ", dataStore);
      io.emit("scoreUpdate", dataReadAll());
      res.end("received");
    } catch {
      res.end("error updating");
    }
  } else {
    res.sendStatus(401);
    res.end();
  }
});

// DATA HANDLING
function dataRead(name) {
  return dataStore[name].value;
}

function dataReadAll() {
  var e = {};
  Object.keys(dataConfig).map((key) => {
    e[key] = dataRead(key);
  });
  return e;
}

function dataWrite(name, value) {
  if (dataStore[name].readOnly == false) {
    dataStore[name].value = value;
    return 0;
  } else {
    console.log(
      "Error changing ",
      name,
      ", Read-only data in DataStore cannot be changed"
    );
    return -1;
  }
}
