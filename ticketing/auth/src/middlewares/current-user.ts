import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
	id: string
	email: string
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload
		}
	}
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
	if (!req.session?.jwt) {
		return next()
	}

	const jwtSecret = process.env.JWT_KEY!
	try {
		const payload = jwt.verify(req.session.jwt, jwtSecret) as UserPayload
		req.currentUser = payload
	} catch (error) {}
	next()
}
