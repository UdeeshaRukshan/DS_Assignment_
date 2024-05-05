import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import PaymentComponent from './components/payment/payment';
import SubmitTicketForm from './components/support/submitTicket/submitTicketForm.js';
import {MyTickets} from './components/support/myTicket/myTicket.js';

// Import other components if necessary
// import SupportQuesPage from './components/support/SupportQuesPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/ticket/submit" element={<SubmitTicketForm />} />
          <Route path="/ticket/mytickets" element={<MyTickets />} />
          {/* Uncomment and ensure the component is imported if you want to use it */}
          {/* <Route path="/support/supportQues" element={<SupportQuesPage />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;