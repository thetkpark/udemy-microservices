const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
	const postId = req.params.id
	res.send(commentsByPostId[postId] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex')
	const { content } = req.body
	const postId = req.params.id
	const comments = commentsByPostId[postId] || []
	comments.push({ id: commentId, content, status: 'pending' })
	commentsByPostId[postId] = comments

	await axios.post('http://event-bus-srv:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			postId: postId,
			content,
			status: 'pending',
		},
	})

	res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
	const { type, data } = req.body
	if (type == 'CommentModerated') {
		const { postId, id, status } = data
		const comments = commentsByPostId[postId]
		const comment = comments.find(el => el.id == id)
		comment.status = status

		await axios.post('http://event-bus-srv:4005/events', {
			type: 'CommentUpdated',
			data: {
				...data,
				status,
			},
		})
	}
	res.send({})
})

app.listen(4001, () => {
	console.log(`Running on 4001`)
})
