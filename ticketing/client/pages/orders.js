import axiosBuilder from '../api/build-client'

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        )
      })}
    </ul>
  )
}

export async function getServerSideProps({ req }) {
  try {
    const { data } = await axiosBuilder(req).get('/api/orders')
    return {
      props: {
        orders: data,
      },
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: {
      orders: [],
    },
  }
}

export default OrderIndex
