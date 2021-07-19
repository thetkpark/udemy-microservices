import Link from 'next/link'
import axiosBuilder from '../api/build-client'

const Home = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}
export async function getServerSideProps({ req }) {
  try {
    const { data } = await axiosBuilder(req).get('/api/tickets')
    return {
      props: {
        tickets: data,
      },
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: {
      tickets: [],
    },
  }
}

export default Home
