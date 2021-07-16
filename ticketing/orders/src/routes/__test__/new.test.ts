import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@sp-udemy-ticketing/common'
import { natsWrapper } from '../../nats-wrapper'

it('return an error if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId()
	await request(app)
		.post('/api/orders')
		.set('Cookie', signup())
		.send({
			ticketId,
		})
		.expect(404)
})

it('return an error if the ticket is already resrved', async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Test Ticket',
		price: 99,
	})
	await ticket.save()
	const order = Order.build({
		ticket,
		userId: 'someUserId',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	})
	await order.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', signup())
		.send({
			ticketId: ticket.id,
		})
		.expect(400)
})

it('reserve a ticket', async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Test Ticket',
		price: 99,
	})
	await ticket.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', signup())
		.send({
			ticketId: ticket.id,
		})
		.expect(201)
})

it('emits an order created event', async () => {
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Test Ticket',
		price: 99,
	})
	await ticket.save()

	await request(app)
		.post('/api/orders')
		.set('Cookie', signup())
		.send({
			ticketId: ticket.id,
		})
		.expect(201)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
