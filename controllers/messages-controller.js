const r = require('rethinkdb')

let Messages = require('../models/Messages-models');

// @POST /
// Add or insert a message
exports.apiAddMessage = async (req, res) => {
    let message = new Messages(req.body)
    console.log(message)
    const result = message.addMessage()
    console.log(result)

    return res.json(result)

}

// -- This http get request is not used, instead, we are using the 
// -- socket controller to get all messages from the database

// @GET /
// Get all messages
// exports.apiGetMessages = async (req, res) => {
//     let message = new Messages()
//     const result = await message.getMessages()

//     return res.json(result)
// }

