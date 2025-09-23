const getUserData = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

const express =reqiure('express');

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

module.exports=userRouter;