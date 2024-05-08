import React,{ useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PaymentComponent from './components/payment/payment';
import SubmitTicketForm from './components/support/submitTicket/submitTicketForm.js';
import { MyTickets } from './components/support/myTicket/myTicket.js';
import EmojiFeedback from './components/feedback/emojiFeedback.js';
import HoverRating from './components/feedback/muiFeedback.js'
import styled from "styled-components";
import CheckoutForm from './components/payment/checkoutForm.js';

const AppStyles = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 height: 100vh;
 background-color: #f8ebe2;
`;
function App() {
  const [activeReaction, setActiveReaction] = useState("");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/ticket/submit" element={<SubmitTicketForm />} />
          <Route path="/ticket/mytickets" element={<MyTickets />} />
          <Route path="/payment" element={<PaymentComponent />} />
          <Route path="/emoji" element={<HoverRating/>} />  
          <Route path="/checkout" element={<CheckoutForm/>} />
         
        </Routes>
      </Router>
    </div>
  );
}

export default App;