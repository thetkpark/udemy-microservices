import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('can fetch a list of tickets', async () => {
	const tickets = [
		Ticket.build({
			title: 'Queen',
			price: 100,
			userId: 'someid',
		}),
		Ticket.build({
			title: 'Elvis',
			price: 200,
			userId: 'someanotherAnotherid',
		}),
		Ticket.build({
			title: 'ONE OK ROCK',
			price: 29.5,
			userId: 'someAnotherid',
		}),
	]
	await Promise.all(tickets.map(ticket => ticket.save()))

	const res = await request(app).get('/api/tickets').send().expect(200)
	expect(res.body.length).toEqual(3)
})
