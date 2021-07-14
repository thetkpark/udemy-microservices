import { Publisher, Subjects, TicketCreatedEvent } from '@sp-udemy-ticketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated
}
