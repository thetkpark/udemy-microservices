import axios from 'axios'

const Home = ({ currentUser }) => {
  return currentUser ? <h1>You are sign in</h1> : <h1>You are not sign in</h1>
}

export async function getServerSideProps({ req }) {
  try {
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      { headers: req.headers }
    )
    return {
      props: data,
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: {},
  }
}

export default Home
