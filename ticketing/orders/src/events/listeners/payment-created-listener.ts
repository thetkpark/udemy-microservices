import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@sp-udemy-ticketing/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated
	readonly queueGroupName = queueGroupName

	async onMessage({ orderId }: PaymentCreatedEvent['data'], msg: Message) {
		const order = await Order.findById(orderId)
		if (!order) throw new Error('Order not found')

		order.set({ status: OrderStatus.Complete })
		await order.save()

		msg.ack()
	}
}
