import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

// Define the CheckoutForm functional component
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  // State to manage payment success and error messages
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if Stripe and Elements are available
    if (!stripe || !elements) {
      return;
    }

    // Get the CardElement instance
    const cardElement = elements.getElement(CardElement);

    try {
      // Create the token using the createToken method
      const { token } = await stripe.createToken(cardElement);
      await handlePayment(token.id);
    } catch (error) {
      console.error(error);
      setPaymentError(error.message || 'An error occurred during payment.');
      setPaymentSuccess(null);
    }
  };

  // Function to handle the payment and get the token.id
  const handlePayment = async (tokenId) => {
    try {
      const response = await axios.post('http://localhost:8070/api/payment', {
        token: tokenId,
      });
      if (response.data.success) {
        setPaymentSuccess('Payment successful!');
        setPaymentError(null);
      } else {
        setPaymentError('Payment failed. Please try again.');
        setPaymentSuccess(null);
      }
    } catch (error) {
      console.error(error);
      setPaymentError('An error occurred while processing your payment.');
      setPaymentSuccess(null);
    }
  };
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      },
      complete: {
        color: "#00e676"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <CardElement options={cardStyle} />
      <button 
         type="submit"
         style={stripe ? styles.submitButton : { ...styles.submitButton, ...styles.disabledButton }}
         disabled={!stripe}
      >
        Pay
      </button>
      {paymentError && <div style={styles.error}>{paymentError}</div>}
      {paymentSuccess && <div style={styles.success}>{paymentSuccess}</div>}
    </form>
  );
};

export default CheckoutForm;

const styles = {
  form: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ccc'
  },
  submitButton: {
    marginTop: '20px',
    width: '100%',
    padding: '12px',
    backgroundColor: '#5cb85c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  disabledButton: {
    backgroundColor: '#b3b3b3',
    cursor: 'not-allowed',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
};