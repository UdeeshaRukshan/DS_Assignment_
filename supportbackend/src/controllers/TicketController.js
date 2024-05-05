const Ticket = require('../models/TicketModel'); // Update the path according to your project structure

// Create a new Ticket
const createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Retrieve all Tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Retrieve a single Ticket by ID
const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).send();
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Delete a Ticket
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).send();
        }
        res.status(200).send(ticket);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    deleteTicket
};
