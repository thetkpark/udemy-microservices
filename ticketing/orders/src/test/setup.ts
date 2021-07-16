import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

jest.mock('../nats-wrapper')
process.env.EXPIRATION_WINDOW_SECONDS = '900'

let mongo: any
beforeAll(async () => {
	process.env.JWT_KEY = 'testJWTSecret'
	mongo = await MongoMemoryServer.create()
	const mongoUri = mongo.getUri()

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}, 10000)

beforeEach(async () => {
	jest.clearAllMocks()
	const collections = await mongoose.connection.db.collections()
	for (let collection of collections) {
		await collection.deleteMany({})
	}
}, 10000)

afterAll(async () => {
	await mongo.stop()
	await mongoose.connection.close()
}, 10000)
