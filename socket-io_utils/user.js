const UsersModel = require("../models/Users-models");
const TokensModel = require("../models/Tokens-models");

const users = [];

const getUserIdFromTokenTable = async ({ token }) => {
    let userId = new TokensModel(token);
    const tokenKey = await userId.getUserId();
    console.log("tokenKey -----------------");
    console.log("tokenKey -----------------");
    console.log("tokenKey -----------------");
    console.log(tokenKey);

    function isString(token) {
        return typeof token === "string" || token instanceof String;
    }

    const isit = isString(token);

    console.log(isit);

    const stringToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImV1Z2VuZSIsImlhdCI6MTU5NzM2NjAzNCwiZXhwIjoxNTk3NDUyNDM0fQ.eZosr3ztmAwJJBGRgKHmisMuuBdEWgGHKa7vFNcYxIM";

    const uid = tokenKey[token];

    console.log("userId -----------------");
    console.log("userId -----------------");
    console.log("userId -----------------");
    console.log(uid);
};

const addUser = async ({ socketId, id, token, username, room, isOnline }) => {
    console.log("///////////////");
    console.log(username);
    console.log(isOnline);
    console.log(id);
    console.log(room);
    console.log(token);
    //get user if exist
    let user_id = new UsersModel(username);
    const existingUser = user_id.isUserExist();

    //get userId then update to isOnline to true
    let userUpdateOnline = new UsersModel(id, { isOnline: true });
    let dataTempUpdate = await userUpdateOnline.userUpdateById();
    //debuf only for now
    if (dataTempUpdate.success) {
        // console.log(dataTempUpdate.success)
    } else {
        // console.log(dataTempUpdate.success)
    }

    //get the user recently updated
    let getUserInfo = new UsersModel(id);
    const dataTempId = await getUserInfo.getUserById();
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(dataTempId);
    if (!username) return { error: "Username is required." };
    // if (!existingUser) {
    //   return {
    //     error: `${
    //       username[0].toUpperCase() + username.slice(1)
    //     } already exists. Please use another username.`,
    //   };
    // }

    const user = { socketId, id, token, username, room, isOnline };
    users.push(user);
    const userInner = dataTempId.data;

    // return { user: dataTempId.data, token: token };
    return { user };
};

const userLeft = async (id) => {
    // Find user in temporary 'users' array to fetch the userId and
    // update the isOnline status in the database
    const userTest = await users.filter((user) => user.socketId === id);

    if (userTest.length > 0) {
        let getALLuserOnline = new UsersModel(userTest[0].id, { isOnline: false });
        const OnlineUser = await getALLuserOnline.userUpdateById();

        console.log(OnlineUser.message);
        console.log(OnlineUser.message);

        const index = await users.findIndex((user) => user.socketId === id);

        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    } else {
        console.log("Way sulod");
    }
};

// old way with temporary array of sockets
// const getCurrentUser = (id) => users.find((user) => user.id === id);.
const getCurrentUser = async (id) => {
    const userTest = await users.filter((user) => user.socketId === id);

    if (userTest.length > 0) {
        let getAllUserById = new UsersModel(userTest[0].id);
        const userInfo = await getAllUserById.getUserById();
        return userInfo.data;
    } else {
        console.log("walay sulod");
    }
};

// room-based chat
// const gestOnlineUsers = (room) => users.filter((user) => user.room === room);
const getOnlineUsers = async (room) => {
    let getALLuserOnline = new UsersModel((data = null));
    const OnlineUser = await getALLuserOnline.getAllUserByFilter(true, room);
    return OnlineUser.data;
};

// const getOnlineUsers = (room) => users.filter(user => user.room === room)

// no-room-chatroom
// const getOnlineUsers = () => users.filter((user) => user);

module.exports = {
    addUser,
    userLeft,
    getCurrentUser,
    getOnlineUsers,
    getUserIdFromTokenTable,
};
