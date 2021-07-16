import mongoose from 'mongoose'
import { TicketCreatedEvent } from '@sp-udemy-ticketing/common'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedListener } from '../ticket-created-listener'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
	// Create an instance of the listener
	const listener = new TicketCreatedListener(natsWrapper.client)

	// Create mock data of the event
	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: new mongoose.Types.ObjectId().toHexString(),
		price: 10,
		userId: new mongoose.Types.ObjectId().toHexString(),
		title: 'Test Title',
	}

	// Create a mock message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	}

	return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
	const { data, listener, msg } = await setup()

	// Call onMessage function with data and message object
	await listener.onMessage(data, msg)

	// Write assertion
	const ticket = await Ticket.findById(data.id).lean()
	expect(ticket).toBeDefined()
	expect(ticket!.title).toEqual(data.title)
})

it('acks the message', async () => {
	const { data, listener, msg } = await setup()

	// Call onMessage function with data and message object
	await listener.onMessage(data, msg)

	// Write assertion to make sure ack function is called
	expect(msg.ack).toHaveBeenCalled()
})
