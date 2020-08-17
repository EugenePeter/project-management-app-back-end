const r = require("rethinkdb");
const tokensCollection = r.table("tokens");

class Token {
    constructor(data) {
        this.data = data;
    }

    async createToken() {
        console.log(this.data);
        try {
            const result = await tokensCollection.insert(this.data).run(connection);

            if (result) {
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getUserId() {
        try {
            const result = await tokensCollection.run(connection);
            const ids = result._responses[0].r;

            if (ids) {
                const convertReducer = ids.reduce((accumulator, item) => {
                    return {
                        ...accumulator,
                        [item.token]: item,
                    };
                }, {});
                // console.log("reduced -----------------");
                // console.log("reduced -----------------");
                // console.log("reduced -----------------");
                // console.log(convertReducer);
                return convertReducer;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = Token;
