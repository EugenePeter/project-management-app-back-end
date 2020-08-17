let Tokens = require("../models/Tokens-models");

exports.apiToken = function (req, res) {
    let token = new Tokens(req.body);

    token
        .createToken()
        .then((result) => {
            res.json({
                result,
            });
        })
        .catch((regErrors) => {
            res.status(500).send("Error");
        });
};
