import mongoose from 'mongoose'
import { OrderCreatedEvent, OrderStatus } from '@sp-udemy-ticketing/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import { Order } from '../../../models/order'

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client)

	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		expiresAt: new Date().toISOString(),
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
			price: 100,
		},
	}

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { listener, msg, data }
}

it('replicates the order info', async () => {
	const { listener, msg, data } = await setup()
	await listener.onMessage(data, msg)

	const order = await Order.findById(data.id).lean()
	expect(order!.price).toEqual(data.ticket.price)
})

it('ack the message', async () => {
	const { listener, msg, data } = await setup()
	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
