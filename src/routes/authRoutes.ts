import express from 'express'
import {validateData} from '../middleware/zodValidation'
import { userValidationType } from '../model/validation/userValidation'
import trycatch from '../utils/tryCatch'
import { refreshToken, userLogin, userRegistration } from '../controller/authController'
const routes=express.Router()

routes
.post('/userRegistration',validateData(userValidationType),trycatch(userRegistration))
.post('/userlogin',trycatch(userLogin))
.post('/refresh-token',refreshToken)
export default routes