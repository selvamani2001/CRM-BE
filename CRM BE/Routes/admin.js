const express = require('express');
const authenticate = require('../middleware/auth');
const adminControllers = require('../controllers/admin');
const ProductController = require('../controllers/product');
const adminRouter = express.Router();

// adminRouter.post('/', adminControllers.signup)
adminRouter.patch('/:ticketId/:adminId', authenticate, adminControllers.assignAdmin)
adminRouter.get('/:adminId', authenticate, adminControllers.getAdminTickets)
adminRouter.put('/:ticketId', adminControllers.closeTicket)

adminRouter.post('/', authenticate, ProductController.createProduct)
adminRouter.get('/', authenticate, ProductController.getProduct)
adminRouter.delete('/:id',authenticate,ProductController.deleteProduct)

module.exports = adminRouter;