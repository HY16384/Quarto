const express = require("express")
const app = express()

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
const http = require('http').Server(app);


app.get("/", function(req, res) {
  res.render("home")
})

let boardlist = {
  "board-state": {
    "1-1": "", "1-2": "", "1-3": "", "1-4":"",
    "2-1": "", "2-2": "", "2-3": "", "2-4":"",
    "3-1": "", "3-2": "", "3-3": "", "3-4":"",
    "4-1": "", "4-2": "", "4-3": "", "4-4":""
  },
  "remainings": ["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111"]
}

app.get("/playground", function(req, res) {
  res.render("playground")
})

const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.emit("first-player-selection-start",JSON.stringify(boardlist))

  socket.on('first-player-select-the-piece', (type) => {

    socket.emit("second-player-put-start",boardlist)
  })
  socket.on('second-player-put-the-piece', (type, positionX, positionY) => {

    socket.emit("second-player-selection-start",boardlist)
  })
  socket.on('second-player-select-the-piece', (type) => {

    socket.emit("first-player-put-start",boardlist)
  })
  socket.on('first-player-put-the-piece', (type, positionX, positionY) => {

    socket.emit("first-player-selection-start",boardlist)
  })

})

http.listen(3000, function(){
  console.log("Server started");
})
