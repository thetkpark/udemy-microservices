import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('can fetch a list of tickets', async () => {
	const tickets = [
		Ticket.build({
			title: 'Queen',
			price: 100,
			usedId: 'someid',
		}),
		Ticket.build({
			title: 'Elvis',
			price: 200,
			usedId: 'someanotherAnotherid',
		}),
		Ticket.build({
			title: 'ONE OK ROCK',
			price: 29.5,
			usedId: 'someAnotherid',
		}),
	]
	await Promise.all(tickets.map(ticket => ticket.save()))

	const res = await request(app).get('/api/tickets').send().expect(200)
	expect(res.body.length).toEqual(3)
})
