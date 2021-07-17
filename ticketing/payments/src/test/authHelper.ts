import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const signup = () => {
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	}
	const token = jwt.sign(payload, process.env.JWT_KEY!)
	const sessionString = JSON.stringify({ jwt: token })
	const sessionBase64 = Buffer.from(sessionString).toString('base64')
	return [`express:sess=${sessionBase64}`]
}
