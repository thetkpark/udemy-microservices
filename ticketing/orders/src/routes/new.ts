import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sp-udemy-ticketing/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

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
		// Find the ticket
		const ticket = await Ticket.findById(req.body.ticketId)
		if (!ticket) throw new NotFoundError()

		// Make sure that ticket is not already reserved
		const isReserved = await ticket.isReserved()
		if (isReserved) throw new BadRequestError('Ticket is already reserved')

		// Calculate an expiration datetime for this order
		const duration = parseInt(process.env.EXPIRATION_WINDOW_SECONDS!)
		const expiration = dayjs().add(duration, 'second')

		// Build the order and save
		const order = Order.build({
			userId: req.currentUser!.id,
			expiresAt: expiration.toDate(),
			ticket: ticket,
			status: OrderStatus.Created,
		})
		await order.save()

		// Publish an order:created event
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			status: order.status,
			userId: order.userId,
			expiresAt: expiration.toISOString(),
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
			version: order.version,
		})

		res.status(201).send(order)
	}
)

export { router as newOrderRouter }
