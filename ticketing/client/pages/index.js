import axios from 'axios'

const Home = ({ currentUser }) => {
  return <h1>{currentUser.email}</h1>
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
