let Users = require("../models/Users-models");
const jwt = require("jsonwebtoken");

// @POST
// Create A User
exports.apiCreate = async (req, res) => {
  let createUser = new Users(req.body);
  console.log(createUser)
  let isExist = new Users(req.body.username);
  const resultIfExist = await isExist.isUserExist();

  let resultContainer = [];

  // Check if user exists first then create a user if it doesn't exists
  if (!resultIfExist) {
    const result = await createUser.create().catch((err) => console.log(err));
    if (result.success) {
      let objectRes = {
        isAccess: true,
        results: result,
      };
      resultContainer.push(objectRes);
      res.json(resultContainer);
    } else {
      res.json(result.message, result.error);
    }
  } else {
    let objectRes = {
      isAccess: false,
      results: "No User Created",
    };
    resultContainer.push(objectRes);
    res.json(resultContainer);
  }
};

exports.apiRegister = async function (req, res) {
  let user = new Users(req.body);
  user
    .register()
    .then((response) => {
      // console.log('no error from the register controller')
      // console.log('//////////////////////////////')
      // console.log(response)
      res.json({
        registerSuccess: true,
        message: 'Successfully registered'
      });
    })
    .catch((regErrors) => {
      let error = {
        registerSuccess: false,
        errorMessage: 'Username is already taken'
      }
      console.log(' is should not be here coz no error')
      res.status(500).send(error);
    });
};


// @POST
// Login
exports.apiLogin = async function (req, res) {
  console.log(req.body)
  let user = new Users(req.body);
  user
    .login()
    .then((result) => {
      console.log(result)
      console.log(result)
      console.log(result)
      console.log(result)
      if (result) {
        res.json({
          token: jwt.sign(
            {
              username: user.data.username,
            },
            process.env.JWTSECRET,
            { expiresIn: "1d" }
          ),
          id: result,
          room: result.room,
          username: user.data.username,
          status: true,
          isOnline: result.isOnline,
          loginMessage: 'You have succesfully logged in'
        });
      } else {
        let error = {
          loginStatus: false,
          errorMessage: "You entered an incorrect username or password",
        }
        res.status(500).send(error);
      }
    })
    .catch((e) => {
      res.json(e);
    });
};

exports.apiGetAll = async (req, res) => {
  let user = new Users((req.body = null));
  res.json(await user.getAll());
};

exports.apiUserGet = async (req, res) => {
  // console.log(req.query.id)// query or params debug mode
  let getUserId = new Users(req.query.id);
  const result = await getUserId.getUserById();
  res.json(result);
};

exports.apiUpdateUser = async (req, res) => {
  let userObject = {
    username: req.body.username,
    room_id: req.body.room_id,
    isOnline: true,
  };
  // console.log(userObject , req.query.id)// query or params debug mode
  let userUpdate = new Users(req.query.id, userObject);
  const result = await userUpdate.userUpdateById();
  res.json(result);
};

exports.apiUserDelete = async (req, res) => {
  let user_id = req.query.id;
  let userUpdate = new Users(user_id);
  const result = await userUpdate.userDeleteById();
  res.json(result);
};

exports.apiUserChecker = async (req, res) => {
  let userUpdate = new Users(req.query.username);
  const result = await userUpdate.isUserExist();
  res.json(result);
};