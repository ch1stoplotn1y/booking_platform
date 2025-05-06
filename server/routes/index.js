import {Router} from 'express'
const router = new Router()

import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import amenityRouter from './amenityRouter.js'
import propertyRouter from './propertyRouter.js'
import bookingRouter from './bookingRouter.js'
import reviewRouter from './reviewRouter.js'

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/amenity', amenityRouter)
router.use('/property', propertyRouter)
router.use('/booking', bookingRouter)
router.use('/review', reviewRouter)

export default router