const express = require('express');
const router = express.Router();
const Ticket = require('../models/TicketModel'); // Import your Ticket model

// POST: Create a new ticket
router.post('/', async (req, res) => {
    const ticket = new Ticket({
        name: req.body.name,
        email: req.body.email,
        category: req.body.category,
        subject: req.body.subject,
        message: req.body.message
    });
    try {
        const savedTicket = await ticket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Retrieve all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve a single ticket by id
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) res.status(404).json({ message: "No ticket found" });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH: Update a ticket by id
router.patch('/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete a ticket
router.delete('/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: "Ticket deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
