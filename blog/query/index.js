const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const posts = {}

app.get('/posts', (req, res) => {
	res.send(posts)
})

app.post('/events', (req, res) => {
	const { type, data } = req.body
	if (type == 'PostCreated') {
		const { id, title } = data
		posts[id] = { id, title, comments: [] }
	}
	if (type == 'CommentCreated') {
		const { id, postId, content, status } = data
		posts[postId].comments.push({ id, content, status })
	}

	if (type == 'CommentUpdated') {
		const { id, postId, content, status } = data
		const comment = posts[postId].comments.find(el => el.id == id)
		comment.status = status
		comment.context = content
	}
	res.send({})
})

app.listen(4002, () => {
	console.log('Listening on 4002')
})
