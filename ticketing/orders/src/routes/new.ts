import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@sp-udemy-ticketing/common'
import { body } from 'express-validator'

const router = express.Router()

router.post(
	'/api/orders',
	requireAuth,
	[body('ticketId').notEmpty().withMessage('ticketId must be provided')],
	async (req: Request, res: Response) => {
		res.send({})
	}
)

export { router as newOrderRouter }
