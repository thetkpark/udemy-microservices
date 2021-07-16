import { OrderCancelledEvent, OrderStatus } from '@sp-udemy-ticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
	// Create an instance of the listener
	const listener = new OrderCancelledListener(natsWrapper.client)

	// Create and save ticket
	const orderId = new mongoose.Types.ObjectId().toHexString()
	const ticket = Ticket.build({
		title: 'Test Title',
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
	})
	ticket.set({ orderId: orderId })
	await ticket.save()

	// Create mock data
	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	}

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { msg, data, ticket, listener }
}

it('update orderId of the ticket to undefined', async () => {
	const { msg, data, ticket, listener } = await setup()
	await listener.onMessage(data, msg)

	const updatedTicket = await Ticket.findById(ticket.id)
	expect(updatedTicket!.orderId).toBeUndefined()
})

it('acks the message', async () => {
	const { msg, data, ticket, listener } = await setup()
	await listener.onMessage(data, msg)
	expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
	const { msg, data, ticket, listener } = await setup()
	await listener.onMessage(data, msg)
	expect(natsWrapper.client.publish).toHaveBeenCalled()
})
