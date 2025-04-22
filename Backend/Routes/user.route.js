import express from 'express';
import userAuth from '../MiddleWare/userAuth.js';
import { getUser } from '../Controllers/user.controller.js';
const userRoute = express.Router();


userRoute.get('/user', userAuth, getUser);


export default userRoute;