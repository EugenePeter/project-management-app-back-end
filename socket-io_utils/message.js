const Message = require("../models/Messages-models");

const formatMsg = (sender, message, room) => {
    return {
        sender,
        message,
        date: new Date().toISOString(),
        room,
    };
};

const getRoomMessagesFn = async (room) => {
    let currentUser = new Message(room);
    const result = await currentUser.getMessages();
    return result;
};

module.exports = { formatMsg, getRoomMessagesFn };
