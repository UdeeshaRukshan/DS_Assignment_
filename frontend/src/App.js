import React,{ useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import PaymentComponent from './components/payment/payment';
import SubmitTicketForm from './components/support/submitTicket/submitTicketForm.js';
import { MyTickets } from './components/support/myTicket/myTicket.js';
import EmojiFeedback from './components/feedback/emojiFeedback.js';
import styled from "styled-components";
// Import other components if necessary
// import SupportQuesPage from './components/support/SupportQuesPage';
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
        
          <Route path="/emoji" element={<AppStyles>
            <EmojiFeedback
              activeReaction={activeReaction}
              setActiveReaction={setActiveReaction}
            />
          </AppStyles>} />  
          {/* <Route path="/emoji" element={<Emoji />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;