import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@sp-udemy-ticketing/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('ticketId must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		res.send({})
	}
)

export { router as newOrderRouter }
