const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const ip = process.argv[2] || 'http://127.0.0.1'
const port = process.argv[3] || 8080
let serverTime = process.argv[4] || 185
const d = process.argv[5] || 60
const slavesfile = process.argv[6] || 'slaves.txt'
const logFile = process.argv[7] || 'logs/clientlog.txt'

const clients = {}

server.listen(port, () => {
  console.log('Server is listening on port: ' + port)
});

setInterval(() => {
  setDifferences()

  const medium = mediumTime()

  setCorrections(medium)
  sendCorrections()

  serverTime += medium

  io.emit('getTime')
  console.log(medium)
}, 10000);

function sendCorrections() {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      if (client.correction > 0) {
        console.log('Sending correction to all clients')
        io.to(client.id).emit('setNewTime',
          {
            correction: client.correction,
            id: client.id,
          })
      }
    }
  })
}

function setCorrections(medium) {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      clients[key].correction = medium - clients[key].dif
    }
  })
}

function setDifferences() {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      clients[key].dif = client.time - serverTime
    }
  })
}

function mediumTime() {
  const sum = Object.keys(clients).reduce((prev, key) => {
    return clients[key] === -1 ? prev : prev + clients[key].dif
  }, 0)
  let count = Object.keys(clients).filter((key) => {
    return clients[key] !== -1
  }).length
  count += 1
  return sum / count
}

app.get('/', function (req, res) {
  let times = ''
  for (let i in clients)
    if (clients[i] !== -1)
      times += clients[i].id + ': ' + clients[i].time + ' <br>'
  times += 'Server time: ' + serverTime
  res.send(times)
})

io.on('connection', function (socket) {
  console.log('Client' + socket.id + ' connected')
  socket.emit('getTime')

  socket.on('clientTime', function (data) {
    if (!clients[socket.id]) {
      clients[socket.id] = {
        id: socket.id,
        time: data,
        dif: 0,
        correction: 0,
      }
      console.log('Client does not exist in colection yet got: ', data)
    } else {
      clients[socket.id].time = data
    }
  })
  socket.on('disconnect', function () {
    clients[socket.id] = -1
    console.log('Client' + socket.id + ' disconnected')
  })
})
