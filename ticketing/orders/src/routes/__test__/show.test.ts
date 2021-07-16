import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Ticket } from '../../models/ticket'

it('fetch the order', async () => {
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

	const res = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200)
	expect(res.body.id).toEqual(order.id)
	expect(res.body.ticket.id).toEqual(ticket.id)
})

it('return an error if fetch the other user order', async () => {
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

	await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(401)
})

it('return an error if fetch not existing order', async () => {
	await request(app).get(`/api/orders/${mongoose.Types.ObjectId()}`).set('Cookie', signup()).send().expect(404)
})
