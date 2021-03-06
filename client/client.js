const fs = require('fs')
const ip = process.argv[2] || '127.0.0.1'
const port = process.argv[3] || '8080'
let time = parseInt(process.argv[4], 10) || '180'
const logFile = process.argv[5] || 'logs/clientlog.txt'
let uri = 'http://'+ip+':'+port+'' 
var socket = require('socket.io-client')(uri);

console.log('Starting with time: ' + time)
socket.on('getTime', function () {
  console.log('Sending time: ' + time)
  socket.emit('clientTime', time)
})

socket.on('setNewTime', function (data) {
  fixTime(data.correction, data.id)
})

function fixTime(correction, id) {
  let timeB4 = time
  console.log('Fixing time with: ' + correction)
  time += correction
  var fs = require('fs');
  let text =
    'Client ' + id + ' before sync time: ' + timeB4 + '\n' +
    'Client ' + id + ' was changed by: ' + correction + ' minutes\n' +
    'Client ' + id + ' after sync time: ' + time + '\n'
  fs.appendFile(logFile, text, function (err) {
    if (err) throw err;
    console.log('Loged!')
  });
}