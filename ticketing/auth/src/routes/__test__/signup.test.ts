import request from 'supertest'
import { app } from '../../app'

it('return a 201 on successful signup', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'valid@email.com',
			password: 'testPassword',
		})
		.expect(201)
})

it('return 400 with an invalid email', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'invalideAtmaildotcom',
			password: 'testPassword',
		})
		.expect(400)
})

it('return 400 with an invalid password', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'valid@email.com',
			password: '123',
		})
		.expect(400)
})

it('return 400 with missing email and password', async () => {
	await request(app).post('/api/users/signup').send({ email: 'valid@email.com' }).expect(400)
	await request(app).post('/api/users/signup').send({ password: 'testPassword' }).expect(400)
})

it('disallow duplicate emails', async () => {
	const reqBody = {
		email: 'valid@email.com',
		password: 'testPassword',
	}
	await request(app).post('/api/users/signup').send(reqBody).expect(201)
	await request(app).post('/api/users/signup').send(reqBody).expect(400)
})

it('sets a cookie after successful signup', async () => {
	const res = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'valid@email.com',
			password: 'testPassword',
		})
		.expect(201)
	expect(res.get('Set-Cookie')).toBeDefined()
})
