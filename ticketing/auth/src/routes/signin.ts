import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError, validateRequest } from '@sp-udemy-ticketing/common'
import { User } from '../models/user'
import { Password } from '../services/password'

const router = express.Router()

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').trim().notEmpty().withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) throw new BadRequestError('Invalid credentials')

		const passwordMatch = await Password.compare(user.password, password)
		if (!passwordMatch) throw new BadRequestError('Invalid credential')

		const jwtSecret = process.env.JWT_KEY!
		const token = await jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
			algorithm: 'HS256',
		})

		req.session = {
			jwt: token,
		}

		res.status(200).send(user)
	}
)

export { router as signinRouter }
