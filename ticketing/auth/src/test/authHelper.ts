import request from 'supertest'
import { app } from '../app'

export const signup = async () => {
	const email = 'valid@email.com'
	const password = 'validPassword'

	const res = await request(app).post('/api/users/signup').send({ email, password }).expect(201)
	const cookie = res.get('Set-Cookie')
	return cookie
}
