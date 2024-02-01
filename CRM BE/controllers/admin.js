const bcrypt = require('bcryptjs')
const Admin = require('../models/admin');
const Ticket = require('../models/ticket');

const adminControllers = {
    assignAdmin: async (req, res) => {
        try {
            const { ticketId, adminId } = req.params;

            const ticket = await Ticket.findOne({ _id: ticketId })
            const admin = await Admin.findById(adminId);

            if (ticket && admin && ticket.assignedTo == null) {
                ticket.assignedTo = admin.name;
                ticket.status = 'In Progress';
                await ticket.save();

                admin.tickets.push(ticket._id);
                await admin.save();

                return res.status(200).json({ message: 'Admin assigned successfully' });
            }

            return res.status(400).json({ message: 'Invalid ticket or admin' });
        } catch (e) {
            console.log('AssignAdmin error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },
    getAdminTickets: async (req, res) => {
        try {
            const { adminId } = req.params;
            const admin = await Admin.findById(adminId).populate('tickets');

            if (admin) {
                return res.status(200).json(admin.tickets);
            }

            return res.status(400).json({ message: 'Invalid admin' });
        } catch (e) {
            console.log('GetAdminTickets error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },
    closeTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const ticket = await Ticket.findById(ticketId);

            if (ticket && ticket.assignedTo) {
                ticket.status = 'Closed';
                await ticket.save();

                return res.status(200).json({ message: 'Ticket closed successfully' });
            }

            return res.status(400).json({ message: 'Invalid ticket or ticket not assigned' });
        } catch (e) {
            console.log('CloseTicket error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },
}

module.exports = adminControllers;
