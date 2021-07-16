import { TicketUpdatedEvent } from '@sp-udemy-ticketing/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {
	// Create an instance of the listener
	const listener = new TicketUpdatedListener(natsWrapper.client)

	// Create and save a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		title: 'Test Title',
	})
	await ticket.save()

	// Create mock data of the event
	const data: TicketUpdatedEvent['data'] = {
		version: ticket.version + 1,
		id: ticket.id,
		price: 999,
		userId: new mongoose.Types.ObjectId().toHexString(),
		title: 'New Title',
	}

	// Create a mock message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
	const { data, listener, msg, ticket } = await setup()

	await listener.onMessage(data, msg)

	const updatedTicket = await Ticket.findById(ticket.id).lean()
	expect(updatedTicket!.title).toEqual(data.title)
	expect(updatedTicket!.price).toEqual(data.price)
	expect(updatedTicket!.version).toEqual(data.version)
})

it('ack the message', async () => {
	const { data, listener, msg } = await setup()

	// Call onMessage function with data and message object
	await listener.onMessage(data, msg)

	// Write assertion to make sure ack function is called
	expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has future version number', async () => {
	const { data, listener, msg, ticket } = await setup()

	data.version = 10

	try {
		await listener.onMessage(data, msg)
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled()
})
