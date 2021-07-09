import React from 'react'

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(comment => {
    let content

    switch (comment.status) {
      case 'approved':
        content = comment.context
        break;
      case 'pending':
        content = 'This comment is awaitng moderaion'
        break;
      case 'rejected':
        content = 'This comment has been rejected'
        break;
      default:
        content = ''
        break;
    }

    return <li key={comment.id}>{content}</li>
  })

  return <ul>{renderedComments}</ul>
}

export default CommentList
