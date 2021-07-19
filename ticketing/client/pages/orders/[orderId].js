import router from 'next/router'
import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import axiosBuilder from '../../api/build-client'
import UseRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = UseRequest({
    url: '/api/payments',
    method: 'POST',
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.floor(msLeft / 1000))
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    // Invoke when use nagivate to other page
    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        amount={order.price * 100}
        stripeKey="pk_test_51JESzqJngG3i79Y0EKJRdESEMcbgmbgVJONYnvEwXxL3cyikZ5CZq68NdDrDlRcCmblAzdRfGYAn5927XBwlRvZb00Xpjanqf3"
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

export async function getServerSideProps({ req, params }) {
  const { orderId } = params
  try {
    const { data } = await axiosBuilder(req).get(`/api/orders/${orderId}`)
    return {
      props: {
        order: data,
      },
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: {
      order: null,
    },
  }
}

export default OrderShow
