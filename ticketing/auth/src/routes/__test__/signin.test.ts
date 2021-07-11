import request from 'supertest'
import { app } from '../../app'

it('fails when a email does not exist is supplied', async () => {
	return request(app)
		.post('/api/users/signin')
		.send({
			email: 'notExisting@email.com',
			password: 'testPassword',
		})
		.expect(400)
})

it('fails when an incorrect password is suppiled', async () => {
	const reqBody = {
		email: 'valid@email.com',
		password: 'testPassword',
	}
	await request(app).post('/api/users/signup').send(reqBody).expect(201)

	await request(app)
		.post('/api/users/signin')
		.send({
			...reqBody,
			password: 'incorrectPassword',
		})
		.expect(400)
})

it('response with cookie when given valid credential', async () => {
	const reqBody = {
		email: 'valid@email.com',
		password: 'testPassword',
	}
	await request(app).post('/api/users/signup').send(reqBody).expect(201)

	const res = await request(app).post('/api/users/signin').send(reqBody).expect(200)
	expect(res.get('Set-Cookie')).toBeDefined()
})
