import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'
import { signup } from '../../test/authHelper'
import { natsWrapper } from '../../nats-wrapper'

it('return a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', signup())
		.send({
			title: 'Changed Title',
			price: 250,
		})
		.expect(404)
})

it('return a 401 if the user in not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString()
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'Changed Title',
			price: 250,
		})
		.expect(401)
})

it('return a 401 if the user does not own the ticket', async () => {
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', signup())
		.send({
			title: 'Some Title',
			price: 50,
		})
		.expect(201)

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', signup())
		.send({
			title: 'Change Title',
			price: 500,
		})
		.expect(401)
})

it('return a 400 if the user provide invalid price or title', async () => {
	const cookie = signup()
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'Some Title',
			price: 50,
		})
		.expect(201)

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20,
		})
		.expect(400)

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'New Title',
			price: -20,
		})
		.expect(400)
})

it('update the ticket provided valid input', async () => {
	const cookie = signup()
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'Some Title',
			price: 50,
		})
		.expect(201)

	const updatedTitle = 'Updated Title'
	const updatedPrice = 200
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: updatedTitle,
			price: updatedPrice,
		})
		.expect(200)

	const ticket = await Ticket.findById(res.body.id).lean()
	expect(ticket?.price).toEqual(updatedPrice)
	expect(ticket?.title).toEqual(updatedTitle)
})

it('publish an update event', async () => {
	const cookie = signup()
	const res = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: 'Some Title',
			price: 50,
		})
		.expect(201)

	const updatedTitle = 'Updated Title'
	const updatedPrice = 200
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: updatedTitle,
			price: updatedPrice,
		})
		.expect(200)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
