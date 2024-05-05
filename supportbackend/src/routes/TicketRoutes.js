const express = require('express');
const TicketRouter = express.Router();
const {
    createTicket,
    getAllTickets,
    getTicketById,
    deleteTicket
} = require('../controllers/TicketController'); // Ensure this path is correct

// Route to create a new ticket
TicketRouter.post('/tickets', createTicket);

// Route to retrieve all tickets
TicketRouter.get('/tickets', getAllTickets);

// Route to retrieve a specific ticket by ID
TicketRouter.get('/tickets/:id', getTicketById);

// Route to delete a specific ticket by ID
TicketRouter.delete('/tickets/:id', deleteTicket);

module.exports = TicketRouter;
