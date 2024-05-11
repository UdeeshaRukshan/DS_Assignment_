import React, { useState,useEffect } from 'react';
import CourseDetails from '../courseDetails/courseDetails';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import { message} from "antd";
import 'react-toastify/dist/ReactToastify.css';
function CheckoutForm() {

  const [formData, setFormData] = useState({
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const learnerId = localStorage.getItem("learnerId");
  const [cartContents, setCartContents] = useState([]);
  
  const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility

  const [selectedItem, setSelectedItem] = useState({
    name: 'Learn Python: The Complete Python Programming Course',
    price: 99.99, // Example price
  });
  const submitPayment = () => {
    console.log("Processing payment", formData);
    setShowNotification(true); // Show notification when payment is processed
    setTimeout(() => setShowNotification(false), 3000); // Optionally hide after few seconds
  };
  useEffect(() => {
    fetchCartContents();
  },[])

  useEffect(() => {
    const total = cartContents.reduce((acc, cartItem) => acc + cartItem.price, 0);
    setTotalPrice(total);
}, [cartContents]);
  const fetchCartContents = async () => {
    setLoading(true);  // Start loading state
    try {
        const response = await fetch(
            `http://localhost:8073/api/learner/cart/${learnerId}`,
            {
                method: "GET"
            }
        );

        if (response.ok) {
            const data = await response.json(); // Extract JSON from the response
            // Useful place for a console log to debug or check data structure
            console.log("Fetched cart contents:", data);

            // Assuming data is an array of items where each item has a 'courses' array
            const flattenedCourses = data.reduce((acc, cartItem) => {
                return acc.concat(cartItem.courses); // Flatten all courses into a single array
            }, []);
            setCartContents(flattenedCourses); // Update state with the new cart contents
        } else {
            throw new Error('Failed to load the cart contents'); // Throw an error if response is not ok
        }
    } catch (error) {
        console.error("Error fetching cart contents:", error);
        message.error("An error occurred while fetching cart contents."); // Display error message to user
    }
    setLoading(false); // End loading state
    
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card Number is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry Date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePayment = () => {
    console.log("Processing payment", formData);
    toast.success("Payment is successful!", {
      theme: 'dark',
      position: "bottom-right",
    });
    setTimeout(() => {
      navigate('/learner/home'); // Change '/home' to your desired route
    }, 2000);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you could add an API call to process payment
    console.log("Form Submitted", formData);
    // alert('Payment processed for ' + selectedItem.name);
    submitPayment();
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6 text-blue-800">Checkout</h2>
      <CourseDetails />
      <form onSubmit={handleSubmit} className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/2 px-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Details</h3>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={`border p-2 mb-4 w-full rounded shadow-sm ${errors.fullName ? 'border-red-500' : ''}`} />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card Number" className={`border p-2 mb-4 w-full rounded shadow-sm ${errors.cardNumber ? 'border-red-500' : ''}`} />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
          <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry Date (MM/YY)" className={`border p-2 mb-4 w-full rounded shadow-sm ${errors.expiryDate ? 'border-red-500' : ''}`} />
          {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
          <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="CVV" className={`border p-2 mb-4 w-full rounded shadow-sm ${errors.cvv ? 'border-red-500' : ''}`} />
          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}<div className="mt-4 p-4 bg-blue-50 shadow-md rounded text-sm border border-blue-200">
  
  <p className="font-semibold">30-Day Money-Back Guarantee</p>
  <p>Full Lifetime Access</p>

  {/* Action Buttons */}
  <button  className=" mr-2 mt-2 bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
    Share
  </button>
  <button className="mt-2 mr-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
    Gift this course
  </button>
  <button className="mt-2 bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
    Apply the Coupon
  </button>

  <p className="mt-2">Training 5 or more people?</p>
  <p>Get your team access to 17,000+ top Udemy courses anytime, anywhere.</p>
  <button className="text-blue-600 cursor-pointer hover:underline font-semibold py-2 px-4 focus:outline-none focus:shadow-outline">
    Try Udemy Business
  </button>
</div>
        </div>
        
        <div className="w-full lg:w-1/2 px-4">
        {
        cartContents.map((course, index) => (
          <div key={index} className="border p-4 rounded shadow mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
            <p>Description: {course.description}</p>
            <p className="text-xl font-bold">${course.price.toFixed(2)}</p>
          </div>))
       }
          
          
          <div className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Price</h3>
            <p className="text-xl font-bold">${totalPrice}</p>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline block w-full" type="submit" onClick={handlePayment}>Complete Purchase</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CheckoutForm;
