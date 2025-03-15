import express from 'express'
import {validateData} from '../middleware/zodValidation'
import { userValidationType } from '../model/validation/userValidation'
import trycatch from '../utils/tryCatch'
import { userlogin, userRegistration } from '../controller/authController'
const routes=express.Router()

routes
.post('/userRegistration',validateData(userValidationType),trycatch(userRegistration))
.post('/userlogin',trycatch(userlogin))
export default routes