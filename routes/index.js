var express = require("express");
var router = express.Router();
const cors = require("cors");

router.use(cors());

const userController = require("../controllers/users-controller");
const tokensController = require("../controllers/tokens-controllers");
const roomsController = require("../controllers/rooms-controllers");

/* GET home page. */

router.post("/createUsers", userController.apiRegister);
router.post("/updateUser", userController.apiUpdateUser);
router.get("/userInfo", userController.apiUserGet);
router.get("/userAll", userController.apiGetAll);
router.delete("/userDeleteById", userController.apiUserDelete);
router.get("/apiUserChecker", userController.apiUserChecker);
router.post("/login", userController.apiLogin);
router.post("/postToken", tokensController.apiToken);

// Roomss
router.post("/createRoom", roomsController.apiRooms);
router.get("/getRoom", roomsController.apiGetRooms);

module.exports = router;
