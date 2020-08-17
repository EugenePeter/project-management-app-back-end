const {
    addUser,
    userLeft,
    getCurrentUser,
    getOnlineUsers,
    getUserIdFromTokenTable,
} = require("./socket-io_utils/user");
const { formatMsg, getRoomMessagesFn } = require("./socket-io_utils/message");

module.exports = (io) => {
    const admin = "Admin";

    // check if connected to server with socket io
    io.on("connection", (socket) => {
        console.log(`new connection from: ${socket.id}`);

        socket.on("userJoined", async (newUser, callback) => {
            //debug why is always keep getting the last user_id log out
            const { error, user } = await addUser({
                socketId: socket.id,
                ...newUser,
            });
            console.log("check -----------------");
            console.log(user);

            const userId = await getUserIdFromTokenTable({ ...newUser });

            console.log(userId);

            if (error) return callback(error);
            socket.join(user.room);

            // Send Welcome message to current user
            socket.emit(
                "message",
                formatMsg(
                    admin,
                    `Welcome to our ${user.room} chatroom, ${user.username}!`,
                    user.room
                )
            );

            // Broadcast message to everyone except the user
            socket.broadcast
                .to(user.room)
                .emit(
                    "message",
                    formatMsg(admin, `${user.username} has joined the chatroom.`)
                );

            // Get all messages in current room
            socket.emit("getRoomMessages", await getRoomMessagesFn(user.room));

            // Display all users in room
            io.to(user.room).emit("usersOnline", {
                room: user.room,
                users: await getOnlineUsers(user.room),
            });

            // no-room-chatroom
            // io.emit('usersOnline', { users: getOnlineUsers() });
            console.log("fffffffffffffffffffffffffffffffffffffffffff");
            socket.on("introduce", (token_id) => {
                console.log(`token id: ${token_id}`);
            });

            callback();
        });

        // Listen for chat messages
        socket.on("sendMessage", async (messageData) => {
            const user = await getCurrentUser(socket.id);

            io.to(user.room).emit("message", messageData);
        });

        // Listen when someone is typing a message
        socket.on("isTyping", async (name) => {
            const user = await getCurrentUser(socket.id);

            socket.broadcast.to(user.room).emit("isTyping", name);
        });

        // User disconnects
        socket.on("disconnect", async () => {
            const user = await userLeft(socket.id);

            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMsg(admin, `${user.username} has disconnected.`)
                );

                io.to(user.room).emit("usersOnline", {
                    room: user.room,
                    users: await getOnlineUsers(user.room),
                });
            }
        });
    });
};
