const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 2500;

app.use(express.static("public"));

// DB connection

mongoose
  .connect(
    "mongodb+srv://Moll:Luludif@cluster0.4sytslm.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

let io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(`'New connection: ${socket.id}'`);
});

io.on("connection", (socket) => {
  console.log(`'New connection: ${socket.id}'`);

  //recieve event

  socket.on("comment", (data) => {
    console.log(data);
    //{username: 'dsd', comment:'this' time:Date()}
    data.time = Date();
    socket.broadcast.emit("comment", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});
