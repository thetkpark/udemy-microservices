import { OrderCancelledEvent, Publisher, Subjects } from '@sp-udemy-ticketing/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled
}
