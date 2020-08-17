const r = require("rethinkdb");
const roomsCollection = r.table("rooms");

class Rooms {
    constructor(data) {
        this.data = data;
        this.errors = [];
    }

    async doesRoomExist() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await roomsCollection
                    .filter({ roomName: this.data.roomName })
                    .run(connection);
                console.log("checking if room name already exist //////////");
                const roomExist = result._responses[0].r[0].roomName;
                console.log(roomExist);
                if (roomExist === this.data.roomName) {
                    this.errors.push("Rooms name already exist");
                    // return;
                }
            } catch (e) {
                console.log(e);
            }
            resolve();
        });
    }

    async createRooms() {
        return new Promise(async (resolve, reject) => {
            await this.doesRoomExist();
            await console.log(this.errors);
            if (!this.errors.length) {
                console.log("Room name is available");
                const result = await roomsCollection
                    .insert(this.data)
                    .run(connection);
                console.log(result);
                resolve(true);
            } else {
                reject(this.errors);
            }
        });
    }

    async getRooms() {
        return new Promise(async (resolve, reject) => {
            const result = await roomsCollection.run(connection);
            const rooms = result._responses[0].r;
            if (rooms) {
                // const mapRooms = rooms.map((roomName) => roomName);
                // console.log(rooms);

                // console.log(mapRooms);
                const convertReducer = rooms.reduce((accumulator, item) => {
                    return {
                        ...accumulator,
                        [item.id]: item,
                    };
                }, {});
                // console.log(convertReducer);
                resolve(convertReducer);
                return convertReducer;
            } else {
                let dataresult = {
                    success: false,
                    message: "fetch room failed",
                };
                reject(dataresult);
                return dataresult;
            }
        });
    }
}

module.exports = Rooms;
