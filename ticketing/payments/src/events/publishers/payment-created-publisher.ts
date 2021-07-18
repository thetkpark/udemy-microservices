import { PaymentCreatedEvent, Publisher, Subjects } from '@sp-udemy-ticketing/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated
}
