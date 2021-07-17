import Queue from 'bull'

interface Payload {
	orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
	redis: {
		host: process.env.REDIS_HOST!,
	},
})

// Process a job after return from redis
expirationQueue.process(async job => {
	console.log('Publish an expiration:complete event for orderId', job.data.orderId)
})

export { expirationQueue }
