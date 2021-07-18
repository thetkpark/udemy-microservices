import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@sp-udemy-ticketing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { stripe } from '../stripe'
import { Order } from '../models/order'
import { Payment } from '../models/payment'

const router = express.Router()

router.post(
	'/api/payments',
	requireAuth,
	[
		body('token').notEmpty().withMessage('token must be provided'),
		body('orderId').notEmpty().withMessage('orderId must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body
		const order = await Order.findById(orderId)

		if (!order) throw new NotFoundError()
		if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
		if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for an cancelled order')

		const { id: stripeId } = await stripe.charges.create({
			currency: 'usd',
			amount: order.price * 100,
			source: token,
		})

		const payment = Payment.build({ orderId, stripeId })
		await payment.save()

		res.status(201).send({ success: true })
	}
)

export { router as createChargeRouter }
