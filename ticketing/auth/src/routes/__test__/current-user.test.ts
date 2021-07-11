import request from 'supertest'
import { app } from '../../app'
import { signup } from '../../test/authHelper'

it('response with detail of current user', async () => {
	const cookie = await signup()

	const res = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200)
	expect(res.body.currentUser).not.toBeNull()
})
