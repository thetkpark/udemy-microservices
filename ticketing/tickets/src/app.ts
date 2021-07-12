import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@sp-udemy-ticketing/common'

const app = express()

app.set('trust proxy', true)
app.use(json())
app.use(
	cookieSession({
		signed: false,
		httpOnly: true,
	})
)

app.all('*', async () => {
	throw new NotFoundError()
})

app.use(errorHandler)

export { app }