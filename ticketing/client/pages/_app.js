import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import { Fragment } from 'react'
import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Fragment>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </Fragment>
  )
}

AppComponent.getInitialProps = async ({ ctx }) => {
  try {
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      { headers: ctx.req.headers }
    )
    return data
  } catch (error) {
    console.error(error)
    return {}
  }
}

export default AppComponent
