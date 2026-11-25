const PAYMENT_API = import.meta.env.VITE_PAYMENT_API_URL

export const getDemoPayment = async (token) => {
  const response = await fetch(
    `${PAYMENT_API}/api/orders/demo-payment/${token}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch payment details')
  }

  return data
}

export const payDemoPayment = async (token) => {
  const response = await fetch(
    `${PAYMENT_API}/api/orders/demo-payment/${token}/pay`,
    {
      method: 'POST',
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Payment failed')
  }

  return data
}