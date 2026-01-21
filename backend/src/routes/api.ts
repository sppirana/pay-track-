import express from 'express';
import { Customer } from '../models/Customer';
import { Transaction } from '../models/Transaction';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// CUSTOMER ROUTES
router.get('/customers', async (req: AuthRequest, res) => {
    try {
        const customers = await Customer.find({ userId: req.user?.id });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

router.post('/customers', async (req: AuthRequest, res) => {
    try {
        const customer = new Customer({
            ...req.body,
            userId: req.user?.id
        });
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create customer' });
    }
});

// TRANSACTION ROUTES
router.get('/transactions', async (req: AuthRequest, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user?.id });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

router.post('/transactions', async (req: AuthRequest, res) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            userId: req.user?.id
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create transaction' });
    }
});

router.put('/transactions/:id', async (req: AuthRequest, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user?.id
        });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

        Object.assign(transaction, req.body);
        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update transaction' });
    }
});

router.delete('/transactions/:id', async (req: AuthRequest, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?.id
        });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

export default router;

