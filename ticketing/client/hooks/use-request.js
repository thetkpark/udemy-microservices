import axios from 'axios'
import { useState } from 'react'

const UseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const res = await axios.request({
        method,
        url,
        data: { ...body, ...props },
      })
      if (onSuccess) {
        onSuccess(res.data)
      }
      return res.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}

export default UseRequest
