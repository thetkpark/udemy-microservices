import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
	statusCode = 400
	constructor(private error: ValidationError[]) {
		super('Invalid request params')
		Object.setPrototypeOf(this, RequestValidationError.prototype)
	}

	serializeErrors() {
		return this.error.map(err => ({ message: err.msg, field: err.param }))
	}
}
