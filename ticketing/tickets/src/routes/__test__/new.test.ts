import request from 'supertest'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Ticket } from '../../models/ticket'

jest.mock('../../nats-wrapper')

it('has a route handler listening to POST /api/tickets', async () => {
	const res = await request(app).post('/api/tickets').send({})
	expect(res.status).not.toEqual(404)
})

it('can only be access if user is signed in', async () => {
	await request(app).post('/api/tickets').send({}).expect(401)
})

it('return a staus other than 401 if user is signed in', async () => {
	const cookies = signup()
	const res = await request(app).post('/api/tickets').set('Cookie', cookies).send({})
	expect(res.status).not.toEqual(401)
})

it('return an error if invalid title is provided', async () => {
	const cookies = signup()
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookies)
		.send({
			title: '',
			price: 10,
		})
		.expect(400)
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookies)
		.send({
			price: 10,
		})
		.expect(400)
})

it('return an error if an invalid price is provided', async () => {
	const cookies = signup()
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookies)
		.send({
			title: 'ONE OK ROCK',
			price: -10,
		})
		.expect(400)
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookies)
		.send({
			title: 'ONE OK ROCK',
		})
		.expect(400)
})

it('create a ticket with valid inputs', async () => {
	let tickets = await Ticket.find()
	expect(tickets.length).toEqual(0)
	const cookies = signup()
	await request(app)
		.post('/api/tickets')
		.set('Cookie', cookies)
		.send({
			title: 'Test Title',
			price: 20.5,
		})
		.expect(201)

	tickets = await Ticket.find()
	expect(tickets.length).toEqual(1)
})
