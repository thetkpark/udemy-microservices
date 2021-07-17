import { Listener, OrderCreatedEvent, Subjects } from '@sp-udemy-ticketing/common'
import { Message } from 'node-nats-streaming'
import dayjs from 'dayjs'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated
	readonly queueGroupName = queueGroupName

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		await expirationQueue.add(
			{ orderId: data.id },
			{
				delay: dayjs(data.expiresAt).diff(dayjs(), 'millisecond'),
			}
		)
		msg.ack()
	}
}
