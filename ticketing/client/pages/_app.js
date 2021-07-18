import 'bootstrap/dist/css/bootstrap.css'
import axiosBuilder from '../api/build-client'
import { Fragment } from 'react'
import Header from '../components/Header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Fragment>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </Fragment>
  )
}

AppComponent.getInitialProps = async ({ ctx }) => {
  try {
    const { data } = await axiosBuilder(ctx.req).get('/api/users/currentuser')
    return data
  } catch (error) {
    console.error(error)
  }
  return {}
}

export default AppComponent
