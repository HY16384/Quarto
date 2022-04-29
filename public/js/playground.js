const socket = io()
socket.on('first-player-selection-start', (board) => {
  console.log('first-player-selection-start')
  initBoard(board)
  
})

function initBoard(board) {
  const data = JSON.parse(board)
  const boardState = data["board-state"]
  const remainings = data["remainings"]
  for(let i=0; i<4; i++) {
    for(let j; j<4; j++) {
      let position = (i+1) + "-" + (j+1)
      let state = boardState[position]
      if (state != "") {
        $("#board-"+position).children("img").attr("src", "")
        $("#board-"+position).children("img").attr("src", "/img/"+state+".svg")
      } else {
        $("#board-"+position).children("img").attr("src", "")
      }
    }
  }

  for(let k = 0; k<16; k++) {
    let piece = remainings[k]
    if (piece != "") {
      $("#remain-"+(k+1)).children("img").attr("src", "/img/"+piece+".svg")
    }
  }
}
