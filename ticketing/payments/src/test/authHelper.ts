import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const signup = (id?: string) => {
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	}
	const token = jwt.sign(payload, process.env.JWT_KEY!)
	const sessionString = JSON.stringify({ jwt: token })
	const sessionBase64 = Buffer.from(sessionString).toString('base64')
	return [`express:sess=${sessionBase64}`]
}
