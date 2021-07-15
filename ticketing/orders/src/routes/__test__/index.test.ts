import request from 'supertest'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@sp-udemy-ticketing/common'

const buildTicket = async () => {
	const ticket = Ticket.build({
		title: 'Concert',
		price: Math.ceil(Math.random() * 100),
	})
	await ticket.save()
	return ticket
}

it('fetch orders for an particular user', async () => {
	const user1 = signup()
	const user2 = signup()

	// Create three tickets
	const ticketOne = await buildTicket()
	const ticketTwo = await buildTicket()
	const ticketThree = await buildTicket()

	// Create one order as User #1
	await request(app)
		.post('/api/orders')
		.set('Cookie', user1)
		.send({
			ticketId: ticketOne.id,
		})
		.expect(201)

	// Create two order as User #2
	const { body: orderOne } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({
			ticketId: ticketTwo.id,
		})
		.expect(201)
	const { body: orderTwo } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({
			ticketId: ticketThree.id,
		})
		.expect(201)

	// Make request to get order for User #2
	const res = await request(app).get('/api/orders').set('Cookie', user2).send().expect(200)

	// Make sure only got order of User #2
	expect(res.body.length).toEqual(2)
	expect(res.body[0].id).toEqual(orderOne.id)
	expect(res.body[1].id).toEqual(orderTwo.id)
	expect(res.body[0].ticket.id).toEqual(ticketTwo.id)
	expect(res.body[1].ticket.id).toEqual(ticketThree.id)
})
