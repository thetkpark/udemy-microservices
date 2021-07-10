import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/bad-request-error'
import { RequestValidationError } from '../errors/request-validation-error'
import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'
import { Password } from '../services/password'

const router = express.Router()

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		const existingUser = await User.findOne({ email })
		if (existingUser) {
			throw new BadRequestError('Email in use')
		}

		const hashedPassword = await Password.toHash(password)
		const user = User.build({ email, password: hashedPassword })
		await user.save()

		const jwtSecret = process.env.JWT_KEY!
		const token = await jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
			algorithm: 'HS256',
		})

		req.session = {
			jwt: token,
		}

		res.status(201).send(user)
	}
)

export { router as signupRouter }
