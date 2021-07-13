import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222',
})

stan.on('connect', () => {
	console.log('Listener connected NATS')

	stan.on('close', () => {
		console.log('NATS connection closed')
		process.exit()
	})

	const options = stan.subscriptionOptions().setManualAckMode(true)

	// Queue Group of each event ->Only one listener get the event (No duplicate event)
	const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options)

	subscription.on('message', (msg: Message) => {
		const data = msg.getData()
		if (typeof data == 'string') {
			console.log(`Received event #${msg.getSequence()} with data: ${data}`)
		}
		msg.ack()
	})
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())