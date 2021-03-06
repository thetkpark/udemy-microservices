import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('return 404 if the ticket is not found', async () => {
	await request(app).get('/api/tickets/fakeTicketId').send().expect(404)
})
it('return a ticket if the ticket is found', async () => {
	const title = 'Queen'
	const price = 299
	const ticket = Ticket.build({
		price,
		title,
		userId: 'someid',
	})
	await ticket.save()

	const res = await request(app).get(`/api/tickets/${ticket.id}`).send().expect(200)
	expect(res.body.title).toEqual(title)
	expect(res.body.price).toEqual(price)
})
