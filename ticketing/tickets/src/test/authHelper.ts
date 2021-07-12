import jwt from 'jsonwebtoken'

export const signup = () => {
	const payload = {
		id: '6e7efac9-3a5d-4339-ab17-db21e85cbd92',
		email: 'test@test.com',
	}
	const token = jwt.sign(payload, process.env.JWT_KEY!)
	const sessionString = JSON.stringify({ jwt: token })
	const sessionBase64 = Buffer.from(sessionString).toString('base64')
	return [`express:sess=${sessionBase64}`]
}
