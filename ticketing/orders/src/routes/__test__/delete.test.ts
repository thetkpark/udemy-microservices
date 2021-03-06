import request from 'supertest'
import mongoose from 'mongoose'
import { OrderStatus } from '@sp-udemy-ticketing/common'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Ticket } from '../../models/ticket'
import { Order } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('return an error if delete not existing order', async () => {
	await request(app).get(`/api/orders/${mongoose.Types.ObjectId()}`).set('Cookie', signup()).send().expect(404)
})

it('return an error if delete the other user order', async () => {
	const user = signup()
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Concert',
		price: Math.ceil(Math.random() * 100),
	})
	await ticket.save()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', signup())
		.send({
			ticketId: ticket.id,
		})
		.expect(201)

	await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(401)
})

it('marks an order as cancelled', async () => {
	const user = signup()
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Concert',
		price: Math.ceil(Math.random() * 100),
	})
	await ticket.save()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201)

	await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200)

	const updatedOrder = await Order.findById(order.id)
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order cancelled event', async () => {
	const user = signup()
	const ticket = Ticket.build({
		id: mongoose.Types.ObjectId().toHexString(),
		title: 'Concert',
		price: Math.ceil(Math.random() * 100),
	})
	await ticket.save()

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201)

	await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
