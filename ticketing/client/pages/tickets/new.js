import { useState } from 'react'
import UseRequest from '../../hooks/use-request'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = UseRequest({
    url: '/api/tickets',
    method: 'POST',
    body: {
      title,
      price,
    },
    onSuccess: ticket => console.log(ticket),
  })

  const onBlur = () => {
    const value = parseFloat(price)
    setPrice(value.toFixed(2))
  }

  const onSubmit = async event => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            onBlur={onBlur}
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
