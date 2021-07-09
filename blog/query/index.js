const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const posts = {}

const handleEvent = (type, data) => {
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
}

app.get('/posts', (req, res) => {
	res.send(posts)
})

app.post('/events', (req, res) => {
	const { type, data } = req.body
	handleEvent(type, data)
	res.send({})
})

app.listen(4002, async () => {
	console.log('Listening on 4002')

	const res = await axios.get('http://event-bus-srv:4005/events')
	for (let event of res.data) {
		console.log(`Processing event: ${event.type}`)
		handleEvent(event.type, event.data)
	}
})
