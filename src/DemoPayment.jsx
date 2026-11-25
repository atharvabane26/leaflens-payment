import { useEffect, useState } from 'react'
import './DemoPayment.css'
import {
  getDemoPayment,
  payDemoPayment,
} from './paymentApi'

function DemoPayment() {
  const token = new URLSearchParams(window.location.search).get('token')

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)

  // Fetch order details using payment token
  useEffect(() => {
    let active = true

    async function fetchPaymentDetails() {
      try {
        const data = await getDemoPayment(token)

        if (active) {
          setOrder(data)

          if (data.paymentStatus === 'paid') {
            setPaymentResult({
              paymentReference: data.paymentReference,
              totalAmount: data.totalAmount,
              orderId: data.orderId,
            })
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchPaymentDetails()

    return () => {
      active = false
    }
  }, [token])

  // Complete simulated payment
  async function handlePayment() {
    setPaying(true)
    setError('')

    try {
      const result = await payDemoPayment(token)

      setPaymentResult({
        paymentReference: result.paymentReference,
        totalAmount: result.totalAmount,
        orderId: result.orderId,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <main className="demo-payment-page">
        <p>Loading payment details...</p>
      </main>
    )
  }

  if (error && !order) {
    return (
      <main className="demo-payment-page">
        <div className="demo-payment-card">
          <h2>Unable to open payment page</h2>
          <p>{error}</p>
          <p>Please check your payment link.</p>
        </div>
      </main>
    )
  }

  if (paymentResult) {
    return (
      <main className="demo-payment-page">
        <div className="demo-payment-card success-card">
          <div className="success-icon">✓</div>

          <h1>Payment Successful!</h1>

          <p>Your demo payment has been completed.</p>

          <div className="payment-info">
            <p>Amount paid</p>
            <h1>
              ₹{paymentResult.totalAmount}
            </h1>

            <p>Order ID</p>
            <strong>{paymentResult.orderId}</strong>

            <p>Transaction reference</p>
            <strong>{paymentResult.paymentReference}</strong>
          </div>

          <p className="demo-note">
            This is a simulated payment. No actual money was transferred.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="demo-payment-page">
      <div className="demo-payment-card">

        <div className="payment-brand">
          <h1>LeafLens</h1>
          <p>Secure Demo Payment</p>
        </div>

        <div className="payment-section">
          <h3>Delivery Details</h3>

          <div className="detail-row">
            <span>Customer name</span>
            <strong>{order.delivery.name}</strong>
          </div>

          <div className="detail-row">
            <span>Mobile number</span>
            <strong>{order.delivery.phone}</strong>
          </div>

          <div className="detail-row">
            <span>Delivery address</span>
            <strong>{order.delivery.address}</strong>
          </div>
        </div>

        <div className="payment-section">
          <h3>Order Summary</h3>

          {order.items.map((item, index) => (
            <div className="detail-row" key={index}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}
        </div>

        <div className="amount-section">
          <p>Total Amount Payable</p>
          <h1>₹{order.totalAmount}</h1>
          <span>DEMO UPI PAYMENT</span>
        </div>

        {error && (
          <p className="payment-error">{error}</p>
        )}

        <button
          className="demo-pay-button"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying
            ? 'Processing payment...'
            : `Pay ₹${order.totalAmount}`}
        </button>

        <p className="demo-note">
          Demo payment only. No real money will be transferred.
        </p>

      </div>
    </main>
  )
}

export default DemoPayment
