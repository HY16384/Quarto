const express = require("express")
const app = express()

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static("public"))
const http = require('http').Server(app)

let boardlist = {
  "board-state": {
    "1-1": "",
    "1-2": "",
    "1-3": "",
    "1-4": "",
    "2-1": "",
    "2-2": "",
    "2-3": "",
    "2-4": "",
    "3-1": "",
    "3-2": "",
    "3-3": "",
    "3-4": "",
    "4-1": "",
    "4-2": "",
    "4-3": "",
    "4-4": ""
  },
  "remainings": ["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111"]
}

let boardJson = JSON.parse(JSON.stringify(boardlist))

let state = 0

app.get("/playground", function(req, res) {
  res.render("playground")
})

app.get("/", function(req, res) {
  if (state != -1) {
    res.redirect('/playground')
  }else {
    res.render("home")
  }
})

const io = require('socket.io')(http);

io.on('connection', (socket) => {
  switch (state) {
    case 0:
      socket.emit("first-player-selection-start", boardJson)
      break
    case 1:
      socket.emit("second-player-put-start", "", boardJson)
      break
    case 2:
      socket.emit("second-player-selection-start", boardJson)
      break
    case 3:
      socket.emit("first-player-put-start", "", boardJson)
      break
  }
  socket.on('first-player-select-the-piece', (type) => {
    boardJson["remainings"] = boardJson["remainings"].filter(item => item != type)
    state = 1
    console.log(boardJson,state)

    socket.emit("second-player-put-start", type, boardJson)
  })

  socket.on('second-player-put-the-piece', (type, x, y) => {
    boardJson["board-state"][(x + "-" + y).toString()] = type
    console.log(boardJson["board-state"][(x + "-" + y).toString()])
    // TODO: 勝利処理
    let isEnd = false
    for (let i = 0; i < 4; i++) {
      let isXOk = true
      let isYOk = true
      for (let j = 0; j < 4; j++) {
        let xLine = boardJson["board-state"][((j+1) + "-" + y).toString()]
        let yLine = boardJson["board-state"][(x + "-" + (j+1)).toString()]
        console.log(xLine,yLine)
        if (xLine!="" && yLine!="") {
          if (type.charAt(i)!=xLine.charAt(i)) {
            isXOk = false
          }
          if (type.charAt(i)!=yLine.charAt(i)) {
            isYOk = false
          }
        } else {
          isXOk = false
          isYOk = false
        }
      }
      if(isXOk == true || isYOk == true) {
        isEnd = true
      }
    }
    if(isEnd == false) {
      state = 2
      //// TODO: 2から2に抜けてる
      console.log(boardJson,state)
      socket.emit("first-player-selection-start", boardJson)
    } else {
      state = 5
      console.log(boardJson,state)
      console.log("player2 win")
    }
  })

  socket.on('second-player-select-the-piece', (type) => {
    boardJson["remainings"] = boardJson["remainings"].filter(item => item != type)
    state = 3
    console.log(boardJson,state)
    socket.emit("first-player-put-start", type, boardJson)
  })

  socket.on('first-player-put-the-piece', (type, x, y) => {
    boardJson["board-state"][(x + "-" + y).toString()] = type
    // TODO: 勝利処理
    let isEnd = false
    for (let i = 0; i < 4; i++) {
      let isXOk = true
      let isYOk = true
      for (let j = 0; j < 4; j++) {
        let xLine = boardJson["board-state"][((j+1) + "-" + y).toString()]
        let yLine = boardJson["board-state"][(x + "-" + (j+1)).toString()]
        console.log(xLine,yLine)
        if (xLine=="") {
          isXOk = false
        } else if (type.charAt(i)!=xLine.charAt(i)) {
          isXOk = false
        }
        if (xLine=="") {
          isXOk = false
        } else if (type.charAt(i)!=yLine.charAt(i)) {
          isYOk = false
        }
      }
      if(isXOk == true || isYOk == true) {
        isEnd = true
      }
    }
    if(isEnd == false) {
      state = 0
      console.log(boardJson,state)
      socket.emit("second-player-selection-start", boardJson)
    } else {
      state = 4
      console.log(boardJson,state)
      console.log("player1 win")
    }
  })

})

http.listen(3000, function() {
  console.log("Server started");
})
