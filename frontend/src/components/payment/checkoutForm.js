import React, { useState } from 'react';
import PaymentComponent from './payment';

function CheckoutForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [selectedItem, setSelectedItem] = useState({
    name: 'Course Name',
    price: 99.99, // Example price
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your form submission logic here
    console.log(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <div className="flex">
        {/* Left Column: User Details */}
        <div className="w-1/2 pr-4">
          <PaymentComponent/>
        </div>

        {/* Right Column: Selected Item and Total Price */}
        <div className="w-1/2 pl-4">
          <div className="border p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Item</h3>
            <p className="mb-2">{selectedItem.name}</p>
            <p>${selectedItem.price}</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Total Price</h3>
            <p>${selectedItem.price}</p>
          </div>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" type="submit">Complete Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;
