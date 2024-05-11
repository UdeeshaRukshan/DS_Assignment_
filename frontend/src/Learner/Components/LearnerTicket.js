import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import '../../App.css'; // Make sure to import your CSS file

function LearnerTickets() {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/tickets/663a585b4e816895571374a9');
        setTicket(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchTicket();
  }, []);
  const handleDelete = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8070/api/tickets/${ticketId}`);
      setTicket(null); // Remove the ticket from the state or handle as needed
      alert('Ticket deleted successfully'); // Notify user or handle differently
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };
  return (
    <div className="container mt-5">
      <h2>User Submitted Ticket</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>State</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ticket ? (
            <tr className={ticket.state === 'resolved' ? 'resolved' : ''} font-semibold>
              <td className='font-semibold'>{ticket.name}</td>
              <td className='font-semibold'>{ticket.email}</td>
              <td className='font-semibold'>{ticket.category}</td>
              <td className='font-semibold'>{ticket.subject}</td>
              <td className='font-semibold'>{ticket.state}</td>
              <td className='font-semibold'>{ticket.replies[0]?.message}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(ticket._id)}>Delete</Button>
              </td>
            </tr>
          ) : (
            <tr><td colSpan="7">No ticket found or loading...</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default LearnerTickets;