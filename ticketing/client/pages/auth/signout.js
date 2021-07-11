import { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import router from 'next/router'

const Signout = () => {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => {
      router.push('/')
    },
  })

  useEffect(() => {
    doRequest()
  }, [])

  return <div>Signing you out...</div>
}

export default Signout
