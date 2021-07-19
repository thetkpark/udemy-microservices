import router from 'next/router'
import axiosBuilder from '../../api/build-client'
import UseRequest from '../../hooks/use-request'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = UseRequest({
    url: '/api/orders',
    method: 'POST',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: order => router.push(`/orders/${order.id}`),
  })

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  )
}

export async function getServerSideProps({ req, params }) {
  const { ticketId } = params
  try {
    const { data } = await axiosBuilder(req).get(`/api/tickets/${ticketId}`)
    return {
      props: {
        ticket: data,
      },
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: {
      ticket: null,
    },
  }
}

export default TicketShow
