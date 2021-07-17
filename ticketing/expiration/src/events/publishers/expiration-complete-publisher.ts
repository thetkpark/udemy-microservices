import { ExpirationCompleteEvent, Publisher, Subjects } from '@sp-udemy-ticketing/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete
}
