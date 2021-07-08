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
	comments.push({ id: commentId, content })
	commentsByPostId[postId] = comments

	await axios.post('http://localhost:4005/event', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			postId: postId,
			content,
		},
	})

	res.status(201).send(comments)
})

app.listen(4001, () => {
	console.log(`Running on 4001`)
})
