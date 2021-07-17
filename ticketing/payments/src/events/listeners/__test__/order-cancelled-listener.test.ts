import { OrderCancelledEvent, OrderStatus } from '@sp-udemy-ticketing/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client)

	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		price: 100,
		userId: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
	})
	await order.save()

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: new mongoose.Types.ObjectId().toHexString(),
		},
	}

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { listener, msg, data, order }
}

it('updates the status of the order', async () => {
	const { listener, msg, data, order } = await setup()
	await listener.onMessage(data, msg)

	const updatedOrder = await Order.findById(order.id).lean()
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('ack the message', async () => {
	const { listener, msg, data, order } = await setup()
	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
