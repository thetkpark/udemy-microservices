const Home = ({ currentUser }) => {
  return <div>{currentUser ? <h1>You are sign in</h1> : <h1>You are not sign in!!</h1>}</div>
}
export async function getServerSideProps({ req }) {
  // try {
  //   const { data } = axios.get('/api/users/currentuser', { headers: req.headers })
  //   return {
  //     props: data,
  //   }
  // } catch (error) {
  //   console.error(error)
  // }
  return {
    props: {},
  }
}

export default Home
