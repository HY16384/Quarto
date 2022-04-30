const socket = io()
socket.on('first-player-selection-start', (board) => {
  console.log('first-player-selection-start')
  initBoard(board["board-state"])
  $(".next-piece-container").children("img").remove()
  setRemaininigs(board["remainings"],true)
  //この下系うまくいってない
  $("#player1").addClass("active")
  $("#player2").removeClass("active")
  $(".remaining-pieaces-container").addClass("clickable")
  $(".board").removeClass("clickable")
})

socket.on('second-player-put-start', (type, board) => {
  console.log('second-player-put-start')
  console.log(board)
  initBoard(board["board-state"])
  initRemaininigs(board["remainings"],false)
  setPiece(type)
  $("#player1").removeClass("active")
  $("#player2").addClass("active")
  $(".remaining-pieaces-container").removeClass("clickable")
  $(".board").addClass("clickable")
})

socket.on('second-player-selection-start', (board) => {
  console.log('second-player-selection-start')
  initBoard(board["board-state"])
  setRemaininigs(board["remainings"],true)
  $(".next-piece-container").children("img").remove()
  $("#player1").removeClass("active")
  $("#player2").addClass("active")
  $(".remaining-pieaces-container").addClass("clickable")
  $(".board").removeClass("clickable")
})

socket.on('first-player-put-start', (type, board) => {
  console.log('first-player-put-start')
  setPiece(type, true)
  initBoard(board["board-state"])
  initRemaininigs(board["remainings"],true)
  $("#player1").addClass("active")
  $("#player2").removeClass("active")
  $(".remaining-pieaces-container").removeClass("clickable")
  $(".board").addClass("clickable")
})

function initBoard(boardState) {
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      let position = ((i+1) + "-" + (j+1)).toString()
      let state = boardState[position]
      $("#board-"+position).children("img").remove()
      if (state != "") {
        let img = $("<img>").attr("src", "/img/"+state+".svg")
        $("#board-"+position).addClass("piecein")
        $("#board-"+position).append(img.clone())
      } else {
        $("#board-"+position).children("img").remove()
      }
    }
  }
}

function setRemaininigs(remainings, isFirst) {
  for(let k = 0; k < Object.keys(remainings).length; k++) {
    $("#remain-"+(k+1).toString()).children("img").remove()
    let piece = remainings[k]
    console.log(remainings)
    if (piece != "") {
      let img = $("<img>").attr("src", "/img/"+piece+".svg")
      $("#remain-"+(k+1).toString()).append(img.clone())
      $("#remain-"+(k+1).toString()).on("click", function() {
        for(let l = 0; l<16; l++) {
          if(l != k) {
            $("#remain-"+(l+1).toString()).removeClass("active")
          }
        }
        $("#remain-"+(k+1).toString()).toggleClass("active")
        $("#remain-"+(k+1).toString()).children(".remaining-pieace-btn").on("click", function() {
          if(isFirst == true) {
            socket.emit('first-player-select-the-piece', piece)
          } else {
            socket.emit('second-player-select-the-piece', piece)
          }
        })
      })
    } else {
      $("#remain-"+(k+1).toString()).children("img").remove()
    }
  }
}

function initRemaininigs(remainings, isFirst) {
  for(let k = 0; k < Object.keys(remainings).length; k++) {
    $("#remain-"+(k+1).toString()).children("img").remove()
    let piece = remainings[k]
    console.log(remainings)
    if (piece != "") {
      let img = $("<img>").attr("src", "/img/"+piece+".svg")
      $("#remain-"+(k+1).toString()).append(img.clone())

    } else {
      $("#remain-"+(k+1).toString()).children("img").remove()
    }
  }
}

function setPiece(type, isFirst) {
  let img = $("<img>").attr("src", "/img/"+type+".svg")
  $(".next-piece-container").append(img.clone())
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      let position = ((i+1) + "-" + (j+1)).toString()
      $("#board-"+position).on("click", function() {
        for(let k = 0; k < 4; k++) {
          for(let l = 0; l < 4; l++) {
            if(k!=i || l!=j) {
              let other = ((k+1) + "-" + (l+1)).toString()
              $("#board-"+other).removeClass("active")
            }
          }
        }
        $("#board-"+position).addClass("active")

        $("#board-"+position).children(".board-btn").on("click", function() {
          if (isFirst == true) {
            socket.emit('first-player-put-the-piece', type, i+1, j+1)
          } else {
            socket.emit('second-player-put-the-piece', type, i+1, j+1)
          }
        })
      })
    }
  }
}
