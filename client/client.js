const socketClient = require('socket.io-client')
const socket = socketClient('http://127.0.0.1:8080')

const time = parseInt(process.argv[2], 10)

socket.on('getTime', function() {
  console.log('Sending time: ' + time)
  socket.emit('clientTime', time)
})

socket.on('setNewTime', function(correction) {
  fixTime(correction)
})

function fixTime(correction) {
  console.log('Fixing time with: ' + correction)
  time += correction
}
