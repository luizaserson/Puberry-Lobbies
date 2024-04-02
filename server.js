const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let lobbies = []; // Stores lobbies
let userLobbyMap = {}; // Maps socket ID to lobby ID
let socketUserMap = {}; // Maps socket ID to username
let activeUsernames = {}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log("USER CONNECTED");
    socket.emit('updateLobbies', lobbies);

    socket.on('registerUsername', (username) => {
        if (activeUsernames[username]) {
            socket.emit('usernameTaken', username);
        } else {
            activeUsernames[username] = true;
            socket.emit('usernameRegistered', username);
        }
    });

    // When a user creates or joins a lobby, capture their username
    socket.on('createLobby', ({ name, capacity, description, username }) => {
        if (lobbies.some(lobby => lobby.name === name)) {
            socket.emit('lobbyCreationFailed', 'Lobby name already exists.');
            return;
        }
    
        const newLobby = {
            id: uuidv4(),
            name,
            capacity,
            description,
            users: [{ id: socket.id, username: username }], // Add the creator here
            gameStarted: false // New attribute to track if the game has started
        };
        lobbies.push(newLobby);
        userLobbyMap[socket.id] = newLobby.id;
        socketUserMap[socket.id] = username;
    
        io.emit('updateLobbies', lobbies);
    });
    

    socket.on('joinLobby', ({ lobbyId, username }) => {
        if (userLobbyMap[socket.id]) {
            return socket.emit('actionFailed', 'You are already in a lobby.');
        }
    
        const lobby = lobbies.find(l => l.id === lobbyId);
        if (!lobby) {
            return socket.emit('actionFailed', 'Lobby does not exist.');
        }
    
        if (lobby.users.length >= lobby.capacity) {
            return socket.emit('actionFailed', 'Lobby is full.');
        }
    
        lobby.users.push({ id: socket.id, username });
        userLobbyMap[socket.id] = lobbyId;
    
        if (lobby.users.length == lobby.capacity) {
            lobbies = lobbies.filter(l => l.id !== lobbyId);
        }
    
        io.emit('updateLobbies', lobbies); // Update all clients with the new state
    });
    
    
    
    socket.on('leaveLobby', ({ lobbyId }) => {
        const lobby = lobbies.find(l => l.id === lobbyId);
        if (lobby) {
            lobby.users = lobby.users.filter(user => user.id !== socket.id);
            delete userLobbyMap[socket.id];
    
            if (lobby.users.length === 0) {
                lobbies = lobbies.filter(l => l.id !== lobbyId);
            }
    
            io.emit('updateLobbies', lobbies);
        }
    });

    socket.on('disconnect', () => {
        const lobbyId = userLobbyMap[socket.id];
        if (lobbyId) {
            // Find the lobby and remove the user
            const lobby = lobbies.find(l => l.id === lobbyId);
            if (lobby) {
                lobby.users = lobby.users.filter(user => user !== socketUserMap[socket.id]);
                if (lobby.users.length === 0) {
                    lobbies = lobbies.filter(l => l.id !== lobbyId);
                    io.emit('lobbyEmpty', { lobbyId: lobby.id, lobbyName: lobby.name });
                }
            }
        }
        delete userLobbyMap[socket.id];
        delete socketUserMap[socket.id];

        const username = Object.keys(activeUsernames).find(key => activeUsernames[key] === socket.id);
        if (username) {
            delete activeUsernames[username];
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));