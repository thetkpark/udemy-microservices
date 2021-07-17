import { ExpirationCompleteEvent, OrderStatus } from '@sp-udemy-ticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete-listener'

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client)

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'Test Title',
		price: 20,
	})
	await ticket.save()

	const order = Order.build({
		status: OrderStatus.Created,
		userId: new mongoose.Types.ObjectId().toHexString(),
		expiresAt: new Date(),
		ticket,
	})
	await order.save()

	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	}

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { msg, data, order, ticket, listener }
}

it('update the order status to cancelled', async () => {
	const { msg, data, order, ticket, listener } = await setup()
	await listener.onMessage(data, msg)

	const updatedOrder = await Order.findById(order.id).lean()
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an order:cancelled event', async () => {
	const { msg, data, order, ticket, listener } = await setup()
	await listener.onMessage(data, msg)

	expect(natsWrapper.client.publish).toHaveBeenCalled()
	const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
	expect(eventData.id).toEqual(order.id)
})

it('ack the message', async () => {
	const { msg, data, order, ticket, listener } = await setup()
	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})
