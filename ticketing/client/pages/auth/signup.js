import { useState } from 'react'
import axios from 'axios'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])

  const onSubmit = async event => {
    event.preventDefault()
    try {
      const res = await axios.post('/api/users/signup', { email, password })
      console.log(res.data)
    } catch (err) {
      setErrors(err.response.data.errors)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} className="form-control" type="password" />
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default Signup
