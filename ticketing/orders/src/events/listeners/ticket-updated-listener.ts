import { Listener, Subjects, TicketUpdatedEvent } from '@sp-udemy-ticketing/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated
	readonly queueGroupName = queueGroupName

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { id, title, price } = data
		const ticket = await Ticket.findById(id)
		if (!ticket) throw new Error('Ticket not found')

		ticket.title = title
		ticket.price = price
		await ticket.save()

		msg.ack()
	}
}
