import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Order } from '../../models/order'
import { OrderStatus } from '@sp-udemy-ticketing/common'

it('return a 404 when pay for order that does not exist', async () => {
	await request(app)
		.post('/api/payments')
		.set('Cookie', signup())
		.send({
			token: '123456',
			orderId: new mongoose.Types.ObjectId().toHexString(),
		})
		.expect(404)
})

it('return a 401 when pay for order that does not belong to the user', async () => {
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId: new mongoose.Types.ObjectId().toHexString(),
		price: 100,
		status: OrderStatus.Created,
		version: 0,
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', signup())
		.send({
			token: '123456',
			orderId: order.id,
		})
		.expect(401)
})

it('return a 400 when pay for order has been cancelled', async () => {
	const userId = new mongoose.Types.ObjectId().toHexString()
	const cookie = signup(userId)

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId,
		price: 100,
		status: OrderStatus.Cancelled,
		version: 0,
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', cookie)
		.send({
			token: '123456',
			orderId: order.id,
		})
		.expect(400)
})
