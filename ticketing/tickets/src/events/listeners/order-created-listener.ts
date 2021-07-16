import { Listener, OrderCreatedEvent, Subjects } from '@sp-udemy-ticketing/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	readonly queueGroupName = queueGroupName

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		// Find the ticket that order is reserving
		const ticket = await Ticket.findById(data.ticket.id)
		if (!ticket) throw new Error('Ticket not found')

		// Mark ticket as reserved by setting orderId prop
		ticket.set({ orderId: data.id })

		// Save the ticket
		await ticket.save()

		// ack the message
		msg.ack()
	}
}
