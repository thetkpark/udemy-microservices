import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {
	if (!req.session?.jwt) {
		return res.send({ currentUser: null })
	}

	const jwtSecret = process.env.JWT_KEY!
	try {
		const payload = jwt.verify(req.session.jwt, jwtSecret)
		res.send({ currentUser: payload })
	} catch (error) {
		res.send({ currentUser: null })
	}
})

export { router as currentUserRouter }
