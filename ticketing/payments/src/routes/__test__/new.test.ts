import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { signup } from '../../test/authHelper'
import { Order } from '../../models/order'
import { OrderStatus } from '@sp-udemy-ticketing/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

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

// it.skip('returns a 201 with valid input', async () => {
// 	const userId = new mongoose.Types.ObjectId().toHexString()
// 	const cookie = signup(userId)

// 	const order = Order.build({
// 		id: new mongoose.Types.ObjectId().toHexString(),
// 		userId,
// 		price: 100,
// 		status: OrderStatus.Created,
// 		version: 0,
// 	})
// 	await order.save()

// 	await request(app)
// 		.post('/api/payments')
// 		.set('Cookie', cookie)
// 		.send({
// 			token: 'tok_visa',
// 			orderId: order.id,
// 		})
// 		.expect(201)

// 	const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
// 	expect(chargeOptions.source).toEqual('tok_visa')
// 	expect(chargeOptions.amount).toEqual(order.price * 100)
// 	expect(chargeOptions.currency).toEqual('usd')
// })

it('returns a 201 with valid input', async () => {
	const userId = new mongoose.Types.ObjectId().toHexString()
	const cookie = signup(userId)
	const price = Math.floor(Math.random() * 10000)

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		userId,
		price,
		status: OrderStatus.Created,
		version: 0,
	})
	await order.save()

	await request(app)
		.post('/api/payments')
		.set('Cookie', cookie)
		.send({
			token: 'tok_visa',
			orderId: order.id,
		})
		.expect(201)

	const { data: stripeCharges } = await stripe.charges.list({ limit: 50 })
	const stripeCharge = stripeCharges.find(charge => charge.amount === price * 100)
	expect(stripeCharge).toBeDefined()
	expect(stripeCharge!.currency).toEqual('usd')

	const payment = await Payment.findOne({
		orderId: order.id,
		stripeId: stripeCharge!.id,
	}).lean()
	expect(payment).not.toBeNull()
})
