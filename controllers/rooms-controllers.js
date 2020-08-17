let Rooms = require("../models/Rooms-models");
const { reset } = require("nodemon");

exports.apiRooms = function (req, res) {
    console.log(req.body);
    let rooms = new Rooms(req.body);
    console.log(rooms);
    rooms
        .createRooms()
        .then((result) => {
            res.json({
                room: rooms.data.roomName,
                isRoomPosted: result,
                successMessage: `Succesfully added room ${rooms.data.roomName} `,
            });
        })
        .catch((regErrors) => {
            let error = {
                isRoomPosted: false,
                errorMessage: "Room name already exist",
            };
            res.status(500).send(error);
        });
};

exports.apiGetRooms = async function (req, res) {
    let rooms = new Rooms();
    rooms.getRooms().then((response) => {
        console.log(response);
        res.json(response);
    });
};

// exports.apiGetRoomData = async function (req, res) {
//     let rooms = new Rooms();
//     rooms.getRooms().then((response) => {
//         console.log(response);
//         res.json(response);
//     });
// };
