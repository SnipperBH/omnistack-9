const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://mesalvadb:aRv0o1q9i2w@mesalvabh-unpeq.mongodb.net/mesalva?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//GET - Listar informacoess
//POST - Cadastrar Usuarios
//PUT - Editar info
//DELETE - Deletar info

//req.query - Acessar query params (Filtros)
//req.params - Acessar route params (Edicao e delete)
//req.body - Acessar corpo da requisicao (Criacao e edicao)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'upload')))
app.use(routes);

server.listen(3333);